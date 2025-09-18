import { buildApiUrl } from './apiConfig'

const WEATHER_ERROR_MESSAGE = 'Não foi possível carregar os dados meteorológicos. Tente novamente mais tarde.'

export async function getCurrentWeather(location: string) {
  try {
    const endpoint = buildApiUrl(`weather/current/${encodeURIComponent(location)}`)
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(WEATHER_ERROR_MESSAGE)
    }

    return await response.json()
  } catch (error) {
    console.error('Falha ao obter clima atual', error)
    throw new Error(WEATHER_ERROR_MESSAGE)
  }
}
