const stripTrailingSlashes = (value) =>
  (typeof value === 'string' ? value.replace(/\/+$/, '') : '')

const API_BASE = (() => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${stripTrailingSlashes(window.location.origin)}/api`
  }

  const envBase = import.meta.env.VITE_API_BASE_URL
  if (envBase) {
    return stripTrailingSlashes(envBase)
  }

  return '/api'
})()

export async function fetchCurrentWeather(local) {
  const url = `${API_BASE}/weather/current/${encodeURIComponent(local)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  return res.json()
}
