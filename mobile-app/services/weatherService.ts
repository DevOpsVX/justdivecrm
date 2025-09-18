import { buildApiUrl } from './apiConfig';

export interface WeatherData {
  temperature: number;
  waveHeight: number;
  windSpeed: number;
  visibility: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  [key: string]: any;
}

const WEATHER_ERROR_MESSAGE = 'Não foi possível carregar o clima agora. Verifique sua conexão e tente novamente.';

export async function fetchCurrentWeather(local: string): Promise<WeatherData> {
  try {
    const response = await fetch(buildApiUrl(`weather/current/${encodeURIComponent(local)}`));

    if (!response.ok) {
      throw new Error(WEATHER_ERROR_MESSAGE);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter dados meteorológicos', error);
    throw new Error(WEATHER_ERROR_MESSAGE);
  }
}
