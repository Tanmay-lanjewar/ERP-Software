// In-app preview for HTML content. In desktop, opens a modal window; on web, falls back to new tab.
export async function openHtmlPreview(html, name) {
  try {
    // If running inside desktop, attempt to inline the logo to ensure it renders in data URLs
    if (window.desktop && typeof window.desktop.openHtmlPreview === 'function') {
      let htmlToSend = html || '';
      try {
        if (typeof window.desktop.getAssetDataUrl === 'function') {
          const res = await window.desktop.getAssetDataUrl('logo192.png');
          if (res && res.ok && res.dataUrl) {
            const dataUrl = res.dataUrl;
            // Replace common logo references with embedded data URL
            htmlToSend = htmlToSend
              .replace(/src=["']\/?logo192\.png["']/gi, `src="${dataUrl}"`)
              .replace(/url\(["']?\/?logo192\.png["']?\)/gi, `url(${dataUrl})`);
          }
        }
      } catch {}
      return window.desktop.openHtmlPreview(htmlToSend, name);
    }
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html || '');
    w.document.close();
    w.focus();
  } catch (err) {
    console.error('openHtmlPreview failed:', err);
  }
}