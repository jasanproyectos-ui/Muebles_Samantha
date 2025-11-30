# Muebles Samantha — Intranet (Instrucciones de Supabase)

Este proyecto es una pequeña intranet para el taller de tapicería. Usa Supabase como backend para autenticación, almacenamiento y base de datos (tabla `ventas`). Este README explica cómo configurar Supabase y probar la integración localmente.

## Contenido
- `index.html` — interfaz web
- `styles.css` — estilos responsivos
- `app.js` — lógica de autenticación y CRUD con Supabase

## Requisitos
- Navegador moderno (Chrome/Edge/Firefox)
- Conexión a Internet
- Cuenta en https://supabase.com
- (Opcional) Python instalado para servir archivos estáticos localmente o la extensión Live Server de VSCode

## 1) Crear proyecto en Supabase
1. Entra a https://app.supabase.com y crea un nuevo proyecto.
2. Anota el `Project URL` y la `anon public` key (Settings -> API -> Project API keys). Necesitarás ambos para `app.js`.

**IMPORTANTE:** Nunca subas la `service_role` key al cliente. La `anon` key es la clave pública que el frontend puede usar.

## 2) Crear la tabla `ventas`
Abre SQL Editor en Supabase y ejecuta este SQL de ejemplo para crear la tabla básica:

```sql
create extension if not exists pgcrypto;

create table if not exists public.ventas (
  id uuid primary key default gen_random_uuid(),
  cliente text,
  descripcion text,
  precio_total numeric,
  estado text default 'pendiente',
  fecha timestamptz default now(),
  user_id uuid -- opcional: para enlazar con auth.users
);
```

## 3) Realtime y RLS (seguridad)
Recomendado: habilita Row Level Security (RLS) y define políticas según tu modelo.

Ejemplo mínimo — permitir SELECT a usuarios autenticados (ajusta a tus necesidades):

```sql
-- Habilitar RLS
alter table public.ventas enable row level security;

-- Política: permitir SELECT a cualquier usuario autenticado
create policy "Select for authenticated" on public.ventas
  for select
  using (auth.role() IS NOT NULL);

-- Política: permitir INSERT solo a usuarios autenticados
create policy "Insert for authenticated" on public.ventas
  for insert
  with check (auth.role() IS NOT NULL);
```

Si quieres que solo administradores puedan insertar, necesitarás una columna `is_admin` en `auth.users` o usar claims en JWT y adaptar las políticas.

## 4) Configurar `app.js`
Abre `app.js` y reemplaza las constantes al inicio con tus valores:

```javascript
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_PUBLIC_ANON_KEY';
```

Guarda los cambios.

## 5) Servir y probar localmente
Desde PowerShell, ve a la carpeta del proyecto y abre la página o sirve los archivos:

```powershell
cd 'C:\Users\Administrador\Desktop\Proyecto\Muebles_Samantha'
# Opción 1: abrir directamente (no sirve algunas APIs en algunos navegadores por política de CORS, pero suele funcionar)
Start-Process .\index.html

# Opción 2: servir con Python (recomendado)
python -m http.server 5500
# Luego abre http://localhost:5500 en tu navegador
```

También puedes usar la extensión Live Server de VSCode para servir en `http://127.0.0.1:5500`.

## 6) Probar la funcionalidad
1. En la UI, crea un usuario (Sign Up) desde Supabase Auth o usa el SQL para crear usuarios. Actualmente `app.js` usa `signInWithPassword`, así que debes registrar usuarios en Supabase (Auth -> Users) o implementar un formulario de registro.
2. Inicia sesión desde la UI con un usuario existente. Si la autenticación funciona, la sección `Ventas` se mostrará.
3. Registra una venta con el formulario: cliente, descripción y precio. Si la inserción falla, revisa la consola del navegador (F12) para ver errores (por ejemplo: RLS o claves incorrectas).

### Ver datos directamente en Supabase
- En la sección Table Editor de Supabase puedes ver las filas de `ventas` en tiempo real.

## 7) SQL de ejemplo para insertar filas de prueba

```sql
insert into public.ventas (cliente, descripcion, precio_total)
values ('Juan Pérez','Sillón retapizado', 120.50),
       ('Taller XYZ','Confección de cojines', 65.00);
```

## 8) Realtime (opcional)
`app.js` se suscribe al canal `public:ventas` para recibir actualizaciones en tiempo real; asegúrate de que la funcionalidad Realtime esté activada en tu proyecto Supabase.

## 9) Debug y problemas comunes
- Error: `401` o `unauthorized` -> revisa que la `anon` key y la URL sean correctas.
- Error: operaciones bloqueadas -> revisa políticas RLS en SQL editor.
- Error: CORS / bloqueos al abrir `index.html` directamente -> usa el servidor local con Python o Live Server.

## 10) Buenas prácticas
- No subas la `service_role` key al cliente ni al repositorio público.
- Define políticas RLS estrictas y prueba con usuarios reales.
- Para producción, considera usar funciones de backend si necesitas operaciones privilegiadas.

---

Si quieres, puedo:
- Añadir un script de ejemplo para crear un usuario y probar la API. 
- Añadir una sección en `app.js` para manejar mensajes de error en el formulario (validación) y notificaciones.

¿Deseas que añada validación y mensajes inline en el formulario ahora?