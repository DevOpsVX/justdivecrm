import { useState } from 'react'

const LoginSimple = ({ onLogin }) => {
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
        name: userType === 'admin' ? 'Administrador JUSTDIVE' : 'Aluno JUSTDIVE'
      }
      onLogin(userData)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img 
            src="/justdive-logo-transparent.png" 
            alt="JUSTDIVE Blue Academy" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <p className="text-gray-600">Sistema de Gestão de Mergulho</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Entrar na sua conta
            </h2>
            <p className="text-sm text-gray-600">
              Acesse o sistema de gestão de mergulho
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`h-12 px-4 py-2 rounded-lg font-medium transition-colors ${
                userType === 'student' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setUserType('student')}
            >
              👨‍🎓 Aluno
            </button>
            <button
              type="button"
              className={`h-12 px-4 py-2 rounded-lg font-medium transition-colors ${
                userType === 'admin' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setUserType('admin')}
            >
              🛡️ Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Endereço de email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
            <button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
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
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Credenciais de Demonstração:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@justdive.pt / 123456</p>
              <p><strong>Aluno:</strong> aluno@justdive.pt / 123456</p>
            </div>
          </div>
        </div>

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

export default LoginSimple
