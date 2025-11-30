<!-- Auto-generated guidance for AI coding agents. Edit with care. -->
# Copilot instructions for Muebles_Samantha

This repository is a minimal static-site project. Use these notes to be immediately productive when making changes or implementing features.

- **Repository layout:**
  - `index.html`: site entry page (currently empty).
  - `app.js`: main JavaScript file (client-side behaviour). Keep scripts here.
  - `styles.css`: global styles.

- **Big picture / architecture:**
  - This is a single-page static site (no backend, no bundler detected). Changes are made directly to the three top-level files.
  - There are no build scripts, package.json, or test harness in the repo root. Treat edits as immediate client-side changes.

- **Developer workflows (how to run & test):**
  - Open `index.html` in a browser for quick checks. For a local server (recommended) use one of these PowerShell-friendly commands:

```powershell
# if Python is available
python -m http.server 8000

# or, if Node.js is installed (using npx)
npx http-server -p 8000
```

  - Visit `http://localhost:8000` and verify changes to `index.html`, `styles.css`, and `app.js` reload.

- **Project-specific patterns & conventions:**
  - CSS: global stylesheet at `styles.css` — avoid introducing a CSS preprocessor unless repo is expanded.
  - JS: place DOM-ready code in `app.js`. If adding event handlers, attach them after `DOMContentLoaded`.
    - Example pattern to follow:

```js
document.addEventListener('DOMContentLoaded', () => {
  // initialize UI, attach handlers
});
```

  - Keep markup-focused changes in `index.html`; avoid creating nested build steps.

- **Integration points & dependencies:**
  - No external dependency manifests found. If you add dependencies, also add a `package.json` and document installation steps in README.

- **Commit & PR guidance for AI edits:**
  - Make small, focused commits (one feature or fix per commit).
  - Use clear commit messages: `feat/ui: add product card` or `fix(css): correct header layout`.

- **What not to assume:**
  - Do not assume a bundler, test runner, or server is installed — add them only if you update repository metadata (`package.json`) and include install/run instructions.

- **Examples from this repo:**
  - Update `app.js` for interactive behavior (e.g., product filtering). Update `styles.css` for visual changes and `index.html` for markup.

If anything here is unclear or you want conventions added (e.g., preferred linting, commit hooks, or a build pipeline), tell me which area to expand and I will update this file.
