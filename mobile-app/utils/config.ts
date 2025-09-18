const FALLBACK_API_BASE = 'http://localhost:5000';

/**
 * Returns the API base URL configured for the mobile application.
 *
 * The value is read from the Expo public environment variable
 * `EXPO_PUBLIC_API_URL`. When the variable is not defined, a sensible
 * default pointing to the local development server is returned.
 */
export function getApiBase(): string {
  const envValue = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!envValue) {
    console.warn(
      '[Config] EXPO_PUBLIC_API_URL is not defined. Falling back to http://localhost:5000'
    );
    return FALLBACK_API_BASE;
  }

  const normalized = envValue.replace(/\/+$/, '');
  return normalized.length > 0 ? normalized : FALLBACK_API_BASE;
}
