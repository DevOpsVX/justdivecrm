const resolveApiBase = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin.replace(/\/+$/, '')
    return `${origin}/api`
  }

  const fallback = import.meta.env.VITE_API_BASE_URL
  if (fallback) {
    return fallback.replace(/\/+$/, '')
  }

  return '/api'
}

const API_BASE = resolveApiBase()

export async function fetchCurrentWeather(local) {
  const url = `${API_BASE}/weather/current/${encodeURIComponent(local)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  return res.json()
}
