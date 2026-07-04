const ApiCache = (() => {
  const _cache = {};

  function get(key) {
    const entry = _cache[key];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      delete _cache[key];
      return null;
    }
    return entry.data;
  }

  function set(key, data, ttl) {
    _cache[key] = { data, timestamp: Date.now(), ttl: ttl || CONFIG.CACHE_TTL };
  }

  function has(key) {
    return get(key) !== null;
  }

  function clear() {
    for (const key in _cache) delete _cache[key];
  }

  return { get, set, has, clear };
})();

function apiURL(path) {
  const base = CONFIG.API_BASE_URL.replace(/\/+$/, '');
  const prefix = CONFIG.API_PREFIX.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}${prefix}/${cleanPath}`;
}

async function fetchWithTimeout(url, options = {}, timeout = CONFIG.TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function escapeHTML(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function sanitizeURL(url) {
  if (!url) return '';
  const s = String(url).trim();
  if (/^(javascript|data|vbscript|file):/i.test(s)) return '';
  return s;
}

async function fetchJSON(url, options = {}) {
  const cacheKey = `${options.method || 'GET'}:${url}`;

  if (!options.method || options.method === 'GET') {
    const cached = ApiCache.get(cacheKey);
    if (cached) return cached;
  }

  let lastError = null;

  for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, CONFIG.RETRY_DELAY * attempt));
      }

      const response = await fetchWithTimeout(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!options.method || options.method === 'GET') {
        ApiCache.set(cacheKey, data, options.cacheTTL);
      }

      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        lastError = new Error('Request timed out');
      } else {
        lastError = err;
      }
    }
  }

  throw lastError;
}
