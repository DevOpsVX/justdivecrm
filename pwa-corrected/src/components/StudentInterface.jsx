import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, MessageSquare, LogOut, Calendar, BookOpen, Award, Clock, MapPin } from 'lucide-react'
import WeatherWidget from './WeatherWidget'
import AIChat from './AIChat'

const StudentInterface = ({ user, weatherData, onLogout, aiService }) => {
  const navigate = useNavigate()
  const [showAIChat, setShowAIChat] = useState(false)
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Verificar equipamento de mergulho', completed: true },
    { id: 2, text: 'Confirmar condições meteorológicas', completed: true },
    { id: 3, text: 'Revisar plano de mergulho', completed: false },
    { id: 4, text: 'Preparar logbook', completed: false }
  ])

  const [nextClasses] = useState([
    { id: 1, title: 'Open Water - Mergulho 3', date: 'Hoje', time: '14:00', location: 'Sesimbra', instructor: 'João Santos' },
    { id: 2, title: 'Advanced Open Water', date: 'Amanhã', time: '09:00', location: 'Berlengas', instructor: 'Maria Silva' }
  ])

  const [achievements] = useState([
    { id: 1, title: 'Open Water Diver', date: '2024-08-15', completed: true },
    { id: 2, title: 'Advanced Open Water', date: 'Em progresso', completed: false },
    { id: 3, title: 'Rescue Diver', date: 'Bloqueado', completed: false }
  ])

  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  if (showAIChat) {
    return <AIChat user={user} weatherData={weatherData} aiService={aiService} onBack={() => setShowAIChat(false)} />
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Olá, {user.name}!</h1>
          <p className="text-blue-200">Pronto para a próxima aventura subaquática?</p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => setShowAIChat(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Perguntar à IA
          </Button>
          <Button onClick={onLogout} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Widget Meteorológico Compacto */}
      <WeatherWidget weatherData={weatherData} compact />

      {/* Próximas Aulas */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Próximas Aulas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextClasses.map((class_) => (
              <div key={class_.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-white font-medium">{class_.title}</h3>
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
                    <p className="text-blue-300 text-sm">Instrutor: {class_.instructor}</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate(`/classes/${class_.id}`)}>
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Diário */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Checklist de Mergulho</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => toggleChecklistItem(item.id)}
              >
                {item.completed ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-blue-300" />}
                <span className={`text-sm ${item.completed ? 'text-green-200 line-through' : 'text-white'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progresso de Certificações */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Certificações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.completed ? 'bg-green-600' : achievement.date === 'Em progresso' ? 'bg-yellow-600' : 'bg-gray-600'
                  }`}>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{achievement.title}</h3>
                    <p className="text-blue-200 text-sm">{achievement.date}</p>
                  </div>
                </div>
                {achievement.completed && <CheckCircle2 className="w-6 h-6 text-green-400" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="ghost" className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20" onClick={() => navigate('/student/logbook')}>
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Logbook</span>
            </Button>

            <Button variant="ghost" className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20" onClick={() => navigate('/student/schedule')}>
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Agendar</span>
            </Button>

            <Button variant="ghost" className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20" onClick={() => navigate('/student/locations')}>
              <MapPin className="w-6 h-6" />
              <span className="text-sm">Locais</span>
            </Button>

            <Button variant="ghost" className="h-20 flex-col space-y-2 text-white hover:bg-white/10 border border-white/20" onClick={() => navigate('/student/support')}>
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">Suporte</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentInterface
