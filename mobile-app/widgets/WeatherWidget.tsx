// eslint-disable-next-line import/no-unresolved
import { WidgetTaskHandler, Widget } from 'react-native-android-widget';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fetchCurrentWeather, WeatherData } from '../services/weatherService';
import { WEATHER_ERROR_MESSAGE } from '../services/weatherApi';

type WidgetWeather = Partial<WeatherData> & { message?: string };

async function getWeather(location: string): Promise<WidgetWeather> {
  try {
    return await fetchCurrentWeather(location);
  } catch (error) {
    console.error('Erro ao atualizar widget meteorológico:', error);
    return {
      message:
        error instanceof Error && error.message
          ? error.message
          : WEATHER_ERROR_MESSAGE,
    };
  }
}

const STATUS_LABELS: Record<WeatherData['status'], string> = {
  GREEN: 'Excelentes condições',
  YELLOW: 'Condições moderadas',
  RED: 'Condições perigosas',
};

function getStatusLabel(weather: WidgetWeather | undefined): string {
  if (!weather) {
    return 'Sem dados';
  }

  if (weather.message) {
    return weather.message;
  }

  const status = weather.status as WeatherData['status'] | undefined;
  if (status && STATUS_LABELS[status]) {
    return STATUS_LABELS[status];
  }

  return 'Sem dados';
}

function getTemperatureLabel(weather: WidgetWeather | undefined): string {
  if (!weather) {
    return '--°C';
  }

  if (typeof weather.temperature === 'number' && Number.isFinite(weather.temperature)) {
    return `${weather.temperature}°C`;
  }

  if (typeof weather.temperature === 'string' && weather.temperature.trim() !== '') {
    return `${weather.temperature}°C`;
  }

  return '--°C';
}

export const WeatherWidget: Widget = ({ weather }: { weather?: WidgetWeather }) => {
  const statusLabel = getStatusLabel(weather);
  const temperatureLabel = getTemperatureLabel(weather);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{statusLabel}</Text>
      <Text style={styles.temp}>{temperatureLabel}</Text>
    </View>
  );
};

WidgetTaskHandler.setBackgroundHandler(async () => {
  const weather = await getWeather('lagos');
  return <WeatherWidget weather={weather} />;
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  status: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
    color: '#1f2937',
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
});
