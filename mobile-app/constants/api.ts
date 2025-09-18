const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function sanitizeBaseUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return DEFAULT_API_BASE_URL;
  }
  return trimmed.replace(/\/+$/, '') || DEFAULT_API_BASE_URL;
}

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL;

export const API_BASE_URL = sanitizeBaseUrl(rawBaseUrl);

export function buildApiUrl(path: string): string {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

