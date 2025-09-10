import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, BellOff, X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

const NotificationManager = ({ weatherData }) => {
  const [permission, setPermission] = useState(Notification.permission)
  const [notifications, setNotifications] = useState([])
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)
  const [lastWeatherStatus, setLastWeatherStatus] = useState(null)

  useEffect(() => {
    // Verificar se as notificações são suportadas
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
      
      if (Notification.permission === 'default') {
        setShowPermissionPrompt(true)
      }
    }
  }, [])

  useEffect(() => {
    // Monitorar mudanças no status meteorológico
    if (lastWeatherStatus && lastWeatherStatus !== weatherData.status) {
      sendWeatherNotification(weatherData)
    }
    setLastWeatherStatus(weatherData.status)
  }, [weatherData.status, lastWeatherStatus])

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission()
        setPermission(result)
        setShowPermissionPrompt(false)
        
        if (result === 'granted') {
          addNotification({
            id: Date.now(),
            type: 'success',
            title: 'Notificações Ativadas',
            message: 'Você receberá alertas sobre condições meteorológicas e aulas.',
            timestamp: new Date()
          })
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error)
        setShowPermissionPrompt(false)
      }
    }
  }

  const sendWeatherNotification = (weather) => {
    if (permission === 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const statusEmoji = weather.status === 'green' ? '🟢' : weather.status === 'yellow' ? '🟡' : '🔴'
        const statusText = weather.status === 'green' ? 'Excelente' : weather.status === 'yellow' ? 'Moderado' : 'Perigoso'
        
        const notification = new Notification(`${statusEmoji} Condições: ${statusText}`, {
          body: `🌡️ ${weather.temperature}°C | 🌊 ${weather.waveHeight}m | 💨 ${weather.windSpeed}km/h`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'weather-update',
          requireInteraction: weather.status === 'red'
        })

        // Adicionar à lista de notificações
        addNotification({
          id: Date.now(),
          type: weather.status === 'green' ? 'success' : weather.status === 'yellow' ? 'warning' : 'error',
          title: `Condições: ${statusText}`,
          message: weather.recommendation,
          timestamp: new Date()
        })

        // Fechar automaticamente após 5 segundos (exceto para alertas vermelhos)
        if (weather.status !== 'red') {
          setTimeout(() => notification.close(), 5000)
        }
      } catch (error) {
        console.error('Erro ao enviar notificação:', error)
      }
    }
  }

  const sendClassNotification = (type, classInfo, reason = '') => {
    if (permission === 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const emoji = type === 'cancelled' ? '❌' : type === 'confirmed' ? '✅' : '📅'
        const title = type === 'cancelled' ? 'Aula Cancelada' : type === 'confirmed' ? 'Aula Confirmada' : 'Aula Reagendada'
        
        const notification = new Notification(`${emoji} ${title}`, {
          body: `${classInfo}${reason ? `\nMotivo: ${reason}` : ''}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'class-update'
        })

        addNotification({
          id: Date.now(),
          type: type === 'cancelled' ? 'error' : 'info',
          title,
          message: `${classInfo}${reason ? ` - ${reason}` : ''}`,
          timestamp: new Date()
        })

        setTimeout(() => notification.close(), 8000)
      } catch (error) {
        console.error('Erro ao enviar notificação de aula:', error)
      }
    }
  }

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Manter apenas 5 notificações
    
    // Remover automaticamente após 10 segundos
    setTimeout(() => {
      removeNotification(notification.id)
    }, 10000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  // Funções para demonstração
  const sendDemoNotifications = () => {
    sendClassNotification('confirmed', 'Aula Open Water - 14:00')
    
    setTimeout(() => {
      addNotification({
        id: Date.now(),
        type: 'info',
        title: 'Lembrete de Aula',
        message: 'Sua aula começa em 1 hora. Prepare seu equipamento!',
        timestamp: new Date()
      })
    }, 2000)
  }

  return (
    <>
      {/* Prompt de permissão */}
      {showPermissionPrompt && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="glass-effect border-white/20 max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">
                    Ativar Notificações
                  </h4>
                  <p className="text-blue-200 text-xs mt-1">
                    Receba alertas sobre condições meteorológicas e aulas
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      onClick={requestPermission}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Ativar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPermissionPrompt(false)}
                      className="text-blue-200 hover:bg-white/10"
                    >
                      Agora não
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de notificações */}
      <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <Card key={notification.id} className="glass-effect border-white/20 animate-in slide-in-from-right">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-blue-200 text-xs mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-blue-300 text-xs mt-2">
                    {notification.timestamp.toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeNotification(notification.id)}
                  className="text-blue-200 hover:bg-white/10 p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão de teste (apenas para demonstração) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={sendDemoNotifications}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            Testar Notificações
          </Button>
        </div>
      )}
    </>
  )
}

export default NotificationManager

