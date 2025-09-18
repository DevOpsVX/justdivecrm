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

const WeatherWidget = ({ location = 'lagos', compact = false }) => {
  const [data, setData] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = async () => {
    try {
      const result = await fetchCurrentWeather(location)
      setData(result)
      setLastUpdate(new Date())
    } catch (err) {
      console.error(err)
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

            <div className={`px-3 py-1 rounded-full ${getStatusColor(currentData.status)} flex items-center space-x-2`}>
              {getStatusIcon(currentData.status)}
              <span className="text-white font-bold">
                {getStatusText(currentData.status)}
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
            <Thermometer className="w-6 h-6 text-white mx-auto" />
            <div className="text-xl font-bold text-white">
              {currentData.humidity}%
            </div>
            <div className="text-xs text-blue-200">Umidade</div>
          </div>
        </div>
              {currentData.temperature}°C
            </div>
            <div className="text-xs text-blue-200">Temperatura</div>
          </div>

          <div className="text-center space-y-2">
            <Waves className="w-6 h-6 text-white mx-auto" />
            <div className="text-xl font-bold text-white">
