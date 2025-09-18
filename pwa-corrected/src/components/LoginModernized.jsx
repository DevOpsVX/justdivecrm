import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Waves, User, Shield, Download, MessageCircle, Smartphone } from 'lucide-react'
import APKDownload from './APKDownload'

const LoginModernized = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('student')
  const [isLoading, setIsLoading] = useState(false)
  const [showAPKDownload, setShowAPKDownload] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background com efeito subaquático */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-blue-950/40"></div>
      
      {/* Bolhas animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header com logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/justdive-logo-refined.png" 
                alt="JUSTDIVE Academy" 
                className="h-20 w-auto filter drop-shadow-lg"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">JUSTDIVE CRM</h1>
            <p className="text-blue-200">Gestão de Escola de Mergulho</p>
          </div>
        </div>

        {/* Banner do App Mobile */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400/30 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Smartphone className="h-8 w-8 text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">App Móvel Disponível</h3>
                <p className="text-xs text-blue-200">Widget de clima e notificações push</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white"
                onClick={() => setShowAPKDownload(true)}
              >
                <Download className="h-4 w-4 mr-1" />
                Instalar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Login */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-white">Entrar no Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Seletor de tipo de usuário */}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={userType === 'student' ? 'default' : 'outline'}
                  className={`flex-1 ${
                    userType === 'student' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                  onClick={() => setUserType('student')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Aluno
                </Button>
                <Button
                  type="button"
                  variant={userType === 'admin' ? 'default' : 'outline'}
                  className={`flex-1 ${
                    userType === 'admin' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                  onClick={() => setUserType('admin')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </div>

              {/* Campos de entrada */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Nome de utilizador
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@justdive.pt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Palavra-passe
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Credenciais de demonstração */}
              <Card className="bg-blue-900/20 border-blue-700/30">
                <CardContent className="p-3">
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">
                    Credenciais de demonstração:
                  </h4>
                  <div className="space-y-1 text-xs text-blue-200">
                    <div><strong>Admin:</strong> admin / admin</div>
                    <div><strong>Estudante:</strong> student / student</div>
                  </div>
                </CardContent>
              </Card>

              {/* Botão de login */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner-justdive"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <>
                    <Waves className="h-4 w-4 mr-2" />
                    Entrar no Sistema
                  </>
                )}
              </Button>
            </form>

            {/* Botão de Suporte IA */}
            <div className="pt-4 border-t border-slate-700">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                onClick={() => {
                  // Implementar chat com IA
                  console.log('Abrir chat com IA')
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Suporte com IA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400">
          © 2025 JustDive — Plataforma de Gestão. Inspirado no azul do Atlântico.
        </div>
      </div>

      {/* Modal de download do APK */}
      {showAPKDownload && (
        <APKDownload onClose={() => setShowAPKDownload(false)} />
      )}
    </div>
  )
}

export default LoginModernized

