import { widget, Text, View, useWidgetData } from "expo-widget";

type Weather = {
  status: string;
  waves: string;
  wind: string;
};

export default function WeatherWidget({ location }: { location: string }) {
  const data = useWidgetData<Weather>(async () => {
    const response = await fetch(`/api/weather/widget/${location}`);
    return response.json();
  });

  return widget(
    <View>
      <Text>{data?.status ?? "..."}</Text>
      <Text>Ondas: {data?.waves ?? "..."}</Text>
      <Text>Vento: {data?.wind ?? "..."}</Text>
    </View>
  );
}
