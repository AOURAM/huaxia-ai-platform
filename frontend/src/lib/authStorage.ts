const STORAGE_KEY = 'huaxia_auth_token';
const MODE_KEY = 'huaxia_auth_persistent';

export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
}

export function persistToken(token: string, remember: boolean) {
  clearStoredToken();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEY, token);
  localStorage.setItem(MODE_KEY, remember ? 'true' : 'false');
}

export function clearStoredToken() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(MODE_KEY);
}