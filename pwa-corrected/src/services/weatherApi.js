export async function getCurrentWeather(location) {
  const baseUrl = import.meta.env.VITE_API_URL || ''
  const response = await fetch(`${baseUrl}/api/weather/current/${location}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar dados meteorológicos')
  }
  return response.json()
}
