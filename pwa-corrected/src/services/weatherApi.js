const RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'https://justdivecrm-1.onrender.com/api'
const API_BASE = RAW_BASE.replace(/\/+$/, '') // sem barra no fim

export async function fetchCurrentWeather(local) {
  const envLocation =
    typeof import.meta.env.VITE_DEFAULT_LOCATION === 'string'
      ? import.meta.env.VITE_DEFAULT_LOCATION.trim()
      : ''
  const resolvedLocation =
    typeof local === 'string' && local.trim() ? local.trim() : envLocation || 'berlengas'

  const url = `${API_BASE}/weather/current/${encodeURIComponent(resolvedLocation)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }

  const payload = await res.json()

  if (payload?.success === false) {
    const message = payload?.message || 'Erro ao obter condições meteorológicas'
    const error = new Error(message)
    error.response = payload
    throw error
  }

  return payload?.payload?.data ?? payload?.data ?? payload
}
