import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Cloud,
  Thermometer,
  Waves,
  Wind,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { fetchCurrentWeather } from '@/services/weatherApi'

const WeatherWidget = ({ location = 'berlengas', compact = false }) => {
  const [data, setData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = async () => {
    try {
      const result = await fetchCurrentWeather(location)
      const payload = result?.data ?? result
      if (!payload) throw new Error('Resposta inválida do serviço meteorológico')
      setData(payload)
      setLastUpdate(new Date())
    } catch (err) {
      console.error(err)
      setData(null)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await load()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return 'weather-status-green'
      case 'yellow': return 'weather-status-yellow'
      case 'red': return 'weather-status-red'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green': return <CheckCircle className="w-5 h-5" />
      case 'yellow': return <AlertTriangle className="w-5 h-5" />
      case 'red': return <XCircle className="w-5 h-5" />
      default: return <Cloud className="w-5 h-5" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'green': return 'Excelente'
      case 'yellow': return 'Moderado'
      case 'red': return 'Perigoso'
      default: return 'Desconhecido'
    }
  }

  if (!data) {
    return (
      <Card className="weather-widget-container border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center space-x-2">
            <Cloud className="w-6 h-6" />
            <span>Condições de Mergulho</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-200">Carregando dados meteorológicos...</p>
        </CardContent>
      </Card>
    )
  }

  const currentData = data
    ? { ...data, status: (data.status ?? '').toLowerCase() }
    : null

  const currentStatus = currentData?.status ?? ''

  if (compact) {
    return (
      <Card className="weather-widget-container border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">Clima</span>
            </div>
            <div className={`px-2 py-1 rounded-full ${getStatusColor(currentStatus)} flex items-center space-x-1`}>
              {getStatusIcon(currentStatus)}
              <span className="text-white text-xs font-bold">
                {getStatusText(currentStatus)}
              </span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl font-bold text-white">
              {currentData.temperature}°C
            </div>
            <div className="text-xs text-blue-200">
              Ondas: {currentData.waveHeight}m • Vento: {currentData.windSpeed}km/h
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="weather-widget-container border-white/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Cloud className="w-5 h-5" />
            <span>Condições do Tempo</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            <div className={`px-3 py-1 rounded-full ${getStatusColor(currentStatus)} flex items-center space-x-2`}>
              {getStatusIcon(currentStatus)}
              <span className="text-white font-bold">
                {getStatusText(currentStatus)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recomendação */}
        <div className="text-center">
          <p className="text-blue-200 italic">
            {currentData.recommendation}
          </p>
        </div>

        {/* Dados meteorológicos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <Thermometer className="w-6 h-6 text-orange-400 mx-auto" />
            <div className="text-xl font-bold text-white">
              {currentData.temperature}°C
            </div>
            <div className="text-xs text-blue-200">Temperatura</div>
          </div>

          <div className="text-center space-y-2">
            <Waves className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="text-xl font-bold text-white">
              {currentData.waveHeight || '1.2'}m
            </div>
            <div className="text-xs text-blue-200">Ondas</div>
          </div>

          <div className="text-center space-y-2">
            <Wind className="w-6 h-6 text-gray-400 mx-auto" />
            <div className="text-xl font-bold text-white">
              {currentData.windSpeed || '15'} km/h
            </div>
            <div className="text-xs text-blue-200">Vento</div>
          </div>

          <div className="text-center space-y-2">
            <Eye className="w-6 h-6 text-blue-400 mx-auto" />
            <div className="text-xl font-bold text-white">
              {currentData.visibility || '8'} km
            </div>
            <div className="text-xs text-blue-200">Visibilidade</div>
          </div>
        </div>

        {/* Próxima aula */}
        {currentStatus === 'green' && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm font-medium mb-1">Próxima Aula:</p>
            <p className="text-white text-sm">Aula Open Water - 14:00</p>
          </div>
        )}

        {/* Última atualização (opcional) */}
        {lastUpdate && (
          <p className="text-center text-xs text-blue-300">
            Atualizado em: {lastUpdate.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default WeatherWidget
