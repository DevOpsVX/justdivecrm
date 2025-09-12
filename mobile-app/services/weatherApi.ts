const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export async function getCurrentWeather(location: string) {
  const response = await fetch(`${API_URL}/api/weather/current/${location}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar dados meteorológicos')
  }
  return response.json()
}
