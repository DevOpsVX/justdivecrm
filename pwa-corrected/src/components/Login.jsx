import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Waves, User, Shield } from 'lucide-react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('student')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticação
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        email,
        type: userType,
        name: userType === 'admin' ? 'Administrador' : 'Aluno JUSTDIVE'
      }
      onLogin(userData)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Bolhas de fundo discretas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
      </div>

      <Card className="w-full max-w-md glass-effect border-white/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Waves className="h-16 w-16 text-blue-300 diving-animation" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              JUSTDIVE
            </CardTitle>
            <p className="text-blue-200 text-sm">
              Academia de Mergulho
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Seleção de tipo de usuário */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={userType === 'student' ? 'default' : 'outline'}
              className={`flex-1 ${userType === 'student' 
                ? 'bg-white text-blue-900 hover:bg-blue-50' 
                : 'bg-transparent border-white/30 text-white hover:bg-white/10'
              }`}
              onClick={() => setUserType('student')}
            >
              <User className="w-4 h-4 mr-2" />
              Aluno
            </Button>
            <Button
              type="button"
              variant={userType === 'admin' ? 'default' : 'outline'}
              className={`flex-1 ${userType === 'admin' 
                ? 'bg-white text-blue-900 hover:bg-blue-50' 
                : 'bg-transparent border-white/30 text-white hover:bg-white/10'
              }`}
              onClick={() => setUserType('admin')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-white/40"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-white/40"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="text-center">
            <button className="text-blue-200 text-sm hover:text-white transition-colors">
              Esqueceu a senha?
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Rodapé */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-blue-200 text-xs">
          © 2025 JUSTDIVE Academy - Explore o mundo subaquático
        </p>
      </div>
    </div>
  )
}

export default Login

