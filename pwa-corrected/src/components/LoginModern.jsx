import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Waves, User, Shield, Eye, EyeOff, Anchor } from 'lucide-react'

const LoginModern = ({ onLogin }) => {
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Bolhas de fundo animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
      </div>

      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-800/20"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-effect-strong border-white/30 shadow-2xl fade-in">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Logo e animação */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <img 
                    src="/justdive-logo.png" 
                    alt="JUSTDIVE Logo" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <Waves className="w-12 h-12 text-blue-300 diving-animation hidden" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Título e subtítulo */}
            <div className="space-y-2">
              <CardTitle className="text-4xl font-bold text-white tracking-wide">
                JUSTDIVE
              </CardTitle>
              <div className="flex items-center justify-center space-x-2 text-blue-200">
                <Anchor className="w-4 h-4" />
                <p className="text-sm font-medium">Blue Academy</p>
                <Anchor className="w-4 h-4" />
              </div>
              <p className="text-blue-300 text-xs">
                Sistema de Gestão de Mergulho
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            {/* Seleção de tipo de usuário */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={userType === 'student' ? 'default' : 'outline'}
                className={`h-12 transition-all duration-300 ${userType === 'student' 
                  ? 'btn-justdive-primary shadow-lg' 
                  : 'btn-justdive-secondary hover-lift'
                }`}
                onClick={() => setUserType('student')}
              >
                <User className="w-4 h-4 mr-2" />
                Aluno
              </Button>
              <Button
                type="button"
                variant={userType === 'admin' ? 'default' : 'outline'}
                className={`h-12 transition-all duration-300 ${userType === 'admin' 
                  ? 'btn-justdive-primary shadow-lg' 
                  : 'btn-justdive-secondary hover-lift'
                }`}
                onClick={() => setUserType('admin')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-200">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-modern h-12 text-base"
                />
              </div>
              
              {/* Campo de senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-200">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-modern h-12 text-base pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Botão de login */}
              <Button
                type="submit"
                className="w-full h-12 btn-justdive-primary text-base font-semibold hover-lift"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner-justdive mr-3"></div>
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Waves className="w-5 h-5 mr-2" />
                    Entrar no Sistema
                  </div>
                )}
              </Button>
            </form>

            {/* Links auxiliares */}
            <div className="text-center space-y-3">
              <button className="text-blue-300 text-sm hover:text-white transition-colors hover:underline">
                Esqueceu a senha?
              </button>
              <div className="flex items-center justify-center space-x-2 text-xs text-blue-400">
                <div className="w-8 h-px bg-blue-400/30"></div>
                <span>Acesso Seguro</span>
                <div className="w-8 h-px bg-blue-400/30"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-8 text-center space-y-2 slide-in-right">
          <p className="text-blue-200 text-sm">
            Primeira vez? Entre em contato conosco
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-blue-300">
            <span>📞 +351 965 772 295</span>
            <span>•</span>
            <span>✉️ info@justdive.pt</span>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-4 left-0 right-0 text-center slide-in-left">
        <p className="text-blue-300 text-xs">
          © 2025 JUSTDIVE Blue Academy - Explore o mundo subaquático com segurança
        </p>
      </div>
    </div>
  )
}

export default LoginModern
