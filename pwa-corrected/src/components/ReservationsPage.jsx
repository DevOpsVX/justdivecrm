import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react'

export default function ReservationsPage() {
  const [reservations] = useState([
    {
      id: 1,
      studentName: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+351 912 345 678',
      course: 'Open Water Diver',
      date: '2025-09-20',
      time: '09:00',
      location: 'Berlengas',
      status: 'confirmed',
      participants: 2,
      notes: 'Primeira experiência de mergulho'
    },
    {
      id: 2,
      studentName: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+351 923 456 789',
      course: 'Advanced Open Water',
      date: '2025-09-20',
      time: '14:00',
      location: 'Peniche',
      status: 'pending',
      participants: 1,
      notes: 'Mergulho noturno especializado'
    },
    {
      id: 3,
      studentName: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      phone: '+351 934 567 890',
      course: 'Rescue Diver',
      date: '2025-09-21',
      time: '10:30',
      location: 'Sesimbra',
      status: 'cancelled',
      participants: 3,
      notes: 'Cancelado devido às condições meteorológicas'
    },
    {
      id: 4,
      studentName: 'Ana Ferreira',
      email: 'ana.ferreira@email.com',
      phone: '+351 945 678 901',
      course: 'Discover Scuba Diving',
      date: '2025-09-22',
      time: '11:00',
      location: 'Berlengas',
      status: 'confirmed',
      participants: 2,
      notes: 'Batismo de mergulho para casal'
    }
  ])

  const [filter, setFilter] = useState('all')

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'border-green-400 text-green-400'
      case 'pending':
        return 'border-yellow-400 text-yellow-400'
      case 'cancelled':
        return 'border-red-400 text-red-400'
      default:
        return 'border-gray-400 text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelada'
      default:
        return 'Desconhecido'
    }
  }

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter)

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Calendar className="w-6 h-6" />
            <span>Gestão de Reservas</span>
          </h1>
          <p className="text-blue-200">Gerir reservas de cursos e mergulhos</p>
        </div>
        
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Reserva
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
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Confirmadas</p>
                <p className="text-3xl font-bold text-white">{stats.confirmed}</p>
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
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Canceladas</p>
                <p className="text-3xl font-bold text-white">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                variant={filter === 'confirmed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('confirmed')}
                className={filter === 'confirmed' ? 'bg-green-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Confirmadas
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
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('cancelled')}
                className={filter === 'cancelled' ? 'bg-red-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Canceladas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="glass-effect border-white/20 hover:border-white/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{reservation.studentName}</h3>
                    <Badge variant="outline" className={getStatusColor(reservation.status)}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1">{getStatusText(reservation.status)}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{reservation.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{reservation.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{reservation.participants} participante(s)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(reservation.date).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{reservation.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{reservation.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-white font-medium">Curso: {reservation.course}</p>
                    {reservation.notes && (
                      <p className="text-blue-200 text-sm">Observações: {reservation.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Editar
                  </Button>
                  {reservation.status === 'pending' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Confirmar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <Card className="glass-effect border-white/20">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-blue-200">Não há reservas que correspondam aos filtros selecionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

