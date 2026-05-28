export function openHtmlExternally(html, fileName = 'print.html') {
  try {
    // Prefer in-app preview (has asset inlining and reliable print)
    if (window.desktop && typeof window.desktop.openHtmlPreview === 'function') {
      return window.desktop.openHtmlPreview(html, fileName);
    }
    // Fallback: open externally (now also inlined in main process)
    if (window.desktop && typeof window.desktop.openHtmlExternally === 'function') {
      return window.desktop.openHtmlExternally(html, fileName);
    }
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    return Promise.resolve({ ok: true, url });
  } catch (err) {
    console.error('Failed to open HTML externally:', err);
    return Promise.resolve({ ok: false, error: err?.message || String(err) });
  }
}