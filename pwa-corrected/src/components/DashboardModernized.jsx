import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Calendar, 
  Waves, 
  MessageSquare, 
  Settings,
  Bell,
  ChevronRight,
  Cloud,
  Wind,
  Eye,
  Thermometer,
  MapPin,
  MessageCircle,
  Smartphone,
  Download
} from 'lucide-react'

const DashboardModernized = ({ user, onNavigate }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])

  useEffect(() => {
    // Simular dados do tempo
    setWeatherData({
      location: 'Berlengas',
      status: 'GREEN',
      temperature: 22,
      waveHeight: 1.2,
      windSpeed: 14,
      visibility: 12,
      description: 'Condições favoráveis para mergulho hoje. Mar calmo até o fim da tarde.'
    })

    // Simular notificações
    setNotifications([
      { id: 1, message: 'Nova reserva de João Silva', time: '10:30', type: 'info' },
      { id: 2, message: 'Condições favoráveis — Berlengas', time: '09:10', type: 'success' },
      { id: 3, message: 'Pagamento confirmado — #4821', time: 'Ontem', type: 'success' }
    ])

    // Simular próximas aulas
    setUpcomingClasses([
      { 
        time: '10:30', 
        location: 'Berlengas', 
        instructor: 'Marta F.', 
        students: 6, 
        status: 'GREEN',
        statusText: 'Aulas confirmadas'
      },
      { 
        time: '13:00', 
        location: 'Peniche', 
        instructor: 'Carlos R.', 
        students: 4, 
        status: 'YELLOW',
        statusText: 'Atenção ao clima'
      },
      { 
        time: '16:00', 
        location: 'Sesimbra', 
        instructor: 'Nuno S.', 
        students: 8, 
        status: 'GREEN',
        statusText: 'Aulas confirmadas'
      }
    ])
  }, [])

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toUpperCase()
    switch (normalizedStatus) {
      case 'GREEN': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'YELLOW': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'RED': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusText = (status) => {
    const normalizedStatus = status?.toUpperCase()
    switch (normalizedStatus) {
      case 'GREEN': return 'Aulas confirmadas'
      case 'YELLOW': return 'Atenção ao clima'
      case 'RED': return 'Aulas canceladas'
      default: return 'Status desconhecido'
    }
  }

  const weatherStatusUpper = weatherData?.status?.toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">JUSTDIVE CRM</h1>
              <p className="text-sm text-slate-400">Gestão de Escola de Mergulho</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="ml-2">Notificações</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800/30 backdrop-blur-md border-r border-slate-700/50 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white bg-blue-600/20 hover:bg-blue-600/30"
            >
              <Users className="h-5 w-5 mr-3" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={() => onNavigate('weather')}
            >
              <Waves className="h-5 w-5 mr-3" />
              Operações
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={() => onNavigate('reservations')}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Reservas
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={() => onNavigate('students')}
            >
              <Users className="h-5 w-5 mr-3" />
              Alunos
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={() => onNavigate('messages')}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Mensagens
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Suporte IA
            </Button>
            {user?.type === 'admin' && (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                onClick={() => onNavigate('simulator')}
              >
                <Settings className="h-5 w-5 mr-3" />
                Simulador (Admin)
              </Button>
            )}

            {/* Locais */}
            <div className="pt-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Locais</h3>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-slate-300 hover:text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Berlengas
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-slate-300 hover:text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Peniche
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-slate-300 hover:text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Sesimbra
                </Button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Alunos</p>
                    <p className="text-2xl font-bold text-white">45</p>
                    <p className="text-xs text-green-400">+4 este mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Reservas</p>
                    <p className="text-2xl font-bold text-white">12</p>
                    <p className="text-xs text-slate-400">3 hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-600/20 rounded-lg">
                    <Waves className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Aulas Hoje</p>
                    <p className="text-2xl font-bold text-white">3</p>
                    <p className="text-xs text-slate-400">2 manhã / 1 tarde</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Mensagens</p>
                    <p className="text-2xl font-bold text-white">8</p>
                    <p className="text-xs text-slate-400">2 não lidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Card */}
          {weatherData && (
            <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400/30 backdrop-blur-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-6 w-6 text-blue-300" />
                    <CardTitle className="text-white">
                      Condições do Tempo — {weatherData.location}
                    </CardTitle>
                  </div>
                  <Badge className={`${getStatusColor(weatherData.status)} border`}>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full ${weatherStatusUpper === 'GREEN' ? 'bg-green-400' : weatherStatusUpper === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${weatherStatusUpper === 'YELLOW' || weatherStatusUpper === 'RED' ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${weatherStatusUpper === 'RED' ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                      </div>
                      <span>{getStatusText(weatherData.status)}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="h-4 w-4 text-blue-300" />
                      <span className="text-sm text-slate-300">Temperatura</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData.temperature}°C</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Waves className="h-4 w-4 text-blue-300" />
                      <span className="text-sm text-slate-300">Ondas</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData.waveHeight} m</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wind className="h-4 w-4 text-blue-300" />
                      <span className="text-sm text-slate-300">Vento</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData.windSpeed} km/h</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4 text-blue-300" />
                      <span className="text-sm text-slate-300">Visibilidade</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{weatherData.visibility} m</p>
                  </div>
                </div>
                <p className="text-blue-200 italic">{weatherData.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Ações rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={() => onNavigate('reservations')}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5" />
                    <span>Nova Reserva</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={() => onNavigate('students')}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5" />
                    <span>Cadastrar Aluno</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700/50"
                  onClick={() => onNavigate('messages')}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5" />
                    <span>Enviar Mensagem</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {user?.type === 'admin' && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700/50"
                    onClick={() => onNavigate('simulator')}
                  >
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5" />
                      <span>Abrir Simulador</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Notificações Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{notification.message}</p>
                    </div>
                    <span className="text-xs text-slate-400">{notification.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Classes */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Próximas Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-sm font-medium text-slate-400 pb-3">Horário</th>
                      <th className="text-left text-sm font-medium text-slate-400 pb-3">Local</th>
                      <th className="text-left text-sm font-medium text-slate-400 pb-3">Instrutor</th>
                      <th className="text-left text-sm font-medium text-slate-400 pb-3">Alunos</th>
                      <th className="text-left text-sm font-medium text-slate-400 pb-3">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {upcomingClasses.map((classItem, index) => {
                      const classStatusUpper = classItem.status?.toUpperCase()
                      return (
                        <tr key={index} className="border-b border-slate-700/50">
                          <td className="py-4 text-white font-medium">{classItem.time}</td>
                          <td className="py-4 text-slate-300">{classItem.location}</td>
                          <td className="py-4 text-slate-300">{classItem.instructor}</td>
                          <td className="py-4 text-slate-300">{classItem.students}</td>
                          <td className="py-4">
                            <Badge className={`${getStatusColor(classItem.status)} border`}>
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${classStatusUpper === 'GREEN' ? 'bg-green-400' : classStatusUpper === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                                  <div className={`w-2 h-2 rounded-full ${classStatusUpper === 'YELLOW' || classStatusUpper === 'RED' ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                                  <div className={`w-2 h-2 rounded-full ${classStatusUpper === 'RED' ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                                </div>
                                <span>{classItem.statusText}</span>
                              </div>
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default DashboardModernized

