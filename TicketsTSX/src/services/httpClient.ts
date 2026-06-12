const defaultBaseUrl = 'http://localhost:8000/api/v1';

const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export async function request(path, options = {}) {
  const token = readToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });
  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
    }
    throw new Error(formatRequestError(payload, response.status));
  }

  return payload;
}

async function parseResponsePayload(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();

  if (!rawBody.trim()) {
    return null;
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  }

  return rawBody;
}

function formatRequestError(payload, statusCode) {
  if (typeof payload === 'string') {
    return payload;
  }

  const detail = payload?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const path = Array.isArray(item?.loc) ? item.loc.join('.') : 'field';
        const message = item?.msg || 'Invalid value';
        return `${path}: ${message}`;
      })
      .join(' | ');
  }

  if (detail && typeof detail === 'object') {
    return JSON.stringify(detail);
  }

  return `Request failed (${statusCode})`;
}


const readToken = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const token = auth?.token;
    return token;
  } catch {
    clearAuthSession();
    return null;
  }
}

const clearAuthSession = () => {
  localStorage.removeItem('auth');
  window.dispatchEvent(new Event('auth:logout'));
}