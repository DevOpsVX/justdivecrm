import { widget, Text, View, useWidgetData } from "expo-widget";
import { buildApiUrl } from "../../services/apiConfig";

type Weather = {
  status: string;
  waves: string;
  wind: string;
};

const DEFAULT_WIDGET_DATA: Weather = {
  status: "Dados indisponíveis",
  waves: "--",
  wind: "--",
};

export default function WeatherWidget({ location }: { location: string }) {
  const data = useWidgetData<Weather>(async () => {
    try {
      const endpoint = buildApiUrl(`weather/widget/${encodeURIComponent(location)}`);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Falha ao obter widget: ${response.status}`);
      }

      const payload = await response.json();
      return {
        status: payload?.status ?? DEFAULT_WIDGET_DATA.status,
        waves: payload?.waves ?? DEFAULT_WIDGET_DATA.waves,
        wind: payload?.wind ?? DEFAULT_WIDGET_DATA.wind,
      };
    } catch (error) {
      console.error("Erro ao carregar dados para o widget Expo", error);
      return DEFAULT_WIDGET_DATA;
    }
  });

  const safeData = data ?? DEFAULT_WIDGET_DATA;

  return widget(
    <View>
      <Text>{safeData.status}</Text>
      <Text>Ondas: {safeData.waves}</Text>
      <Text>Vento: {safeData.wind}</Text>
    </View>
  );
}
