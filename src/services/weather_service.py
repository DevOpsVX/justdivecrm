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
        """Obtém dados meteorológicos atuais para um local específico."""

        location_key = location.lower()
        if location_key not in self.locations:
            return None

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
        except Exception as e:  # pragma: no cover - log de erro simples
            print(f"Erro ao obter dados da Stormglass: {e}")

        # Fallback para dados mock realistas
        return self._get_mock_data(location_key)

    def _fetch_stormglass_data(self, location: str) -> Optional[Dict]:
        """Faz a chamada real à API Stormglass."""

        if not self.api_key:
            raise Exception("API Key da Stormglass não configurada")

        coords = self.locations[location]
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

        response = requests.get(
            url, headers=self.headers, params=request_params, timeout=10
        )
        if response.status_code == 200:
            return response.json()

        print(
            f"Erro na API Stormglass: {response.status_code} - {response.text}"
        )
        return None

    def _process_weather_data(self, raw_data: Dict, location: str) -> Dict:
        """Processa os dados brutos da API Stormglass."""

        if not raw_data or "hours" not in raw_data or not raw_data["hours"]:
            raise Exception("Dados inválidos da API Stormglass")

        current_hour = raw_data["hours"][0]

        wave_height = self._get_metric_value(current_hour, "waveHeight") or 0.5
        wind_speed = self._get_metric_value(current_hour, "windSpeed") or 10
        gust = self._get_metric_value(current_hour, "gust") or wind_speed * 1.3
        precipitation = self._get_metric_value(current_hour, "precipitation") or 0
        visibility = self._get_metric_value(current_hour, "visibility") or 10
        water_temp = self._get_metric_value(current_hour, "waterTemperature") or 18
        air_temp = self._get_metric_value(current_hour, "airTemperature") or 20

        status = self._determine_status(
            wave_height, wind_speed, gust, precipitation, visibility
        )

        return {
            "location": location.title(),
            "status": status,
            "conditions": {
                "wave_height": round(wave_height, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_gust": round(gust, 1),
                "precipitation": round(precipitation, 1),
                "visibility": round(visibility, 1),
                "water_temperature": round(water_temp, 1),
                "air_temperature": round(air_temp, 1),
            },
            "timestamp": datetime.utcnow().isoformat(),
            "next_update": "15 minutos",
            "source": "stormglass_api",
        }

    def _get_metric_value(self, hour_data: Dict, metric: str) -> Optional[float]:
        """Extrai o valor de uma métrica usando a primeira fonte disponível."""

        if metric in hour_data and hour_data[metric]:
            for _source, value in hour_data[metric].items():
                if value is not None:
                    return float(value)
        return None

    def _determine_status(
        self,
        wave_height: float,
        wind_speed: float,
        gust: float,
        precipitation: float,
        visibility: float,
    ) -> str:
        """Determina o status do semáforo baseado nas condições meteorológicas."""

        red_conditions = [
            wave_height > 2.0,
            wind_speed > 25,
            gust > 35,
            precipitation > 70,
            visibility < 2,
        ]
        yellow_conditions = [
            wave_height > 1.2,
            wind_speed > 18,
            gust > 25,
            precipitation > 40,
            visibility < 5,
        ]

        if any(red_conditions):
            return "RED"
        if any(yellow_conditions):
            return "YELLOW"
        return "GREEN"

    def _get_mock_data(self, location: str) -> Dict:
        """Retorna dados fictícios quando a API não está disponível."""

        mock_conditions = {
            "berlengas": {
                "wave_height": 0.8,
                "wind_speed": 12,
                "wind_gust": 18,
                "precipitation": 10,
                "visibility": 8,
                "water_temperature": 18,
                "air_temperature": 20,
            },
            "peniche": {
                "wave_height": 1.2,
                "wind_speed": 16,
                "wind_gust": 22,
                "precipitation": 25,
                "visibility": 6,
                "water_temperature": 17,
                "air_temperature": 19,
            },
            "sesimbra": {
                "wave_height": 0.6,
                "wind_speed": 10,
                "wind_gust": 15,
                "precipitation": 5,
                "visibility": 10,
                "water_temperature": 19,
                "air_temperature": 21,
            },
        }

        conditions = mock_conditions.get(location.lower(), mock_conditions["berlengas"])
        status = self._determine_status(
            conditions["wave_height"],
            conditions["wind_speed"],
            conditions["wind_gust"],
            conditions["precipitation"],
            conditions["visibility"],
        )

        return {
            "location": location.title(),
            "status": status,
            "conditions": conditions,
            "timestamp": datetime.utcnow().isoformat(),
            "next_update": "15 minutos",
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

        if status == "GREEN":
            conditions = {
                "wave_height": 0.5,
                "wind_speed": 8,
                "wind_gust": 12,
                "precipitation": 0,
                "visibility": 10,
                "water_temperature": 18,
            }
        elif status == "YELLOW":
            conditions = {
                "wave_height": 1.5,
                "wind_speed": 18,
                "wind_gust": 25,
                "precipitation": 30,
                "visibility": 4,
                "water_temperature": 16,
            }
        else:  # RED
            conditions = {
                "wave_height": 2.5,
                "wind_speed": 30,
                "wind_gust": 40,
                "precipitation": 60,
                "visibility": 1,
                "water_temperature": 15,
            }

        return {
            "location": location.title(),
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            "conditions": conditions,
            "next_update": (datetime.utcnow() + timedelta(minutes=15)).isoformat(),
            "forced": True,
            "note": note or f"Status forçado para {status} para demonstração",
        }


# Instância global do serviço meteorológico
weather_service = WeatherService()

