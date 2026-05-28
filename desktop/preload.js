const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  queueRequest: (req) => ipcRenderer.invoke('queue-request', req),
  flushQueue: () => ipcRenderer.invoke('flush-queue'),
  appVersion: () => require('./package.json').version,
  openHtmlExternally: (html, name) => ipcRenderer.invoke('open-html-external', html, name),
  openHtmlPreview: (html, name) => ipcRenderer.invoke('open-html-preview', html, name),
  getAssetDataUrl: (assetName) => ipcRenderer.invoke('get-asset-data-url', assetName)
});