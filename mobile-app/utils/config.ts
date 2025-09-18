const DEFAULT_API_BASE = 'http://localhost:5000';

let cachedApiBase: string | null = null;

function normalizeBaseUrl(url: string): string {
  let normalized = url;
  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function getApiBase(): string {
  if (cachedApiBase) {
    return cachedApiBase;
  }

  const envValue = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!envValue) {
    console.warn(
      '[Config] Variável EXPO_PUBLIC_API_URL não definida. Usando base padrão:',
      DEFAULT_API_BASE
    );
    cachedApiBase = DEFAULT_API_BASE;
    return cachedApiBase;
  }

  cachedApiBase = normalizeBaseUrl(envValue);
  return cachedApiBase;
}
