"""
Serviço de integração com a API Stormglass para dados meteorológicos reais
"""

import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import requests


class WeatherService:
    def __init__(self) -> None:
        self.api_url = os.getenv("STORMGLASS_API_URL", "https://api.stormglass.io/v2")
        self.api_key = os.getenv("STORMGLASS_API_KEY")
        self.headers = {"Authorization": self.api_key}

        # Coordenadas dos locais de mergulho em Portugal
        self.locations = {
            "berlengas": {"lat": 39.4161, "lng": -9.5056},
            "peniche": {"lat": 39.3558, "lng": -9.3811},
            "sesimbra": {"lat": 38.4444, "lng": -9.1014},
        }

        # Cache simples para evitar muitas chamadas à API (15 minutos)
        self._cache: Dict[str, tuple[datetime, Dict]] = {}
        self._cache_duration = 900

    def get_weather_data(self, location: str) -> Optional[Dict]:
        """Obtém dados meteorológicos atuais para um local específico (payload achatado)."""
        if not location:
            return None

        location_key = location.lower()
        if location_key not in self.locations:
            return None

        # cache por minuto
        cache_key = f"{location_key}_{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        if cache_key in self._cache:
            cached_time, cached_data = self._cache[cache_key]
            if (datetime.utcnow() - cached_time).seconds < self._cache_duration:
                return cached_data

        try:
            raw_data = self._fetch_stormglass_data(location_key)
            if raw_data:
                processed = self._process_weather_data(raw_data, location_key)
                self._cache[cache_key] = (datetime.utcnow(), processed)
                return processed
        except Exception as e:  # pragma: no cover
            print(f"Erro ao obter dados da Stormglass: {e}")

        # Fallback para dados mock realistas
        return self._get_mock_data(location_key)

    def _fetch_stormglass_data(self, location: str) -> Optional[Dict]:
        """Faz a chamada real à API Stormglass."""
        if not self.api_key:
            raise Exception("API Key da Stormglass não configurada")

        coords = self.locations[location]

        # Parâmetros meteorológicos relevantes para mergulho
        params = ",".join(
            [
                "waveHeight",
                "wavePeriod",
                "windSpeed",
                "gust",
                "precipitation",
                "visibility",
                "waterTemperature",
                "airTemperature",
            ]
        )

        # Próximas 3 horas
        start_time = datetime.utcnow().isoformat()
        end_time = (datetime.utcnow() + timedelta(hours=3)).isoformat()

        url = f"{self.api_url}/weather/point"
        request_params = {
            "lat": coords["lat"],
            "lng": coords["lng"],
            "params": params,
            "start": start_time,
            "end": end_time,
        }

        response = requests.get(url, headers=self.headers, params=request_params, timeout=10)
        if response.status_code == 200:
            return response.json()

        print(f"Erro na API Stormglass: {response.status_code} - {response.text}")
        return None

    def _process_weather_data(self, raw_data: Dict, location: str) -> Dict:
        """Processa os dados brutos da API Stormglass e calcula o status do semáforo."""
        hours = raw_data.get("hours") or []
        if not hours:
            return self._get_mock_data(location)

        # Pegar o primeiro bloco horário (mais recente)
        current_hour = hours[0]

        wave_height = self._get_metric_value(current_hour, "waveHeight") or 0.0
        wave_period = self._get_metric_value(current_hour, "wavePeriod") or 0.0
        wind_speed = self._get_metric_value(current_hour, "windSpeed") or 0.0
        gust = self._get_metric_value(current_hour, "gust") or wind_speed * 1.3
        precipitation = self._get_metric_value(current_hour, "precipitation") or 0.0
        visibility = self._get_metric_value(current_hour, "visibility") or 10.0
        water_temp = self._get_metric_value(current_hour, "waterTemperature") or 18.0
        air_temp = self._get_metric_value(current_hour, "airTemperature") or 20.0

        status = self._calculate_traffic_light_status(
            wave_height, wind_speed, gust, precipitation, visibility
        )

        # Payload achatado (sem "conditions")
        return {
            "location": location.title(),
            "status": status,  # 'GREEN' | 'YELLOW' | 'RED'
            "temperature": round(air_temp, 1),
            "waterTemperature": round(water_temp, 1),
            "waveHeight": round(wave_height, 1),
            "wavePeriod": round(wave_period, 1),
            "windSpeed": round(wind_speed, 1),
            "gust": round(gust, 1),
            "precipitation": round(precipitation, 1),
            "visibility": round(visibility, 1),
            "timestamp": datetime.utcnow().isoformat(),
            "next_update": (datetime.utcnow() + timedelta(minutes=15)).isoformat(),
            "source": "stormglass_api",
        }

    def _get_metric_value(self, hour_data: Dict, metric: str) -> Optional[float]:
        """Extrai o valor de uma métrica usando a primeira fonte disponível."""
        if metric in hour_data and hour_data[metric]:
            for _source, value in hour_data[metric].items():
                if value is not None:
                    return float(value)
        return None

    def _calculate_traffic_light_status(
        self,
        wave_height: float,
        wind_speed: float,
        gust: float,
        precipitation: float,
        visibility: float,
    ) -> str:
        """
        Calcula o status do semáforo baseado nas condições meteorológicas.

        GREEN: condições ideais
        YELLOW: atenção
        RED: perigoso
        """
        wave_height = wave_height or 0
        wind_speed = wind_speed or 0
        gust = gust or 0
        precipitation = precipitation or 0
        visibility = visibility or 10

        # Vermelho (perigoso)
        if (
            wave_height > 2.0
            or wind_speed > 25
            or gust > 35
            or precipitation > 50
            or visibility < 2
        ):
            return "RED"

        # Amarelo (atenção)
        if (
            wave_height > 1.2
            or wind_speed > 15
            or gust > 25
            or precipitation > 20
            or visibility < 5
        ):
            return "YELLOW"

        # Verde (ideal)
        return "GREEN"

    def _get_mock_data(self, location: str) -> Dict:
        """Retorna dados fictícios quando a API não está disponível."""
        mock_conditions = {
            "berlengas": {
                "waveHeight": 0.8,
                "windSpeed": 12,
                "gust": 18,
                "precipitation": 10,
                "visibility": 8,
                "waterTemperature": 18,
                "airTemperature": 20,
                "wavePeriod": 8,
            },
            "peniche": {
                "waveHeight": 1.2,
                "windSpeed": 16,
                "gust": 22,
                "precipitation": 25,
                "visibility": 6,
                "waterTemperature": 17,
                "airTemperature": 19,
                "wavePeriod": 7,
            },
            "sesimbra": {
                "waveHeight": 0.6,
                "windSpeed": 10,
                "gust": 15,
                "precipitation": 5,
                "visibility": 10,
                "waterTemperature": 19,
                "airTemperature": 21,
                "wavePeriod": 9,
            },
        }

        c = mock_conditions.get(location.lower(), mock_conditions["berlengas"])
        status = self._calculate_traffic_light_status(
            c["waveHeight"], c["windSpeed"], c["gust"], c["precipitation"], c["visibility"]
        )

        return {
            "location": location.title(),
            "status": status,
            "temperature": c["airTemperature"],
            "waterTemperature": c["waterTemperature"],
            "waveHeight": c["waveHeight"],
            "wavePeriod": c["wavePeriod"],
            "windSpeed": c["windSpeed"],
            "gust": c["gust"],
            "precipitation": c["precipitation"],
            "visibility": c["visibility"],
            "timestamp": datetime.utcnow().isoformat(),
            "next_update": (datetime.utcnow() + timedelta(minutes=15)).isoformat(),
            "source": "mock_data",
        }

    def get_all_locations_weather(self) -> List[Dict]:
        """Obtém dados meteorológicos para todos os locais."""
        results = []
        for location in self.locations.keys():
            weather_data = self.get_weather_data(location)
            if weather_data:
                results.append(weather_data)
        return results

    def force_status(self, location: str, status: str, note: str = None) -> Dict:
        """Força um status específico para um local (para demonstrações)."""
        if status not in ["GREEN", "YELLOW", "RED"]:
            raise ValueError("Status deve ser GREEN, YELLOW ou RED")

        # Gerar condições fictícias baseadas no status forçado
        if status == "GREEN":
            conditions = {
                "waveHeight": 0.5,
                "windSpeed": 8,
                "gust": 12,
                "precipitation": 0,
                "visibility": 10,
                "waterTemperature": 18,
                "airTemperature": 20,
                "wavePeriod": 9,
            }
        elif status == "YELLOW":
            conditions = {
                "waveHeight": 1.5,
                "windSpeed": 18,
                "gust": 25,
                "precipitation": 30,
                "visibility": 4,
                "waterTemperature": 16,
                "airTemperature": 18,
                "wavePeriod": 7,
            }
        else:  # RED
            conditions = {
                "waveHeight": 2.5,
                "windSpeed": 30,
                "gust": 40,
                "precipitation": 60,
                "visibility": 1,
                "waterTemperature": 15,
                "airTemperature": 17,
                "wavePeriod": 6,
            }

        return {
            "location": location.title(),
            "status": status,
            "temperature": conditions["airTemperature"],
            "waterTemperature": conditions["waterTemperature"],
            "waveHeight": conditions["waveHeight"],
            "wavePeriod": conditions["wavePeriod"],
            "windSpeed": conditions["windSpeed"],
            "gust": conditions["gust"],
            "precipitation": conditions["precipitation"],
            "visibility": conditions["visibility"],
            "timestamp": datetime.utcnow().isoformat(),
            "next_update": (datetime.utcnow() + timedelta(minutes=15)).isoformat(),
            "forced": True,
            "note": note or f"Status forçado para {status} para demonstração",
        }


# Instância global do serviço meteorológico
weather_service = WeatherService()
