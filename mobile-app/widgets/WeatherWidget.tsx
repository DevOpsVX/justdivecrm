// eslint-disable-next-line import/no-unresolved
import { WidgetTaskHandler, Widget } from 'react-native-android-widget';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { buildApiUrl } from '../services/apiConfig';

type WidgetWeather = {
  status: string;
  temperature: number | string;
};

const DEFAULT_WIDGET_WEATHER: WidgetWeather = {
  status: 'Dados indisponíveis',
  temperature: '--',
};

async function getWeather(location: string): Promise<WidgetWeather> {
  try {
    const endpoint = buildApiUrl(`weather/current/${encodeURIComponent(location)}`);
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error('Resposta inválida da API meteorológica.');
    }

    const data = await response.json();
    return {
      status: data?.status ?? DEFAULT_WIDGET_WEATHER.status,
      temperature: data?.temperature ?? DEFAULT_WIDGET_WEATHER.temperature,
    };
  } catch (error) {
    console.error('Erro ao atualizar o widget meteorológico', error);
    return DEFAULT_WIDGET_WEATHER;
  }
}

export const WeatherWidget: Widget = ({ weather }) => (
  <View style={styles.container}>
    <Text style={styles.status}>{weather.status}</Text>
    <Text style={styles.temp}>{weather.temperature}\u00B0C</Text>
  </View>
);

WidgetTaskHandler.setBackgroundHandler(async () => {
  const weather = await getWeather('default');
  return <WeatherWidget weather={weather} />;
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center'
  },
  status: {
    fontSize: 14,
    marginBottom: 4
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
