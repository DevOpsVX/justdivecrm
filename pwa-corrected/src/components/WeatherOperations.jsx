import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Cloud, 
  Waves, 
  Wind, 
  Thermometer, 
  Eye, 
  Compass,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function WeatherOperations() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simular dados meteorológicos
  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = async () => {
    setLoading(true)
    // Simular chamada à API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setWeatherData({
      location: 'Berlengas',
      temperature: 18,
      windSpeed: 12,
      windDirection: 'NW',
      waveHeight: 1.2,
      visibility: 8,
      pressure: 1013,
      humidity: 75,
      uvIndex: 6,
      conditions: 'Parcialmente Nublado',
      trafficLight: 'green', // green, yellow, red
      forecast: [
        { time: '09:00', temp: 16, wind: 10, waves: 1.0, condition: 'green' },
        { time: '12:00', temp: 19, wind: 14, waves: 1.3, condition: 'green' },
        { time: '15:00', temp: 20, wind: 16, waves: 1.5, condition: 'yellow' },
        { time: '18:00', temp: 18, wind: 18, waves: 1.8, condition: 'yellow' }
      ]
    })
    
    setLastUpdate(new Date())
    setLoading(false)
  }

  const getTrafficLightColor = (condition) => {
    switch (condition) {
      case 'green':
        return 'bg-green-500'
      case 'yellow':
        return 'bg-yellow-500'
      case 'red':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTrafficLightText = (condition) => {
    switch (condition) {
      case 'green':
        return 'Condições Excelentes - Aulas Confirmadas'
      case 'yellow':
        return 'Condições Moderadas - Atenção Redobrada'
      case 'red':
        return 'Condições Adversas - Aulas Canceladas'
      default:
        return 'Dados Indisponíveis'
    }
  }

  const getTrafficLightIcon = (condition) => {
    switch (condition) {
      case 'green':
        return <CheckCircle className="w-5 h-5 text-white" />
      case 'yellow':
        return <AlertTriangle className="w-5 h-5 text-white" />
      case 'red':
        return <XCircle className="w-5 h-5 text-white" />
      default:
        return <Cloud className="w-5 h-5 text-white" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="glass-effect border-white/20 p-8">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            <span className="text-white">Carregando dados meteorológicos...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Cloud className="w-6 h-6" />
            <span>Operações Meteorológicas</span>
          </h1>
          <p className="text-blue-200">Monitoramento em tempo real das condições de mergulho</p>
        </div>
        
        <Button 
          onClick={fetchWeatherData}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Status Geral - Semáforo */}
      <Card className="glass-effect border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full ${getTrafficLightColor(weatherData.trafficLight)} flex items-center justify-center`}>
                {getTrafficLightIcon(weatherData.trafficLight)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{getTrafficLightText(weatherData.trafficLight)}</h2>
                <p className="text-blue-200">Última atualização: {lastUpdate.toLocaleTimeString()}</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${weatherData.trafficLight === 'green' ? 'border-green-400 text-green-400' : 
                          weatherData.trafficLight === 'yellow' ? 'border-yellow-400 text-yellow-400' : 
                          'border-red-400 text-red-400'} text-lg px-4 py-2`}
            >
              {weatherData.location}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dados Meteorológicos Atuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Temperatura</p>
                <p className="text-3xl font-bold text-white">{weatherData.temperature}°C</p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Vento</p>
                <p className="text-3xl font-bold text-white">{weatherData.windSpeed}</p>
                <p className="text-blue-200 text-xs">km/h {weatherData.windDirection}</p>
              </div>
              <Wind className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Ondas</p>
                <p className="text-3xl font-bold text-white">{weatherData.waveHeight}m</p>
              </div>
              <Waves className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Visibilidade</p>
                <p className="text-3xl font-bold text-white">{weatherData.visibility}</p>
                <p className="text-blue-200 text-xs">km</p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previsão por Horário */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Previsão por Horário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherData.forecast.map((item, index) => (
              <Card key={index} className="glass-effect border-white/10">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <p className="text-blue-200 font-semibold">{item.time}</p>
                    <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(item.condition)} mx-auto flex items-center justify-center`}>
                      {getTrafficLightIcon(item.condition)}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-white">{item.temp}°C</p>
                      <p className="text-blue-200">{item.wind} km/h</p>
                      <p className="text-cyan-300">{item.waves}m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Pressão Atmosférica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{weatherData.pressure} hPa</span>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-blue-200 text-sm mt-2">Estável</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Humidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{weatherData.humidity}%</span>
              <TrendingDown className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-blue-200 text-sm mt-2">Moderada</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Índice UV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{weatherData.uvIndex}</span>
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-blue-200 text-sm mt-2">Moderado</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

