import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://extpdwyisrfewgtzphmd.supabase.co'       // <- reemplaza
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dHBkd3lpc3JmZXdndHpwaG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzMyMzMsImV4cCI6MjA4MDA0OTIzM30.ua_BDKHbCpX3eLEC0PYqhevNLEsOxpnKR2hxCXDfSck'               // <- reemplaza

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Elements
const email = document.getElementById('email')
const password = document.getElementById('password')
const btnSignIn = document.getElementById('btn-signin')
const btnSignOut = document.getElementById('btn-signout')
const appSection = document.getElementById('app')
const listaVentas = document.getElementById('lista-ventas')

btnSignIn.onclick = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (error) throw error
    await initAfterAuth()
  } catch (e) {
    alert('Error al iniciar sesión: ' + e.message)
  }
}

btnSignOut.onclick = async () => {
  await supabase.auth.signOut()
  btnSignOut.style.display = 'none'
  appSection.style.display = 'none'
  document.getElementById('auth').style.display = 'block'
}

// Cuando el usuario ya esté autenticado
async function initAfterAuth() {
  document.getElementById('auth').style.display = 'none'
  btnSignOut.style.display = 'inline'
  appSection.style.display = 'block'
  await loadVentas()
}

// Cargar ventas (RLS filtra lo que el usuario puede ver)
async function loadVentas() {
  const { data, error } = await supabase
    .from('ventas')
    .select('*')
    .order('fecha', { ascending: false })
  if (error) { console.error(error); alert('Error al cargar ventas: ' + error.message); return; }
  listaVentas.innerHTML = ''
  data.forEach(v => {
    const li = document.createElement('li')
    li.textContent = `${v.fecha ? new Date(v.fecha).toLocaleString() : ''} — ${v.cliente || ''} — ${v.descripcion || ''} — ${v.estado || ''} — $${v.precio_total || 0}`
    listaVentas.appendChild(li)
  })
}

// Crear venta (solo admins podrán insertarla, RLS lo impide para operarios)
document.getElementById('btn-create-sale').onclick = async () => {
  const cliente = document.getElementById('cliente').value
  const descripcion = document.getElementById('descripcion').value
  const precio = parseFloat(document.getElementById('precio').value) || 0
  const { error } = await supabase
    .from('ventas')
    .insert([{ cliente, descripcion, precio_total: precio }])
  if (error) { alert('Error al crear venta: ' + error.message); return }
  document.getElementById('cliente').value = ''
  document.getElementById('descripcion').value = ''
  document.getElementById('precio').value = ''
  await loadVentas()
}

// Realtime para refrescar lista al ocurrir cambios
supabase
  .channel('public:ventas')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'ventas' }, payload => {
    loadVentas()
  })
  .subscribe()

// Si ya estaba logueado (recarga de página), inicializamos
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) initAfterAuth()
})

