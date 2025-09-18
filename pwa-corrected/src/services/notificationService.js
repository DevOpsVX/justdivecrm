const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://justdivecrm-1.onrender.com/api'

class NotificationService {
  constructor() {
    this.apiBase = API_BASE.replace(/\/+$/, '')
  }

  /**
   * Registra um token de push notification no backend
   */
  async registerToken(token) {
    try {
      const response = await fetch(`${this.apiBase}/notifications/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao registrar token:', error)
      throw error
    }
  }

  /**
   * Envia uma notificação push para todos os dispositivos registrados
   */
  async sendNotification(title, body) {
    try {
      const response = await fetch(`${this.apiBase}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      throw error
    }
  }

  /**
   * Obtém uma notificação mock para testes
   */
  async getMockNotification() {
    try {
      const response = await fetch(`${this.apiBase}/notifications/mock`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao obter notificação mock:', error)
      throw error
    }
  }

  /**
   * Simula o envio de notificações baseadas no status do semáforo
   */
  async sendWeatherNotification(weatherStatus, location = 'Berlengas') {
    let title, body

    switch (weatherStatus) {
      case 'green':
        title = '🟢 Condições Excelentes!'
        body = `Ótimas condições para mergulho em ${location}. Todas as aulas confirmadas!`
        break
      case 'yellow':
        title = '🟡 Atenção às Condições'
        body = `Condições moderadas em ${location}. Aulas prosseguem com precauções adicionais.`
        break
      case 'red':
        title = '🔴 Condições Adversas'
        body = `Condições perigosas em ${location}. Todas as atividades de mergulho foram suspensas.`
        break
      default:
        title = '📱 Notificação JustDive'
        body = `Atualização sobre as condições de mergulho em ${location}.`
    }

    return await this.sendNotification(title, body)
  }

  /**
   * Simula notificações de reserva
   */
  async sendReservationNotification(type, studentName, time, location) {
    let title, body

    switch (type) {
      case 'confirmed':
        title = '✅ Aula Confirmada'
        body = `Olá ${studentName}! Sua aula está confirmada para ${time} em ${location}.`
        break
      case 'cancelled':
        title = '❌ Aula Cancelada'
        body = `Olá ${studentName}, sua aula de ${time} foi cancelada devido às condições meteorológicas.`
        break
      case 'rescheduled':
        title = '📅 Aula Reagendada'
        body = `Olá ${studentName}, sua aula foi reagendada para ${time} em ${location}.`
        break
      default:
        title = '📚 Atualização de Reserva'
        body = `Olá ${studentName}, há uma atualização sobre sua reserva.`
    }

    return await this.sendNotification(title, body)
  }

  /**
   * Verifica se o navegador suporta notificações
   */
  isNotificationSupported() {
    return 'Notification' in window
  }

  /**
   * Solicita permissão para notificações
   */
  async requestPermission() {
    if (!this.isNotificationSupported()) {
      throw new Error('Notificações não são suportadas neste navegador')
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  /**
   * Mostra uma notificação local no navegador
   */
  showLocalNotification(title, body, options = {}) {
    if (!this.isNotificationSupported()) {
      console.warn('Notificações não são suportadas')
      return
    }

    if (Notification.permission === 'granted') {
      return new Notification(title, {
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      })
    }
  }
}

export default new NotificationService()

