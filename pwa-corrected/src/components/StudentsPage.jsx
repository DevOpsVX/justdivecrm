import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  GraduationCap, 
  Phone, 
  Mail,
  Calendar,
  MapPin,
  Plus,
  Search,
  Filter,
  Award,
  BookOpen,
  Clock
} from 'lucide-react'

export default function StudentsPage() {
  const [students] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+351 912 345 678',
      level: 'Open Water Diver',
      joinDate: '2024-03-15',
      totalDives: 12,
      lastDive: '2025-09-10',
      location: 'Lisboa',
      status: 'active',
      certifications: ['Open Water Diver', 'Advanced Open Water'],
      nextCourse: 'Rescue Diver'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+351 923 456 789',
      level: 'Advanced Open Water',
      joinDate: '2024-01-20',
      totalDives: 28,
      lastDive: '2025-09-15',
      location: 'Porto',
      status: 'active',
      certifications: ['Open Water Diver', 'Advanced Open Water', 'Rescue Diver'],
      nextCourse: 'Divemaster'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      phone: '+351 934 567 890',
      level: 'Rescue Diver',
      joinDate: '2023-11-08',
      totalDives: 45,
      lastDive: '2025-09-12',
      location: 'Coimbra',
      status: 'active',
      certifications: ['Open Water Diver', 'Advanced Open Water', 'Rescue Diver', 'Deep Diver'],
      nextCourse: 'Divemaster'
    },
    {
      id: 4,
      name: 'Ana Ferreira',
      email: 'ana.ferreira@email.com',
      phone: '+351 945 678 901',
      level: 'Beginner',
      joinDate: '2025-09-01',
      totalDives: 2,
      lastDive: '2025-09-08',
      location: 'Setúbal',
      status: 'new',
      certifications: [],
      nextCourse: 'Open Water Diver'
    },
    {
      id: 5,
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com',
      phone: '+351 956 789 012',
      level: 'Divemaster',
      joinDate: '2022-05-12',
      totalDives: 89,
      lastDive: '2025-09-16',
      location: 'Faro',
      status: 'instructor',
      certifications: ['Open Water Diver', 'Advanced Open Water', 'Rescue Diver', 'Divemaster'],
      nextCourse: 'Instructor Development Course'
    }
  ])

  const [filter, setFilter] = useState('all')

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'border-green-400 text-green-400'
      case 'new':
        return 'border-blue-400 text-blue-400'
      case 'instructor':
        return 'border-purple-400 text-purple-400'
      case 'inactive':
        return 'border-gray-400 text-gray-400'
      default:
        return 'border-gray-400 text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'new':
        return 'Novo'
      case 'instructor':
        return 'Instrutor'
      case 'inactive':
        return 'Inativo'
      default:
        return 'Desconhecido'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-600'
      case 'Open Water Diver':
        return 'bg-green-600'
      case 'Advanced Open Water':
        return 'bg-yellow-600'
      case 'Rescue Diver':
        return 'bg-orange-600'
      case 'Divemaster':
        return 'bg-purple-600'
      case 'Instructor':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const filteredStudents = filter === 'all' 
    ? students 
    : students.filter(s => s.status === filter)

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    new: students.filter(s => s.status === 'new').length,
    instructors: students.filter(s => s.status === 'instructor').length,
    totalDives: students.reduce((sum, s) => sum + s.totalDives, 0)
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Gestão de Alunos</span>
          </h1>
          <p className="text-blue-200">Gerir alunos, certificações e progressão</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Alunos</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Ativos</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Novos</p>
                <p className="text-3xl font-bold text-white">{stats.new}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Instrutores</p>
                <p className="text-3xl font-bold text-white">{stats.instructors}</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Mergulhos</p>
                <p className="text-3xl font-bold text-white">{stats.totalDives}</p>
              </div>
              <Clock className="w-8 h-8 text-cyan-400" />
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
                Todos
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('active')}
                className={filter === 'active' ? 'bg-green-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Ativos
              </Button>
              <Button
                variant={filter === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('new')}
                className={filter === 'new' ? 'bg-blue-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Novos
              </Button>
              <Button
                variant={filter === 'instructor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('instructor')}
                className={filter === 'instructor' ? 'bg-purple-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}
              >
                Instrutores
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="glass-effect border-white/20 hover:border-white/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{student.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getLevelColor(student.level) + ' text-white border-0'}>
                        {student.level}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(student.status)}>
                        {getStatusText(student.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{student.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{student.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{student.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Desde {new Date(student.joinDate).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-blue-200 text-sm">Total de Mergulhos</p>
                      <p className="text-white font-semibold">{student.totalDives}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-blue-200 text-sm">Último Mergulho</p>
                      <p className="text-white font-semibold">{new Date(student.lastDive).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-blue-200 text-sm">Próximo Curso</p>
                      <p className="text-white font-semibold">{student.nextCourse}</p>
                    </div>
                  </div>

                  {student.certifications.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-blue-200 text-sm">Certificações</p>
                      <div className="flex flex-wrap gap-2">
                        {student.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="border-blue-400 text-blue-400">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Ver Perfil
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

      {filteredStudents.length === 0 && (
        <Card className="glass-effect border-white/20">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Nenhum aluno encontrado</h3>
            <p className="text-blue-200">Não há alunos que correspondam aos filtros selecionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

