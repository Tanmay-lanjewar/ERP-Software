# ERP Desktop (Electron)

This wraps the existing ERP front-end into a desktop app with an offline-first sync queue. It packages into a single `.exe` for Windows.

Build steps:
- Ensure Node.js is installed.
- In `front/`, run `npm install` and then `npm run build` once.
- In `desktop/`, run `npm install` and then `npm run dist` to generate the installer.

Runtime notes:
- The renderer can call `window.desktop.queueRequest({ method, endpoint, body })` to queue API calls while offline.
- The app periodically tries to flush queued requests to the remote API (default `http://localhost:5000/api`). Set `REMOTE_API_BASE` env to your VPS API base.