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

export default function Reservations() {
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
