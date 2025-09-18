import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Waves, User, Shield, Eye, EyeOff, Anchor, Lock, Mail } from 'lucide-react'

const LoginGHL = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('student')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticação
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        email,
        type: userType,
        name: userType === 'admin' ? 'Administrador JUSTDIVE' : 'Aluno JUSTDIVE'
      }
      onLogin(userData)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/justdive-logo-transparent.png" 
              alt="JUSTDIVE Blue Academy" 
              className="h-16 w-auto"
            />
          </div>
          <p className="text-gray-600">Sistema de Gestão de Mergulho</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Entrar na sua conta
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Acesse o sistema de gestão de mergulho
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={userType === 'student' ? 'default' : 'outline'}
                className={`h-12 ${userType === 'student' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setUserType('student')}
              >
                <User className="w-4 h-4 mr-2" />
                Aluno
              </Button>
              <Button
                type="button"
                variant={userType === 'admin' ? 'default' : 'outline'}
                className={`h-12 ${userType === 'admin' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setUserType('admin')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Endereço de email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Credenciais de Demonstração:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin@justdive.pt / 123456</p>
                <p><strong>Aluno:</strong> aluno@justdive.pt / 123456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-600">
            Primeira vez? Entre em contato conosco
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>📞 +351 965 772 295</span>
            <span>•</span>
            <span>✉️ info@justdive.pt</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            © 2025 JUSTDIVE Blue Academy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginGHL
