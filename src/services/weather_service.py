"""
Serviço de integração com a API Stormglass para dados meteorológicos reais
"""
import os
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional


class WeatherService:
    def __init__(self):
        self.api_url = os.getenv('STORMGLASS_API_URL', 'https://api.stormglass.io/v2')
        self.api_key = os.getenv('STORMGLASS_API_KEY')
        self.headers = {
            'Authorization': self.api_key
        }

        # Coordenadas dos locais de mergulho em Portugal
        self.locations = {
            'berlengas': {'lat': 39.4161, 'lng': -9.5056},
            'peniche': {'lat': 39.3558, 'lng': -9.3811},
            'sesimbra': {'lat': 38.4444, 'lng': -9.1014}
        }

        # Cache simples para evitar muitas chamadas à API
        self._cache = {}
        self._cache_duration = 900  # 15 minutos

    def get_weather_data(self, location: str) -> Optional[Dict]:
        """
        Obtém dados meteorológicos atuais para um local específico
        """
        location_key = location.lower()

        if location_key not in self.locations:
            return None

        # Verificar cache
        cache_key = f"{location_key}_{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        if cache_key in self._cache:
            cached_time, cached_data = self._cache[cache_key]
            if (datetime.utcnow() - cached_time).seconds < self._cache_duration:
                return cached_data

        try:
            # Tentar obter dados reais da API Stormglass
            real_data = self._fetch_stormglass_data(location_key)
            if real_data:
                processed_data = self._process_weather_data(real_data, location_key)
                # Salvar no cache
                self._cache[cache_key] = (datetime.utcnow(), processed_data)
                return processed_data
        except Exception as e:
            print(f"Erro ao obter dados da Stormglass: {e}")

        # Fallback para dados mock realistas
        return self._get_mock_data(location_key)

    def _fetch_stormglass_data(self, location: str) -> Optional[Dict]:
        """
        Faz a chamada real à API Stormglass
        """
        if not self.api_key:
            raise Exception("API Key da Stormglass não configurada")

        coords = self.locations[location]

        # Parâmetros meteorológicos relevantes para mergulho
        params = ','.join([
            'waveHeight',
            'wavePeriod',
            'windSpeed',
            'gust',
            'precipitation',
            'visibility',
            'waterTemperature',
            'airTemperature'
        ])

        # Obter dados para as próximas 3 horas
        start_time = datetime.utcnow().isoformat()
        end_time = (datetime.utcnow() + timedelta(hours=3)).isoformat()

        url = f"{self.api_url}/weather/point"

        request_params = {
            'lat': coords['lat'],
            'lng': coords['lng'],
            'params': params,
            'start': start_time,
            'end': end_time
        }

        response = requests.get(url, headers=self.headers, params=request_params, timeout=10)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Erro na API Stormglass: {response.status_code} - {response.text}")
            return None

    def _process_weather_data(self, raw_data: Dict, location: str) -> Dict:
        """
        Processa os dados brutos da API e calcula o status do semáforo
        """
        if not raw_data.get('hours'):
            return self._get_mock_data(location)

        # Pegar os dados da primeira hora (mais recente)
        current_hour = raw_data['hours'][0]

        # Extrair métricas relevantes
        wave_height = self._get_metric_value(current_hour, 'waveHeight')
        wind_speed = self._get_metric_value(current_hour, 'windSpeed')
        gust = self._get_metric_value(current_hour, 'gust')
        precipitation = self._get_metric_value(current_hour, 'precipitation')
        visibility = self._get_metric_value(current_hour, 'visibility')
        water_temp = self._get_metric_value(current_hour, 'waterTemperature')

        # Calcular status do semáforo baseado nas condições
        status = self._calculate_traffic_light_status(
            wave_height, wind_speed, gust, precipitation, visibility
        )

        return {
            'location': location.title(),
            'status': status,
            'timestamp': datetime.utcnow().isoformat(),
            'conditions': {
                'wave_height': round(wave_height, 1) if wave_height else 0,
                'wind_speed': round(wind_speed, 1) if wind_speed else 0,
                'gust': round(gust, 1) if gust else 0,
                'precipitation': round(precipitation, 1) if precipitation else 0,
                'visibility': round(visibility, 1) if visibility else 10,
                'water_temperature': round(water_temp, 1) if water_temp else 18
            },
            'next_update': (datetime.utcnow() + timedelta(minutes=15)).isoformat(),
            'source': 'stormglass_api'
        }

    def _get_metric_value(self, hour_data: Dict, metric: str) -> Optional[float]:
        """
        Extrai o valor de uma métrica dos dados da hora
        """
        if metric in hour_data and hour_data[metric]:
            # Stormglass retorna múltiplas fontes, pegar a primeira disponível
            sources = hour_data[metric]
            for source_key, value in sources.items():
                if value is not None:
                    return float(value)
        return None

    def _calculate_traffic_light_status(self, wave_height: float, wind_speed: float,
                                        gust: float, precipitation: float, visibility: float) -> str:
        """
        Calcula o status do semáforo baseado nas condições meteorológicas

        Verde: Condições ideais para mergulho
        Amarelo: Condições aceitáveis mas com atenção
        Vermelho: Condições perigosas, mergulho não recomendado
        """
        # Valores padrão se alguma métrica estiver ausente
        wave_height = wave_height or 0
        wind_speed = wind_speed or 0
        gust = gust or 0
        precipitation = precipitation or 0
        visibility = visibility or 10

        # Critérios para status vermelho (perigoso)
        if (wave_height > 2.0 or
            wind_speed > 25 or
            gust > 35 or
            precipitation > 50 or
            visibility < 2):
            return 'RED'

        # Critérios para status amarelo (atenção)
        if (wave_height > 1.2 or
            wind_speed > 15 or
            gust > 25 or
            precipitation > 20 or
            visibility < 5):
            return 'YELLOW'

        # Condições ideais
        return 'GREEN'

    def _get_mock_data(self, location: str) -> Dict:
        """
        Retorna dados fictícios quando a API não está disponível
        """
        mock_conditions = {
            'berlengas': {
                'wave_height': 0.8,
                'wind_speed': 12,
                'gust': 18,
                'precipitation': 10,
                'visibility': 8,
                'water_temperature': 18
            },
            'peniche': {
                'wave_height': 1.2,
                'wind_speed': 16,
                'gust': 22,
                'precipitation': 25,
                'visibility': 6,
                'water_temperature': 17
            },
            'sesimbra': {
                'wave_height': 0.6,
                'wind_speed': 10,
                'gust': 15,
                'precipitation': 5,
                'visibility': 10,
                'water_temperature': 19
            }
        }

        conditions = mock_conditions.get(location.lower(), mock_conditions['berlengas'])

        status = self._calculate_traffic_light_status(
            conditions['wave_height'],
            conditions['wind_speed'],
            conditions['gust'],
            conditions['precipitation'],
            conditions['visibility'],
        )

        return {
            'location': location.title(),
            'status': status,
            'timestamp': datetime.utcnow().isoformat(),
            'conditions': conditions,
            'next_update': (datetime.utcnow() + timedelta(minutes=15)).isoformat(),
            'mock_data': True
        }

    def get_all_locations_weather(self) -> List[Dict]:
        """
        Obtém dados meteorológicos para todos os locais
        """
        results = []
        for location in self.locations.keys():
            weather_data = self.get_weather_data(location)
            if weather_data:
                results.append(weather_data)
        return results

    def force_status(self, location: str, status: str, note: str = None) -> Dict:
        """
        Força um status específico para um local (para demonstrações)
        """
        if status not in ['GREEN', 'YELLOW', 'RED']:
            raise ValueError("Status deve ser GREEN, YELLOW ou RED")

        # Gerar condições fictícias baseadas no status forçado
        if status == 'GREEN':
            conditions = {
                'wave_height': 0.5,
                'wind_speed': 8,
                'gust': 12,
                'precipitation': 0,
                'visibility': 10,
                'water_temperature': 18
            }
        elif status == 'YELLOW':
            conditions = {
                'wave_height': 1.5,
                'wind_speed': 18,
                'gust': 25,
                'precipitation': 30,
                'visibility': 4,
                'water_temperature': 16
            }
        else:  # RED
            conditions = {
                'wave_height': 2.5,
                'wind_speed': 30,
                'gust': 40,
                'precipitation': 60,
                'visibility': 1,
                'water_temperature': 15
            }

        return {
            'location': location.title(),
            'status': status,
            'timestamp': datetime.utcnow().isoformat(),
            'conditions': conditions,
            'next_update': (datetime.utcnow() + timedelta(minutes=15)).isoformat(),
            'forced': True,
            'note': note or f"Status forçado para {status} para demonstração"
        }


# Instância global do serviço meteorológico
weather_service = WeatherService()

