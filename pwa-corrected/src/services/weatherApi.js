export async function fetchCurrentWeather(local) {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/api/weather/current/${encodeURIComponent(local)}`;

  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  const text = await res.text();

  if (!res.ok) {
    console.error('weatherApi error:', { url, status: res.status, bodyPreview: text.slice(0, 200) });
    throw new Error('Falha ao obter dados meteorológicos');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('weatherApi parse error:', { url, status: res.status, bodyPreview: text.slice(0, 200) });
    throw new Error('Resposta inválida do servidor de clima');
  }
}
