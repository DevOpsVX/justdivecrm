"""Utility helpers for working with weather payloads."""
from __future__ import annotations

from typing import Any, Dict

# Mapping of the flat payload keys provided by WeatherService to normalized snake_case keys
_METRIC_MAP = {
    "waveHeight": ("wave_height", 0.0),
    "windSpeed": ("wind_speed", 0.0),
    "gust": ("gust", 0.0),
    "precipitation": ("precipitation", 0.0),
    "visibility": ("visibility", 10.0),
    "waterTemperature": ("water_temperature", 18.0),
    "wavePeriod": ("wave_period", 0.0),
    "airTemperature": ("air_temperature", 20.0),
}


def _to_float(value: Any, default: float) -> float:
    """Convert a value to float safely, returning the provided default on failure."""
    if value is None:
        return default

    if isinstance(value, (int, float)):
        return round(float(value), 1)

    try:
        cleaned = str(value).strip()
        if not cleaned:
            return default
        cleaned = cleaned.replace(",", ".")
        return round(float(cleaned), 1)
    except (TypeError, ValueError):
        return default


def normalize_conditions(weather_data: Dict[str, Any]) -> Dict[str, float]:
    """Return a normalized dictionary of weather metrics.

    The Stormglass payload processed by ``WeatherService`` exposes flattened keys such as
    ``waveHeight`` or ``windSpeed``. Some historical records might still contain the legacy
    ``conditions`` dictionary with snake_case keys. This helper consolidates both formats
    into a single dictionary, ensuring downstream consumers can rely on consistent keys.
    """

    normalized: Dict[str, float] = {}
    legacy_conditions = weather_data.get("conditions")

    for flat_key, (normalized_key, default) in _METRIC_MAP.items():
        value: Any = None

        if isinstance(legacy_conditions, dict):
            value = legacy_conditions.get(normalized_key)
            if value is None:
                value = legacy_conditions.get(flat_key)

        if value is None:
            value = weather_data.get(flat_key)

        if value is None:
            value = weather_data.get(normalized_key)

        normalized[normalized_key] = _to_float(value, default)

    return normalized


__all__ = ["normalize_conditions"]
