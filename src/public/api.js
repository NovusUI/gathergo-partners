const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
const SESSION_KEY = 'gathergo_web_session';

export const readSessionToken = () => sessionStorage.getItem(SESSION_KEY);
export const saveSessionToken = (token) => token ? sessionStorage.setItem(SESSION_KEY, token) : sessionStorage.removeItem(SESSION_KEY);

export async function request(path, { method = 'GET', body, key, signal } = {}) {
  const token = readSessionToken();
  const response = await fetch(`${API_BASE}${path}`, {
    method, signal, headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(key ? { 'Idempotency-Key': key } : {}),
    }, body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.headers.get('content-type')?.includes('application/json'))
    throw new Error('The event service is unavailable. Please try again later.');
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(Array.isArray(result.message) ? result.message.join(' ') : result.message);
    error.status = response.status;
    error.transactionId = result.transactionId;
    throw error;
  }
  return result.data;
}
