import { useState, useEffect, useCallback } from 'react'
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
  Clock
} from 'lucide-react'
import { getCurrentWeather } from '../services/weatherApi'

const WeatherWidget = ({ location = 'default', onRefresh, compact = false }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchWeather = useCallback(async () => {
    try {
      setError(null)
      const result = await getCurrentWeather(location)
      setData(result)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar o clima')
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLoading(true)
    await fetchWeather()
    if (onRefresh) {
      await onRefresh()
    }
    setIsRefreshing(false)
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

  if (loading) {
    return (
      <Card className="weather-widget-container border-white/20">
        <CardContent className="p-4">
          <div className="text-center text-white">Carregando clima...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="weather-widget-container border-white/20">
        <CardContent className="p-4 flex flex-col items-center space-y-2">
          <div className="text-red-400 text-center">{error || 'Erro ao carregar clima'}</div>
          <Button onClick={handleRefresh} className="bg-blue-600 text-white">Tentar novamente</Button>
        </CardContent>
      </Card>
    )
  }

  const currentData = data

  if (compact) {
    return (
      <Card className="weather-widget-container border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">Clima</span>
            </div>
            <div className={`px-2 py-1 rounded-full ${getStatusColor(currentData.status)} flex items-center space-x-1`}>
              {getStatusIcon(currentData.status)}
              <span className="text-white text-xs font-bold">
                {getStatusText(currentData.status)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {currentData.temperature}°C
            </div>
            <div className="text-xs text-blue-200">
              Ondas: {currentData.waveHeight}m | Vento: {currentData.windSpeed}km/h
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
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-white/10">
            <div className="flex items-center space-x-2">
              {getStatusIcon(currentData.status)}
              <span className="text-white font-medium">{getStatusText(currentData.status)}</span>
            </div>
            <div className={`px-3 py-1 rounded-full ${getStatusColor(currentData.status)}`}>
              <span className="text-white text-sm font-bold">{currentData.status.toUpperCase()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-white">
              <Thermometer className="w-5 h-5" />
              <span>{currentData.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Waves className="w-5 h-5" />
              <span>{currentData.waveHeight}m</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Wind className="w-5 h-5" />
              <span>{currentData.windSpeed} km/h</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Eye className="w-5 h-5" />
              <span>{currentData.visibility} km</span>
            </div>
          </div>
          {currentData.nextClass && (
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-400/20">
              <p className="text-white text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Próxima aula: {currentData.nextClass}
              </p>
            </div>
          )}
          <p className="text-blue-200 text-sm">{currentData.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherWidget
