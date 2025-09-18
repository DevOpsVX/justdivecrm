import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, Calendar, GraduationCap, MessageSquare, Settings, LogOut, 
  BarChart3, TrendingUp, Clock, Bell, Activity, Waves, Anchor,
  CloudRain, Wind, Eye, Thermometer, Plus, Search, Filter,
  Home, ChevronDown, Menu, X
} from 'lucide-react'

const DashboardGHL = ({ user, weatherData, onLogout, aiService }) => {
  const navigate = useNavigate()
  const [showAIChat, setShowAIChat] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const [stats] = useState({
    totalStudents: 45,
    activeReservations: 12,
    todayClasses: 3,
    monthlyRevenue: 8500,
    completedCourses: 28,
    weatherAlerts: 2
  })

  const [recentActivities] = useState([
    { 
      id: 1, 
      type: 'booking', 
      message: 'João Silva agendou mergulho nas Berlengas', 
      time: '2 min atrás',
      avatar: 'JS'
    },
    { 
      id: 2, 
      type: 'weather', 
      message: 'Condições meteorológicas atualizadas', 
      time: '15 min atrás',
      avatar: '🌊'
    },
    { 
      id: 3, 
      type: 'course', 
      message: 'Maria Santos completou Open Water', 
      time: '1 hora atrás',
      avatar: 'MS'
    }
  ])

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true, route: '/dashboard' },
    { icon: Users, label: 'Alunos', route: '/dashboard/students' },
    { icon: Calendar, label: 'Reservas', route: '/dashboard/reservations' },
    { icon: GraduationCap, label: 'Cursos', route: '/dashboard/courses' },
    { icon: BarChart3, label: 'Meteorologia', route: '/dashboard/operations' },
    { icon: MessageSquare, label: 'Mensagens', route: '/dashboard/messages' },
    { icon: Settings, label: 'Simulador', route: '/dashboard/simulator' },
  ]

  const quickStats = [
    {
      title: 'Total de Alunos',
      value: stats.totalStudents,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Reservas Ativas',
      value: stats.activeReservations,
      change: '+8%',
      changeType: 'positive',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Aulas Hoje',
      value: stats.todayClasses,
      change: '0%',
      changeType: 'neutral',
      icon: GraduationCap,
      color: 'purple'
    },
    {
      title: 'Receita Mensal',
      value: `€${stats.monthlyRevenue}`,
      change: '+15%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {sidebarOpen ? (
              <img 
                src="/justdive-logo-transparent.png" 
                alt="JUSTDIVE Blue Academy" 
                className="h-8 w-auto"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('pt-PT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button 
                onClick={() => setShowAIChat(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                IA Assistant
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className={`w-4 h-4 mr-1 ${
                            stat.changeType === 'positive' ? 'text-green-500' : 
                            stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            stat.changeType === 'positive' ? 'text-green-600' : 
                            stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        <stat.icon className={`w-6 h-6 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                        }`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weather Conditions */}
              <Card className="lg:col-span-2 bg-white border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Waves className="w-5 h-5 text-blue-600" />
                    <span>Condições de Mergulho</span>
                    <div className={`w-3 h-3 rounded-full ml-auto ${
                      weatherData.status === 'green' ? 'bg-green-500' : 
                      weatherData.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{weatherData.temperature}°C</p>
                      <p className="text-sm text-gray-600">Temperatura</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Waves className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{weatherData.waveHeight}m</p>
                      <p className="text-sm text-gray-600">Ondas</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Wind className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{weatherData.windSpeed}</p>
                      <p className="text-sm text-gray-600">Vento (km/h)</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Eye className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{weatherData.visibility}</p>
                      <p className="text-sm text-gray-600">Visibilidade (km)</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-900 font-medium">{weatherData.recommendation}</p>
                    {weatherData.hasClasses && (
                      <p className="text-blue-700 text-sm mt-1">Próxima aula: {weatherData.nextClass}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>Atividade Recente</span>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {activity.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700">
                    Ver todas as atividades
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { icon: Users, label: 'Novo Aluno', color: 'blue', route: '/dashboard/students/new' },
                    { icon: Calendar, label: 'Agendar Aula', color: 'green', route: '/dashboard/reservations/new' },
                    { icon: MessageSquare, label: 'Enviar Mensagem', color: 'purple', route: '/dashboard/messages/new' },
                    { icon: BarChart3, label: 'Relatórios', color: 'orange', route: '/dashboard/reports' },
                    { icon: Settings, label: 'Configurações', color: 'gray', route: '/dashboard/settings' },
                    { icon: Plus, label: 'Mais Opções', color: 'indigo', route: '/dashboard/more' }
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-20 flex-col space-y-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      onClick={() => navigate(action.route)}
                    >
                      <action.icon className={`w-6 h-6 ${
                        action.color === 'blue' ? 'text-blue-600' :
                        action.color === 'green' ? 'text-green-600' :
                        action.color === 'purple' ? 'text-purple-600' :
                        action.color === 'orange' ? 'text-orange-600' :
                        action.color === 'gray' ? 'text-gray-600' : 'text-indigo-600'
                      }`} />
                      <span className="text-xs text-gray-700">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardGHL
