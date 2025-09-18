import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, Circle, MessageSquare, LogOut, Calendar, BookOpen, 
  Award, Clock, MapPin, Waves, User, Star, Target, Activity,
  Thermometer, Wind, Eye, Anchor, TrendingUp
} from 'lucide-react'
import WeatherWidget from './WeatherWidget'
import AIChat from './AIChat'

const StudentInterfaceModern = ({ user, weatherData, onLogout, aiService }) => {
  const navigate = useNavigate()
  const [showAIChat, setShowAIChat] = useState(false)
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Verificar equipamento de mergulho', completed: true, priority: 'high' },
    { id: 2, text: 'Confirmar condições meteorológicas', completed: true, priority: 'high' },
    { id: 3, text: 'Revisar plano de mergulho', completed: false, priority: 'medium' },
    { id: 4, text: 'Preparar logbook', completed: false, priority: 'low' },
    { id: 5, text: 'Verificar certificado médico', completed: false, priority: 'medium' }
  ])

  const [nextClasses] = useState([
    { 
      id: 1, 
      title: 'Open Water - Mergulho 3', 
      date: 'Hoje', 
      time: '14:00', 
      location: 'Sesimbra', 
      instructor: 'João Santos',
      difficulty: 'Iniciante',
      maxDepth: '12m',
      duration: '45min'
    },
    { 
      id: 2, 
      title: 'Advanced Open Water', 
      date: 'Amanhã', 
      time: '09:00', 
      location: 'Berlengas', 
      instructor: 'Maria Silva',
      difficulty: 'Intermédio',
      maxDepth: '18m',
      duration: '60min'
    }
  ])

  const [achievements] = useState([
    { 
      id: 1, 
      title: 'Open Water Diver', 
      date: '2024-08-15', 
      completed: true,
      description: 'Certificação básica de mergulho',
      level: 'Básico'
    },
    { 
      id: 2, 
      title: 'Advanced Open Water', 
      date: 'Em progresso', 
      completed: false,
      description: 'Mergulho avançado até 30m',
      level: 'Avançado',
      progress: 65
    },
    { 
      id: 3, 
      title: 'Rescue Diver', 
      date: 'Bloqueado', 
      completed: false,
      description: 'Técnicas de salvamento',
      level: 'Especialista',
      progress: 0
    }
  ])

  const [studentStats] = useState({
    totalDives: 23,
    deepestDive: 18,
    totalHours: 45,
    certificates: 1
  })

  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400/50 bg-red-500/10'
      case 'medium': return 'border-yellow-400/50 bg-yellow-500/10'
      case 'low': return 'border-green-400/50 bg-green-500/10'
      default: return 'border-white/20 bg-white/5'
    }
  }

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
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Olá, {user.name}!</h1>
              <p className="text-blue-200 flex items-center space-x-2">
                <Waves className="w-4 h-4" />
                <span>Pronto para a próxima aventura subaquática?</span>
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
            Perguntar à IA
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

      {/* Estatísticas do estudante */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 slide-in-left">
        <Card className="card-modern hover-lift">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{studentStats.totalDives}</p>
            <p className="text-blue-200 text-sm">Mergulhos</p>
          </CardContent>
        </Card>
        
        <Card className="card-modern hover-lift">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{studentStats.deepestDive}m</p>
            <p className="text-blue-200 text-sm">Mais Profundo</p>
          </CardContent>
        </Card>
        
        <Card className="card-modern hover-lift">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{studentStats.totalHours}h</p>
            <p className="text-blue-200 text-sm">Tempo Total</p>
          </CardContent>
        </Card>
        
        <Card className="card-modern hover-lift">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{studentStats.certificates}</p>
            <p className="text-blue-200 text-sm">Certificados</p>
          </CardContent>
        </Card>
      </div>

      {/* Condições meteorológicas compactas */}
      <Card className="card-modern hover-lift slide-in-right">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Waves className="w-5 h-5 text-blue-400" />
            <span>Condições Atuais</span>
            <div className={`w-3 h-3 rounded-full ${
              weatherData.status === 'green' ? 'bg-green-400' : 
              weatherData.status === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
            } animate-pulse`}></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{weatherData.temperature}°C</p>
            </div>
            <div className="text-center">
              <Waves className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{weatherData.waveHeight}m</p>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{weatherData.windSpeed} km/h</p>
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white text-sm font-medium">{weatherData.recommendation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Próximas Aulas */}
      <Card className="card-modern slide-in-left">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Próximas Aulas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextClasses.map((class_) => (
              <div key={class_.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors hover-lift">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <h3 className="text-white font-semibold text-lg">{class_.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-blue-200">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{class_.date} às {class_.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{class_.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="btn-justdive-primary hover-lift">
                    Detalhes
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center p-2 bg-white/5 rounded">
                    <p className="text-blue-300">Instrutor</p>
                    <p className="text-white font-medium">{class_.instructor}</p>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded">
                    <p className="text-blue-300">Nível</p>
                    <p className="text-white font-medium">{class_.difficulty}</p>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded">
                    <p className="text-blue-300">Profundidade</p>
                    <p className="text-white font-medium">{class_.maxDepth}</p>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded">
                    <p className="text-blue-300">Duração</p>
                    <p className="text-white font-medium">{class_.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checklist de Mergulho */}
      <Card className="card-modern slide-in-right">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Checklist de Mergulho</span>
            </div>
            <div className="text-sm text-blue-300">
              {checklist.filter(item => item.completed).length}/{checklist.length}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover-lift ${
                  item.completed ? 'bg-green-500/10 border-green-400/30' : getPriorityColor(item.priority)
                }`}
                onClick={() => toggleChecklistItem(item.id)}
              >
                {item.completed ? 
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" /> : 
                  <Circle className="w-5 h-5 text-blue-300 flex-shrink-0" />
                }
                <span className={`text-sm flex-1 ${
                  item.completed ? 'text-green-200 line-through' : 'text-white'
                }`}>
                  {item.text}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  item.priority === 'high' ? 'bg-red-400' :
                  item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progresso de Certificações */}
      <Card className="card-modern slide-in-left">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Progresso de Certificações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.completed ? 'bg-green-600' : 
                      achievement.progress > 0 ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{achievement.title}</h3>
                      <p className="text-blue-200 text-sm">{achievement.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-blue-300">{achievement.level}</span>
                        <span className="text-xs text-blue-400">•</span>
                        <span className="text-xs text-blue-300">{achievement.date}</span>
                      </div>
                    </div>
                  </div>
                  {achievement.completed && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                </div>
                
                {achievement.progress > 0 && !achievement.completed && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300">Progresso</span>
                      <span className="text-white">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="card-modern slide-in-right">
        <CardHeader>
          <CardTitle className="text-white">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="ghost" 
              className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20 hover-lift transition-all duration-300 group" 
              onClick={() => navigate('/student/logbook')}
            >
              <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">Logbook</span>
            </Button>

            <Button 
              variant="ghost" 
              className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20 hover-lift transition-all duration-300 group" 
              onClick={() => navigate('/student/schedule')}
            >
              <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">Agendar</span>
            </Button>

            <Button 
              variant="ghost" 
              className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20 hover-lift transition-all duration-300 group" 
              onClick={() => navigate('/student/locations')}
            >
              <MapPin className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">Locais</span>
            </Button>

            <Button 
              variant="ghost" 
              className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20 hover-lift transition-all duration-300 group" 
              onClick={() => navigate('/student/support')}
            >
              <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">Suporte</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentInterfaceModern
