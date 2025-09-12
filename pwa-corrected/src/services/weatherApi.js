export async function fetchCurrentWeather(local) {
  const response = await fetch(`/api/weather/current/${encodeURIComponent(local)}`);
  if (!response.ok) {
    throw new Error('Falha ao obter dados meteorológicos');
  }
  return response.json();
}
