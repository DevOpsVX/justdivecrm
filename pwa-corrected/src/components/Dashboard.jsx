import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Calendar, 
  GraduationCap, 
  MessageSquare,
  Settings,
  LogOut,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react'
import WeatherWidget from './WeatherWidget'
import AIChat from './AIChat'

const Dashboard = ({ user, weatherData, onLogout, aiService }) => {
  const [showAIChat, setShowAIChat] = useState(false)
  const [stats] = useState({
    totalStudents: 45,
    activeReservations: 12,
    todayClasses: 3,
    monthlyRevenue: 8500
  })

  const [recentNotifications] = useState([
    {
      id: 1,
      type: 'success',
      message: 'Nova reserva de João Silva para amanhã',
      time: '10:30'
    },
    {
      id: 2,
      type: 'info',
      message: 'Condições meteorológicas favoráveis',
      time: '09:15'
    }
  ])

  const menuItems = [
    { icon: BarChart3, label: 'Operações Meteorológicas', color: 'bg-blue-600' },
    { icon: Calendar, label: 'Reservas', color: 'bg-green-600' },
    { icon: Users, label: 'Alunos', color: 'bg-purple-600' },
    { icon: MessageSquare, label: 'Mensagens', color: 'bg-orange-600' },
    { icon: Settings, label: 'Simulador', color: 'bg-gray-600' }
  ]

  if (showAIChat) {
    return (
      <AIChat
        user={user}
        weatherData={weatherData}
        aiService={aiService}
        onBack={() => setShowAIChat(false)}
      />
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bem-vindo, {user.name}
          </h1>
          <p className="text-blue-200">
            {new Date().toLocaleDateString('pt-PT', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowAIChat(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            IA Assistant
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Alunos</p>
                <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Reservas</p>
                <p className="text-3xl font-bold text-white">{stats.activeReservations}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Aulas Hoje</p>
                <p className="text-3xl font-bold text-white">{stats.todayClasses}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Receita Mensal</p>
                <p className="text-3xl font-bold text-white">€{stats.monthlyRevenue}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widget Meteorológico */}
      <WeatherWidget weatherData={weatherData} />

      {/* Menu de Gestão */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Gestão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20"
              >
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm">{item.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificações Recentes */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Notificações Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="text-white text-sm">{notification.message}</span>
                </div>
                <span className="text-blue-300 text-xs">{notification.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

