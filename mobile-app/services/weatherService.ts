export interface WeatherData {
  temperature: number;
  waveHeight: number;
  windSpeed: number;
  visibility: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  [key: string]: any;
}

export async function fetchCurrentWeather(local: string): Promise<WeatherData> {
  const response = await fetch(`/api/weather/current/${encodeURIComponent(local)}`);
  if (!response.ok) {
    throw new Error('Falha ao obter dados meteorológicos');
  }
  return response.json();
}
