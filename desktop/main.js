const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = !app.isPackaged;
const { createSyncQueue, flushQueue } = require('./sync');

let mainWindow;

// Disable pinch zoom globally to prevent accidental zoom changes
try { app.commandLine.appendSwitch('disable-pinch'); } catch {}

function resolveAsset(asset) {
  // Front build assets live in resources/app in production, or front/build in dev
  if (!isDev) return path.join(process.resourcesPath, 'app', asset);
  return path.join(__dirname, '..', 'front', 'build', asset);
}

function toMime(ext) {
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'ico':
      return 'image/x-icon';
    default:
      return 'image/png';
  }
}

function inlineLocalAssets(html) {
  if (!html || typeof html !== 'string') return html;
  // Replace src="..." and url(...) that point to local build assets with data URLs
  const srcRegex = /src=["']([^"']+\.(?:png|jpg|jpeg|svg|ico))(?:\?[^"']*)?["']/gi;
  // Also match unquoted src attributes: src=/static/media/xxx.png
  const srcUnquotedRegex = /src=([^\s>"']+\.(?:png|jpg|jpeg|svg|ico))(?:\?[^\s>"']*)?/gi;
  const urlRegex = /url\(["']?([^"')]+\.(?:png|jpg|jpeg|svg|ico))(?:\?[^"')]*)?["']?\)/gi;

  const replacePathWithDataUrl = (p) => {
    try {
      let rel = p;
      // Ignore http(s) URLs
      if (/^https?:\/\//i.test(rel)) return null;
      // Strip leading slash to resolve relative to build root
      rel = rel.replace(/^\//, '');
      const filePath = resolveAsset(rel);
      if (!fs.existsSync(filePath)) return null;
      const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'png';
      const buf = fs.readFileSync(filePath);
      return `data:${toMime(ext)};base64,${buf.toString('base64')}`;
    } catch { return null; }
  };

  html = html.replace(srcRegex, (m, p1) => {
    const data = replacePathWithDataUrl(p1);
    if (!data) return m;
    return `src="${data}"`;
  });
  html = html.replace(srcUnquotedRegex, (m, p1) => {
    const data = replacePathWithDataUrl(p1);
    if (!data) return m;
    return `src="${data}"`;
  });
  html = html.replace(urlRegex, (m, p1) => {
    const data = replacePathWithDataUrl(p1);
    if (!data) return m;
    return `url(${data})`;
  });
  // Fallback: explicitly replace common placeholders with logo192.png if not found
  try {
    const logoPath = resolveAsset('logo192.png');
    if (fs.existsSync(logoPath)) {
      const ext = path.extname(logoPath).toLowerCase().replace('.', '') || 'png';
      const buf = fs.readFileSync(logoPath);
      const logoData = `data:${toMime(ext)};base64,${buf.toString('base64')}`;
      const placeholderSrc = /(src=["'])(?:\/?)(logo\.png|logo192\.png|new\.png|ui\.png|mera\.png)(["'])/gi;
      const placeholderUrl = /(url\(["']?)(?:\/?)(logo\.png|logo192\.png|new\.png|ui\.png|mera\.png)(["']?\))/gi;
      html = html.replace(placeholderSrc, (m, p1, _p2, p3) => `${p1}${logoData}${p3}`);
      html = html.replace(placeholderUrl, (m, p1, _p2, p3) => `${p1}${logoData}${p3}`);
    }
  } catch {}
  return html;
}

function resolveFrontIndex() {
  // In production, front build is copied into resources/app
  const prodIndex = path.join(process.resourcesPath, 'app', 'index.html');
  const devIndex = path.join(__dirname, '..', 'front', 'build', 'index.html');
  if (!isDev && fs.existsSync(prodIndex)) return prodIndex;
  if (fs.existsSync(devIndex)) return devIndex;
  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    icon: resolveAsset('logo192.png'),
    webPreferences: {
      // Ensure a consistent default zoom
      zoomFactor: 1,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  const indexPath = resolveFrontIndex();
  if (!indexPath) {
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent('<h2>Front build not found</h2><p>Please run "npm run build" in front/</p>'));
  } else {
    mainWindow.loadFile(indexPath);
  }

  // Lock zoom to avoid accidental changes and keep UI consistent
  try {
    // Prevent pinch/trackpad zoom and Ctrl+scroll zoom
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
    // Reset any zoom level and enforce factor 1
    mainWindow.webContents.setZoomLevel(0);
    mainWindow.webContents.setZoomFactor(1);
    // Block keyboard zoom shortcuts (Ctrl +, Ctrl -, Ctrl 0)
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input && input.type === 'keyDown' && input.control) {
        const key = (input.key || '').toLowerCase();
        if (key === '+' || key === '-' || key === '=' || key === '0' || key === 'numadd' || key === 'numsub') {
          try {
            mainWindow.webContents.setZoomLevel(0);
            mainWindow.webContents.setZoomFactor(1);
          } catch {}
          event.preventDefault();
        }
      }
    });
  } catch {}

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Set up local sync queue (SQLite) in userData
let sync;
app.on('ready', () => {
  const userData = app.getPath('userData');
  sync = createSyncQueue(path.join(userData, 'erp-desktop.db'));
  createWindow();

  // Periodically try to flush queued requests to remote VPS
  // isFlushing prevents overlapping calls if a flush takes longer than interval
  let isFlushing = false;
  setInterval(async () => {
    if (isFlushing) return;
    isFlushing = true;
    try {
      await flushQueue(sync);
    } catch (err) {
      console.error('Queue flush error:', err);
    } finally {
      isFlushing = false;
    }
  }, 30 * 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// IPC: allow renderer to enqueue API calls when offline
ipcMain.handle('queue-request', async (event, payload) => {
  // payload: { method, endpoint, body }
  return sync.enqueue(payload);
});

ipcMain.handle('flush-queue', async () => {
  await flushQueue(sync);
  return { ok: true };
});

// IPC: open arbitrary HTML content in the user's default browser
// Writes a temporary .html file and opens it outside the Electron app
ipcMain.handle('open-html-external', async (event, html, suggestedName) => {
  try {
    const processed = inlineLocalAssets(html || '');
    const tempDir = app.getPath('temp');
    const fileName = suggestedName && typeof suggestedName === 'string' && suggestedName.trim().length > 0
      ? suggestedName.trim()
      : `print-${Date.now()}.html`;
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, processed || '', 'utf8');
    await shell.openPath(filePath);
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
});

// IPC: open HTML in an in-app preview window
ipcMain.handle('open-html-preview', async (event, html, suggestedName) => {
  try {
    const preview = new BrowserWindow({
      parent: mainWindow || undefined,
      modal: !!mainWindow,
      width: 1000,
      height: 740,
      backgroundColor: '#ffffff',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });
    preview.setMenuBarVisibility(false);

    const processed = inlineLocalAssets(html || '');
    const wrapperHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Print Preview</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body { background: #f6f6f6; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      .toolbar { position: sticky; top: 0; display: flex; gap: 8px; align-items: center; padding: 8px 12px; background: #f0f0f0; border-bottom: 1px solid #ddd; }
      .toolbar button { padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #fff; }
      .container { position: absolute; top: 48px; left: 0; right: 0; bottom: 0; }
      iframe { width: 100%; height: 100%; border: none; background: #fff; }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <strong>Preview</strong>
      <button id="printBtn">Print</button>
      <button id="closeBtn">Close</button>
    </div>
    <div class="container">
      <iframe id="doc"></iframe>
    </div>
    <script>
      const frame = document.getElementById('doc');
      const raw = ${JSON.stringify(processed)};
      frame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(raw);
      function doFramePrint() {
        try {
          const w = frame.contentWindow;
          if (w && typeof w.print === 'function') { w.print(); return true; }
        } catch (e) { console.error('Frame print error', e); }
        return false;
      }
      function fallbackPopupPrint() {
        try {
          const p = window.open('', 'printwin');
          if (!p) return;
          p.document.open();
          p.document.write(raw);
          p.document.close();
          p.focus();
          setTimeout(() => { try { p.print(); } catch {} setTimeout(() => { try { p.close(); } catch {} }, 500); }, 200);
        } catch (e) { console.error('Popup print failed', e); }
      }
      document.getElementById('printBtn').addEventListener('click', () => {
        if (!doFramePrint()) fallbackPopupPrint();
      });
      document.getElementById('closeBtn').addEventListener('click', () => { window.close(); });
    </script>
  </body>
</html>`;

    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(wrapperHtml);
    await preview.loadURL(dataUrl);
    preview.focus();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
});

// IPC: return a data URL for an app asset (e.g., logo192.png)
ipcMain.handle('get-asset-data-url', async (event, assetName) => {
  try {
    const filePath = resolveAsset(assetName);
    const buf = fs.readFileSync(filePath);
    const ext = path.extname(assetName).toLowerCase().replace('.', '') || 'png';
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'ico' ? 'image/x-icon' : 'image/png';
    const dataUrl = `data:${mime};base64,${buf.toString('base64')}`;
    return { ok: true, dataUrl };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
});