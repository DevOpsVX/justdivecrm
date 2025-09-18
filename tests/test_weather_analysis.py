from types import SimpleNamespace
from unittest.mock import patch

import pytest

from src.services.openai_service import OpenAIService
from src.main import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


@patch("src.services.openai_service.openai.ChatCompletion.create")
def test_analyze_weather_conditions_from_flat_payload(mock_chat_create):
    mock_chat_create.return_value = SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content="Condições analisadas com sucesso."))]
    )

    service = OpenAIService()
    weather_data = {
        "location": "Peniche",
        "status": "GREEN",
        "waveHeight": 1.2,
        "windSpeed": 14.6,
        "gust": 18.2,
        "precipitation": 5.0,
        "visibility": 9.5,
        "waterTemperature": 17.8,
        "airTemperature": 20.1,
    }

    result = service.analyze_weather_conditions(weather_data)

    assert result["analysis"] == "Condições analisadas com sucesso."
    assert result["conditions_analyzed"]["wave_height"] == pytest.approx(1.2)
    assert result["conditions_analyzed"]["wind_speed"] == pytest.approx(14.6)
    assert result["conditions_analyzed"]["water_temperature"] == pytest.approx(17.8)
    assert result["conditions_analyzed"]["air_temperature"] == pytest.approx(20.1)


def test_weather_analysis_route_returns_textual_response(client):
    sample_weather = {
        "location": "Sesimbra",
        "status": "YELLOW",
        "waveHeight": 1.4,
        "windSpeed": 16.0,
        "gust": 22.0,
        "precipitation": 10.0,
        "visibility": 7.0,
        "waterTemperature": 18.0,
        "timestamp": "2024-05-15T10:00:00",
        "next_update": "2024-05-15T10:15:00",
        "source": "stormglass_api",
    }

    sample_analysis = {
        "analysis": "As condições exigem atenção adicional, mas os mergulhos podem ocorrer com precaução.",
        "timestamp": "2024-05-15T10:01:00",
        "location": "Sesimbra",
        "conditions_analyzed": {
            "wave_height": 1.4,
            "wind_speed": 16.0,
            "gust": 22.0,
            "precipitation": 10.0,
            "visibility": 7.0,
            "water_temperature": 18.0,
            "wave_period": 0.0,
            "air_temperature": 20.0,
        },
    }

    with patch("src.routes.weather.weather_service.get_weather_data", return_value=sample_weather), \
         patch("src.routes.weather.openai_service.analyze_weather_conditions", return_value=sample_analysis):
        response = client.get("/api/weather/analysis/sesimbra")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["success"] is True
    assert isinstance(payload["ai_analysis"]["analysis"], str)
    assert payload["ai_analysis"]["analysis"].strip() != ""
    assert payload["weather_data"]["waveHeight"] == pytest.approx(1.4)
