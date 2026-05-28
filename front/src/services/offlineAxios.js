import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://72.62.227.63:5001/api';

function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function hasDesktopBridge() {
  return typeof window !== 'undefined' && window.desktop && typeof window.desktop.queueRequest === 'function';
}

function normalizeUrl(url) {
  // If relative like '/invoice', prefix API_BASE
  if (url.startsWith('/')) return API_BASE + url;
  return url;
}

function extractEndpoint(url) {
  try {
    const u = new URL(normalizeUrl(url));
    const idx = u.pathname.indexOf('/api');
    const path = idx >= 0 ? u.pathname.substring(idx + 4) : u.pathname; // part after /api
    const query = u.search || '';
    return path + query; // include query for server if needed
  } catch {
    // Fallback: if url already looks like '/something', return as is
    return url.replace(API_BASE, '');
  }
}

function cacheKey(url) {
  return `offline_cache:${normalizeUrl(url)}`;
}

// ---- Optimistic local cache helpers ----
function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

function getListFromCache(path) {
  // path like '/customers'
  const key = cacheKey(path);
  const raw = localStorage.getItem(key);
  const data = safeParse(raw, null);
  if (Array.isArray(data)) return data;
  // Some APIs wrap arrays as { data: [...] }
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function setListToCache(path, list) {
  const key = cacheKey(path);
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

function optimisticAppend(path, item) {
  const list = getListFromCache(path);
  const stamped = { ...item, _queued: true, _tempId: Date.now() };
  setListToCache(path, [...list, stamped]);
}

function optimisticUpdateById(path, idField, idValue, updater) {
  const list = getListFromCache(path);
  const updated = list.map((row) => {
    const rowId = row[idField];
    if (String(rowId) === String(idValue)) {
      const next = updater(row);
      return { ...next, _queued: true };
    }
    return row;
  });
  setListToCache(path, updated);
}

async function get(url, config) {
  const fullUrl = normalizeUrl(url);
  if (isOnline()) {
    const res = await axios.get(fullUrl, { timeout: 30000, ...config });
    try {
      localStorage.setItem(cacheKey(url), JSON.stringify(res.data));
    } catch {}
    return res;
  } else {
    const cached = localStorage.getItem(cacheKey(url));
    if (cached) {
      const data = JSON.parse(cached);
      return { data, status: 200 };
    }
    throw new Error('Offline and no cached data available');
  }
}

async function sendWrite(method, url, data, config) {
  const fullUrl = normalizeUrl(url);
  if (hasDesktopBridge()) {
    const endpoint = extractEndpoint(fullUrl);
    await window.desktop.queueRequest({ method, endpoint, body: data });
    if (isOnline()) {
      // Attempt immediate flush for faster UX
      try { await window.desktop.flushQueue(); } catch {}
    }
    // Optimistic local cache update so lists reflect changes immediately
    try {
      const base = (endpoint || '').replace(/\?.*$/, '');
      // Handle collection POSTs
      if (method === 'POST') {
        switch (base) {
          case '/customers':
            optimisticAppend('/customers', data);
            break;
          case '/vendors':
            optimisticAppend('/vendors', data);
            break;
          case '/purchase':
            optimisticAppend('/purchase', data);
            break;
          case '/work-orders':
            optimisticAppend('/work-orders', data);
            break;
          case '/payment-entries':
            optimisticAppend('/payment-entries', data);
            break;
          case '/invoice': {
            const item = data && data.invoice ? data.invoice : data;
            optimisticAppend('/invoice', item);
            break;
          }
          case '/quotation': {
            const item = data && data.quotation ? data.quotation : data;
            optimisticAppend('/quotation', item);
            break;
          }
          default:
            // no-op for other endpoints
            break;
        }
      }

      // Handle updates (e.g., payment settings status changes)
      if ((method === 'PUT' || method === 'PATCH') && base.startsWith('/payment-entries/')) {
        const parts = base.split('/'); // ['', 'payment-entries', ':id']
        const id = parts[2];
        if (id) {
          optimisticUpdateById('/payment-entries', 'payment_id', id, (row) => ({
            ...row,
            ...data,
          }));
        }
      }
    } catch {
      // Swallow optimistic cache errors; not critical to write queueing
    }
    // Return axios-like response indicating queued write
    return { data: { queued: true, endpoint }, status: 202 };
  } else {
    // Web environment fallback: perform network call directly
    return axios({ method, url: fullUrl, data, timeout: 30000, ...config });
  }
}

function post(url, data, config) { return sendWrite('POST', url, data, config); }
function put(url, data, config) { return sendWrite('PUT', url, data, config); }
function patch(url, data, config) { return sendWrite('PATCH', url, data, config); }
function _delete(url, config) { return sendWrite('DELETE', url, undefined, config); }

export default { get, post, put, patch, delete: _delete };