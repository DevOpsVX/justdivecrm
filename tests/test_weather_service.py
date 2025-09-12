import pytest
from unittest.mock import patch

from src.services.weather_service import WeatherService


def test_get_weather_data_caches_response():
    service = WeatherService()

    with patch.object(service, "_fetch_stormglass_data", return_value={"hours": [{}]}) as fetch_mock, \
         patch.object(service, "_process_weather_data", return_value={"ok": True}) as process_mock:
        first = service.get_weather_data("berlengas")
        second = service.get_weather_data("berlengas")

        assert first == {"ok": True}
        assert second == {"ok": True}
        assert fetch_mock.call_count == 1
        assert process_mock.call_count == 1


def test_get_weather_data_fallback_to_mock():
    service = WeatherService()

    with patch.object(service, "_fetch_stormglass_data", side_effect=Exception("fail")), \
         patch.object(service, "_get_mock_data", return_value={"source": "mock_data"}) as mock_mock:
        result = service.get_weather_data("berlengas")

        assert result == {"source": "mock_data"}
        assert mock_mock.call_count == 1


def test_force_status_returns_forced_conditions():
    service = WeatherService()
    result = service.force_status("peniche", "GREEN", note="demo")

    assert result["status"] == "GREEN"
    assert result["forced"] is True
    assert result["note"] == "demo"


def test_force_status_invalid_status():
    service = WeatherService()

    with pytest.raises(ValueError):
        service.force_status("peniche", "BLUE")

