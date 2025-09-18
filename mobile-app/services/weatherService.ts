import { getCurrentWeather, WEATHER_ERROR_MESSAGE } from './weatherApi';

export interface WeatherData {
  temperature: number;
  waveHeight: number;
  windSpeed: number;
  visibility: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  [key: string]: any;
}

const VALID_STATUSES: ReadonlyArray<WeatherData['status']> = ['GREEN', 'YELLOW', 'RED'];

function parseNumericField(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error(WEATHER_ERROR_MESSAGE);
}

function parseStatus(value: unknown): WeatherData['status'] {
  if (typeof value === 'string') {
    const normalized = value.toUpperCase() as WeatherData['status'];
    if (VALID_STATUSES.includes(normalized)) {
      return normalized;
    }
  }

  throw new Error(WEATHER_ERROR_MESSAGE);
}

function validateWeatherPayload(payload: unknown): WeatherData {
  if (!payload || typeof payload !== 'object') {
    throw new Error(WEATHER_ERROR_MESSAGE);
  }

  const data = payload as Record<string, unknown>;

  const temperature = parseNumericField(data.temperature);
  const waveHeight = parseNumericField(data.waveHeight);
  const windSpeed = parseNumericField(data.windSpeed);
  const visibility = parseNumericField(data.visibility);
  const status = parseStatus(data.status);

  return {
    ...data,
    temperature,
    waveHeight,
    windSpeed,
    visibility,
    status,
  } as WeatherData;
}

export async function fetchCurrentWeather(local: string): Promise<WeatherData> {
  try {
    const weather = await getCurrentWeather(local);
    return validateWeatherPayload(weather);
  } catch (error) {
    console.error('Falha ao obter dados meteorológicos:', error);

    if (error instanceof Error) {
      throw (error.message ? error : new Error(WEATHER_ERROR_MESSAGE));
    }

    throw new Error(WEATHER_ERROR_MESSAGE);
  }
}
