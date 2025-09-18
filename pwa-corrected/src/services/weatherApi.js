const RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'https://justdivecrm-1.onrender.com/api'
const API_BASE = RAW_BASE.replace(/\/+$/, '') // sem barra no fim

export async function fetchCurrentWeather(local) {
  const url = `${API_BASE}/weather/current/${encodeURIComponent(local)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  return res.json()
}
