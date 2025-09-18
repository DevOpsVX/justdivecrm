import pytest

from src.main import app
from src.routes import weather as weather_module


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_weather_analysis_route_returns_textual_response(client, monkeypatch):
    weather_payload = {
        'location': 'Peniche',
        'status': 'GREEN',
        'waveHeight': 1.1,
        'windSpeed': 11.5,
        'gust': 18.2,
        'precipitation': 20,
        'visibility': 8,
        'waterTemperature': 17.2,
        'timestamp': '2024-01-01T00:00:00Z',
        'next_update': '2024-01-01T01:00:00Z',
    }

    analysis_payload = {
        'analysis': 'Condições analisadas com sucesso.',
        'timestamp': '2024-01-01T00:00:00Z',
        'location': 'Peniche',
        'conditions_analyzed': {
            'wave_height': 1.1,
            'wind_speed': 11.5,
        }
    }

    monkeypatch.setattr(weather_module.weather_service, 'get_weather_data', lambda location: weather_payload)
    monkeypatch.setattr(weather_module.openai_service, 'analyze_weather_conditions', lambda data: analysis_payload)

    response = client.get('/api/weather/analysis/peniche')

    assert response.status_code == 200
    data = response.get_json()
    assert data['ai_analysis']['analysis'] == analysis_payload['analysis']
    assert data['ai_analysis']['conditions_analyzed']['wave_height'] == 1.1
