const DEFAULT_API_URL = 'http://localhost:3000/api';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;
export const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);

export function buildApiUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');

  if (API_BASE_URL.endsWith('/api') && normalizedPath.startsWith('api/')) {
    return `${API_BASE_URL}/${normalizedPath.substring(4)}`;
  }

  return `${API_BASE_URL}/${normalizedPath}`;
}
