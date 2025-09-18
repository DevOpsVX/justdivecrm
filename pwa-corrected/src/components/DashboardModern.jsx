import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, Calendar, GraduationCap, MessageSquare, Settings, LogOut, 
  BarChart3, TrendingUp, Clock, Bell, Activity, Waves, Anchor,
  CloudRain, Wind, Eye, Thermometer
} from 'lucide-react'
import WeatherWidget from './WeatherWidget'
import AIChat from './AIChat'

const DashboardModern = ({ user, weatherData, onLogout, aiService }) => {
  const navigate = useNavigate()
  const [showAIChat, setShowAIChat] = useState(false)
  const [stats] = useState({
    totalStudents: 45,
    activeReservations: 12,
    todayClasses: 3,
    monthlyRevenue: 8500,
    completedCourses: 28,
    weatherAlerts: 2
  })

  const [recentNotifications] = useState([
    { 
      id: 1, 
      type: 'success', 
      message: 'Nova reserva de João Silva para mergulho nas Berlengas', 
      time: '10:30',
      icon: Calendar
    },
    { 
      id: 2, 
      type: 'info', 
      message: 'Condições meteorológicas favoráveis para mergulho', 
      time: '09:15',
      icon: CloudRain
    },
    { 
      id: 3, 
      type: 'warning', 
      message: 'Equipamento de mergulho precisa de manutenção', 
      time: '08:45',
      icon: Settings
    }
  ])

  const menuItems = [
    { 
      icon: BarChart3, 
      label: 'Operações Meteorológicas', 
      description: 'Monitoramento das condições',
      color: 'from-blue-500 to-blue-600', 
      route: '/dashboard/operations',
      stats: `${weatherData.temperature}°C`
    },
    { 
      icon: Calendar, 
      label: 'Reservas', 
      description: 'Gestão de agendamentos',
      color: 'from-green-500 to-green-600', 
      route: '/dashboard/reservations',
      stats: `${stats.activeReservations} ativas`
    },
    { 
      icon: Users, 
      label: 'Alunos', 
      description: 'Gestão de estudantes',
      color: 'from-purple-500 to-purple-600', 
      route: '/dashboard/students',
      stats: `${stats.totalStudents} total`
    },
    { 
      icon: MessageSquare, 
      label: 'Mensagens', 
      description: 'Comunicação e notificações',
      color: 'from-orange-500 to-orange-600', 
      route: '/dashboard/messages',
      stats: '3 novas'
    },
    { 
      icon: Settings, 
      label: 'Simulador', 
      description: 'Testes do sistema',
      color: 'from-gray-500 to-gray-600', 
      route: '/dashboard/simulator',
      stats: 'Disponível'
    }
  ]

  const quickStats = [
    {
      title: 'Alunos Ativos',
      value: stats.totalStudents,
      change: '+12%',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-blue-600/20'
    },
    {
      title: 'Reservas',
      value: stats.activeReservations,
      change: '+8%',
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-green-600/20'
    },
    {
      title: 'Aulas Hoje',
      value: stats.todayClasses,
      change: '0%',
      icon: GraduationCap,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-purple-600/20'
    },
    {
      title: 'Receita Mensal',
      value: `€${stats.monthlyRevenue}`,
      change: '+15%',
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-yellow-600/20'
    }
  ]

  if (showAIChat) {
    return <AIChat user={user} weatherData={weatherData} aiService={aiService} onBack={() => setShowAIChat(false)} />
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header moderno */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="space-y-2 fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Bem-vindo, {user.name}</h1>
              <p className="text-blue-200 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('pt-PT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 slide-in-right">
          <Button 
            onClick={() => setShowAIChat(true)} 
            className="btn-justdive-secondary hover-lift"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            IA Assistant
          </Button>
          <Button 
            onClick={onLogout} 
            variant="outline" 
            className="btn-justdive-secondary hover-lift"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 slide-in-left">
        {quickStats.map((stat, index) => (
          <Card key={index} className="card-modern hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-blue-200 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Widget Meteorológico Aprimorado */}
      <div className="slide-in-right">
        <Card className="card-modern hover-lift">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Waves className="w-5 h-5 text-blue-400" />
              <span>Condições de Mergulho</span>
              <div className={`w-3 h-3 rounded-full ${
                weatherData.status === 'green' ? 'bg-green-400' : 
                weatherData.status === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
              } animate-pulse`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <Thermometer className="w-6 h-6 text-orange-400 mx-auto" />
                <p className="text-2xl font-bold text-white">{weatherData.temperature}°C</p>
                <p className="text-blue-200 text-sm">Temperatura</p>
              </div>
              <div className="text-center space-y-2">
                <Waves className="w-6 h-6 text-blue-400 mx-auto" />
                <p className="text-2xl font-bold text-white">{weatherData.waveHeight}m</p>
                <p className="text-blue-200 text-sm">Ondas</p>
              </div>
              <div className="text-center space-y-2">
                <Wind className="w-6 h-6 text-gray-400 mx-auto" />
                <p className="text-2xl font-bold text-white">{weatherData.windSpeed} km/h</p>
                <p className="text-blue-200 text-sm">Vento</p>
              </div>
              <div className="text-center space-y-2">
                <Eye className="w-6 h-6 text-cyan-400 mx-auto" />
                <p className="text-2xl font-bold text-white">{weatherData.visibility} km</p>
                <p className="text-blue-200 text-sm">Visibilidade</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white text-sm font-medium">{weatherData.recommendation}</p>
              {weatherData.hasClasses && (
                <p className="text-blue-300 text-sm mt-1">Próxima aula: {weatherData.nextClass}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu de Gestão Moderno */}
      <Card className="card-modern slide-in-left">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Centro de Controle</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-24 flex-col space-y-3 text-white hover:bg-white/10 border border-white/20 hover-lift transition-all duration-300 group"
                onClick={() => navigate(item.route)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium block">{item.label}</span>
                  <span className="text-xs text-blue-300 block">{item.description}</span>
                  <span className="text-xs text-blue-400 block mt-1">{item.stats}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificações Recentes Modernas */}
      <Card className="card-modern slide-in-right">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Atividade Recente</span>
            </div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group hover-lift"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-500/20 text-green-400' : 
                  notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-blue-500/20 text-blue-400'
                } group-hover:scale-110 transition-transform duration-300`}>
                  <notification.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{notification.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-300 text-xs">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-blue-300 hover:text-white hover:bg-white/5"
          >
            Ver todas as notificações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardModern
