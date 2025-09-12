// eslint-disable-next-line import/no-unresolved
import { WidgetTaskHandler, Widget } from 'react-native-android-widget';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

async function getWeather(location: string) {
  const response = await fetch(`/api/weather/current/${location}`);
  return response.json();
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
