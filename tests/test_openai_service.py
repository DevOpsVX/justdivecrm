import pytest
from types import SimpleNamespace
from unittest.mock import patch

from src.services.openai_service import OpenAIService


class DummyResponse(SimpleNamespace):
    pass


@pytest.fixture
def openai_service_instance():
    return OpenAIService()


def test_analyze_weather_conditions_uses_flat_keys(openai_service_instance):
    weather_data = {
        'location': 'Peniche',
        'status': 'GREEN',
        'waveHeight': 1.23,
        'windSpeed': 12.7,
        'gust': None,
        'precipitation': 15.4,
        'visibility': 7.8,
        'waterTemperature': 17.6,
    }

    captured_prompt = {}

    def fake_chat_completion_create(model, messages, max_tokens, temperature):
        captured_prompt['messages'] = messages
        return DummyResponse(
            choices=[SimpleNamespace(message=SimpleNamespace(content='Análise gerada'))]
        )

    with patch('src.services.openai_service.openai.ChatCompletion.create', side_effect=fake_chat_completion_create):
        result = openai_service_instance.analyze_weather_conditions(weather_data)

    prompt = captured_prompt['messages'][1]['content']

    assert 'Altura das ondas: 1.2m' in prompt
    assert 'Velocidade do vento: 12.7 kn' in prompt
    assert 'Rajadas: 0.0 kn' in prompt
    assert result['conditions_analyzed']['wave_height'] == 1.2
    assert result['conditions_analyzed']['water_temperature'] == 17.6
    assert result['analysis'] == 'Análise gerada'


def test_extract_weather_metrics_from_nested_conditions(openai_service_instance):
    weather_data = {
        'location': 'Sesimbra',
        'conditions': {
            'wave_height': 0.9,
            'wind_speed': 10.2,
            'gust': 15.1,
            'precipitation': 5,
            'visibility': 9,
            'water_temperature': 18.5,
        }
    }

    metrics = openai_service_instance._extract_weather_metrics(weather_data)

    assert metrics['wave_height'] == 0.9
    assert metrics['wind_speed'] == 10.2
    assert metrics['water_temperature'] == 18.5
