const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

const getAccess = () => localStorage.getItem('cmis_token');
const getRefresh = () => localStorage.getItem('cmis_refresh');

const setTokens = (access?: string, refresh?: string) => {
  if (access) localStorage.setItem('cmis_token', access);
  if (refresh) localStorage.setItem('cmis_refresh', refresh);
};

const clearTokens = () => {
  localStorage.removeItem('cmis_token');
  localStorage.removeItem('cmis_refresh');
};

const headers = (isJson = true) => {
  const h: any = {};
  if (isJson) h['Content-Type'] = 'application/json';
  const token = getAccess();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

async function fetchWithRefresh(input: string, init: RequestInit) {
  let res = await fetch(`${API_BASE}${input}`, init);
  if (res.status === 401) {
    // try refresh
    const refresh = getRefresh();
    if (!refresh) {
      clearTokens();
      throw new Error('Unauthorized');
    }
    const r = await fetch(`${API_BASE}/api/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: refresh }) });
    const jr = await r.json();
    if (!jr || !jr.success) {
      clearTokens();
      throw new Error('Unauthorized');
    }
    const newAccess = jr.data.accessToken;
    setTokens(newAccess);
    // retry original
    init.headers = { ...(init.headers || {}), Authorization: `Bearer ${newAccess}` };
    res = await fetch(`${API_BASE}${input}`, init);
  }
  return res.json();
}

export const post = async (path: string, body: any) => {
  return fetchWithRefresh(path, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
};

export const get = async (path: string) => {
  return fetchWithRefresh(path, { method: 'GET', headers: headers(false) });
};

export const put = async (path: string, body: any) => {
  return fetchWithRefresh(path, { method: 'PUT', headers: headers(true), body: JSON.stringify(body) });
};

export const del = async (path: string) => {
  return fetchWithRefresh(path, { method: 'DELETE', headers: headers(false) });
};

export const saveTokens = (access?: string, refresh?: string) => setTokens(access, refresh);
export const clearAllTokens = () => clearTokens();

export default { post, get, put, del, saveTokens, clearAllTokens };
