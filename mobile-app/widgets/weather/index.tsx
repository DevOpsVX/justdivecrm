import { widget, Text, View, useWidgetData } from 'expo-widget';

import { buildApiUrl } from '../../constants/api';
import { WEATHER_ERROR_MESSAGE } from '../../services/weatherApi';

type WeatherWidgetData = {
  status: string;
  waves: string;
  wind: string;
  message?: string;
};

function sanitizeWidgetData(payload: unknown): WeatherWidgetData {
  if (!payload || typeof payload !== 'object') {
    throw new Error(WEATHER_ERROR_MESSAGE);
  }

  const data = payload as Record<string, unknown>;

  const status = typeof data.status === 'string' ? data.status : null;
  const waves = typeof data.waves === 'string' ? data.waves : null;
  const wind = typeof data.wind === 'string' ? data.wind : null;

  if (!status || !waves || !wind) {
    throw new Error(WEATHER_ERROR_MESSAGE);
  }

  return { status, waves, wind };
}

export default function WeatherWidget({ location }: { location: string }) {
  const data = useWidgetData<WeatherWidgetData>(async () => {
    try {
      const response = await fetch(
        buildApiUrl(`/api/weather/widget/${encodeURIComponent(location)}`),
      );

      if (!response.ok) {
        throw new Error(WEATHER_ERROR_MESSAGE);
      }

      const payload = await response.json();
      return sanitizeWidgetData(payload);
    } catch (error) {
      console.error('Erro ao carregar dados do widget meteorológico:', error);
      return {
        status: 'Sem dados',
        waves: '--',
        wind: '--',
        message:
          error instanceof Error && error.message
            ? error.message
            : WEATHER_ERROR_MESSAGE,
      };
    }
  });

  return widget(
    <View>
      <Text>{data?.message ?? data?.status ?? '...'}</Text>
      <Text>Ondas: {data?.waves ?? '...'}</Text>
      <Text>Vento: {data?.wind ?? '...'}</Text>
    </View>,
  );
}
