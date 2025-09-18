import { buildApiUrl } from '../constants/api';

export const WEATHER_ERROR_MESSAGE =
  'Não foi possível carregar os dados meteorológicos. Verifique a sua ligação e tente novamente.';

export async function getCurrentWeather(location: string) {
  const endpoint = `/api/weather/current/${encodeURIComponent(location)}`;
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Resposta inválida ao obter dados meteorológicos (${response.status}) para ${location}.`,
      );
      throw new Error(WEATHER_ERROR_MESSAGE);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao comunicar com o serviço meteorológico:', error);

    if (error instanceof Error && error.message === WEATHER_ERROR_MESSAGE) {
      throw error;
    }

    throw new Error(WEATHER_ERROR_MESSAGE);
  }
}
