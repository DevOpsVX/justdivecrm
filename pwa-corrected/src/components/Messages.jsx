import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Send, 
  Smartphone, 
  Mail,
  Bell,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter
} from 'lucide-react'

export default function Messages() {
  const [messages] = useState([
    {
      id: 1,
      recipient: 'João Silva',
      type: 'push',
      subject: 'Aula confirmada para amanhã',
      content: 'Olá João! Sua aula de mergulho está confirmada para amanhã às 09:00 nas Berlengas. Condições meteorológicas favoráveis!',
      status: 'sent',
      timestamp: '2025-09-18 14:30',
      channel: 'mobile'
    },
    {
      id: 2,
      recipient: 'Maria Santos',
      type: 'email',
      subject: 'Alteração de horário',
      content: 'Prezada Maria, devido às condições meteorológicas, sua aula foi reagendada para as 15:00. Obrigado pela compreensão.',
      status: 'pending',
      timestamp: '2025-09-18 13:15',
      channel: 'email'
    },
    {
      id: 3,
      recipient: 'Todos os Alunos',
      type: 'broadcast',
      subject: 'Condições meteorológicas - Semáforo Amarelo',
      content: 'Atenção: As condições meteorológicas estão no semáforo amarelo. Todas as atividades prosseguem com precauções adicionais.',
      status: 'sent',
      timestamp: '2025-09-18 12:00',
      channel: 'both'
    },
    {
      id: 4,
      recipient: 'Pedro Costa',
      type: 'push',
      subject: 'Aula cancelada',
      content: 'Olá Pedro, infelizmente tivemos que cancelar sua aula devido ao semáforo vermelho. Entraremos em contato para reagendar.',
      status: 'failed',
      timestamp: '2025-09-18 11:45',
      channel: 'mobile'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    type: 'push',
    subject: '',
    content: ''
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'border-green-400 text-green-400'
      case 'pending':
        return 'border-yellow-400 text-yellow-400'
      case 'failed':
        return 'border-red-400 text-red-400'
      default:
        return 'border-gray-400 text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'sent':
        return 'Enviada'
      case 'pending':
        return 'Pendente'
      case 'failed':
        return 'Falhou'
      default:
        return 'Desconhecido'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'push':
        return <Smartphone className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'broadcast':
        return <Users className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case 'push':
        return 'Push Notification'
      case 'email':
        return 'Email'
      case 'broadcast':
        return 'Broadcast'
      default:
        return 'Mensagem'
    }
  }

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.status === filter)

  const stats = {
    total: messages.length,
    sent: messages.filter(m => m.status === 'sent').length,
    pending: messages.filter(m => m.status === 'pending').length,
    failed: messages.filter(m => m.status === 'failed').length
  }

  const quickMessages = [
    {
      title: 'Aula Confirmada',
      content: 'Sua aula de mergulho está confirmada. Condições meteorológicas favoráveis!'
    },
    {
      title: 'Aula Cancelada',
      content: 'Infelizmente sua aula foi cancelada devido às condições meteorológicas adversas.'
    },
    {
      title: 'Semáforo Verde',
      content: 'Excelentes condições para mergulho! Todas as atividades confirmadas.'
    },
    {
      title: 'Semáforo Amarelo',
      content: 'Condições moderadas. Atividades prosseguem com precauções adicionais.'
    },
    {
      title: 'Semáforo Vermelho',
      content: 'Condições adversas. Todas as atividades de mergulho foram suspensas.'
    }
  ]

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <span>Sistema de Mensagens</span>
          </h1>
          <p className="text-blue-200">Envio de notificações e comunicação com alunos</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Mensagem
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Enviadas</p>
                <p className="text-3xl font-bold text-white">{stats.sent}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Pendentes</p>
                <p className="text-3xl font-bold text-white">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Falharam</p>
                <p className="text-3xl font-bold text-white">{stats.failed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensagens Rápidas */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Mensagens Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickMessages.map((msg, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left border-white/20 text-white hover:bg-white/10 flex-col items-start space-y-2"
                onClick={() => setNewMessage(prev => ({ ...prev, subject: msg.title, content: msg.content }))}
              >
                <span className="font-semibold">{msg.title}</span>
                <span className="text-sm text-blue-200 line-clamp-2">{msg.content}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="glass-effect border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-blue-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Todas
              </Button>
              <Button
                variant={filter === 'sent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('sent')}
                className={filter === 'sent' ? 'bg-green-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Enviadas
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-yellow-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Pendentes
              </Button>
              <Button
                variant={filter === 'failed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('failed')}
                className={filter === 'failed' ? 'bg-red-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Falharam
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensagens */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="glass-effect border-white/20 hover:border-white/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{message.subject}</h3>
                      <Badge variant="outline" className="border-blue-400 text-blue-400">
                        {getTypeIcon(message.type)}
                        <span className="ml-1">{getTypeText(message.type)}</span>
                      </Badge>
                    </div>
                    <Badge variant="outline" className={getStatusColor(message.status)}>
                      {getStatusIcon(message.status)}
                      <span className="ml-1">{getStatusText(message.status)}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-blue-200 text-sm">
                    <span>Para: {message.recipient}</span>
                    <span>•</span>
                    <span>{message.timestamp}</span>
                  </div>

                  <p className="text-white">{message.content}</p>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Reenviar
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card className="glass-effect border-white/20">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-blue-200">Não há mensagens que correspondam aos filtros selecionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

