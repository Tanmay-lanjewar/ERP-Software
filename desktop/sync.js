const fs = require('fs');
const path = require('path');

const REMOTE_BASE = process.env.REMOTE_API_BASE || process.env.VPS_API_BASE || 'http://72.62.227.63:5001/api';

function ensureFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({ seq: 0, queue: [] }, null, 2));
}

function readState(filePath) {
  try {
    ensureFile(filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    try { return JSON.parse(raw); } catch { return { seq: 0, queue: [] }; }
  } catch (err) {
    console.error('Failed to read sync state:', err);
    return { seq: 0, queue: [] };
  }
}

function writeState(filePath, state) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('Failed to write sync state:', err);
  }
}

function createSyncQueue(filePath) {
  ensureFile(filePath);
  return {
    filePath,
    enqueue: ({ method, endpoint, body }) => {
      const state = readState(filePath);
      const id = ++state.seq;
      state.queue.push({ id, method, endpoint, body: body ? JSON.stringify(body) : null, created_at: new Date().toISOString(), status: 'pending', error: null });
      writeState(filePath, state);
      return { id };
    },
    listPending: () => {
      const state = readState(filePath);
      return state.queue.filter(q => q.status === 'pending');
    },
    markDone: (id) => {
      const state = readState(filePath);
      const item = state.queue.find(q => q.id === id);
      if (item) { item.status = 'synced'; item.error = null; }
      writeState(filePath, state);
    },
    markError: (id, err) => {
      const state = readState(filePath);
      const item = state.queue.find(q => q.id === id);
      if (item) { item.status = 'error'; item.error = err?.message || String(err); }
      writeState(filePath, state);
    }
  };
}

async function flushQueue(sync) {
  const pending = sync.listPending();
  for (const row of pending) {
    const url = REMOTE_BASE + row.endpoint;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const bodyObj = row.body ? JSON.parse(row.body) : undefined;
      const res = await fetch(url, {
        method: row.method,
        headers: { 'Content-Type': 'application/json' },
        body: bodyObj ? JSON.stringify(bodyObj) : undefined,
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      sync.markDone(row.id);
    } catch (err) {
      clearTimeout(timer);
      sync.markError(row.id, err);
    }
  }
}

module.exports = { createSyncQueue, flushQueue };