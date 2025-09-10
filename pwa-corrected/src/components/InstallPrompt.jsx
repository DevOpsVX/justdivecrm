import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Smartphone, X, Waves } from 'lucide-react'

const InstallPrompt = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA instalada')
      }
      
      setDeferredPrompt(null)
      onClose()
    } else {
      // Mostrar instruções manuais
      setShowAndroidInstructions(true)
    }
  }

  const downloadAndroidApp = async () => {
    try {
      // Download direto do APK da pasta public
      const response = await fetch('/justdive-app.apk')
      
      if (!response.ok) {
        throw new Error('Erro ao baixar o APK')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'JUSTDIVE-Academy-v1.0.0.apk'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Fechar o modal após download
      setTimeout(() => {
        onClose()
      }, 1000)
      
    } catch (error) {
      console.error('Erro no download do APK:', error)
      alert('Erro ao baixar o APK. Tente novamente.')
    }
  }

  if (showAndroidInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="glass-effect border-white/20 max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Smartphone className="w-6 h-6" />
                <span>Instalar App Android</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                JUSTDIVE Mobile
              </h3>
              <p className="text-blue-200 text-sm">
                Aplicação nativa com widget meteorológico e notificações push
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <h4 className="text-white font-medium text-sm mb-2">
                  Funcionalidades Nativas:
                </h4>
                <ul className="text-blue-200 text-xs space-y-1">
                  <li>• Widget na tela inicial com semáforo meteorológico</li>
                  <li>• Notificações push em tempo real</li>
                  <li>• IA assistente especializada em mergulho</li>
                  <li>• Interface otimizada para Android</li>
                </ul>
              </div>

              <Button
                onClick={downloadAndroidApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar APK Android
              </Button>

              <div className="text-xs text-blue-300 text-center">
                <p>Após o download, ative "Fontes desconhecidas" nas configurações do Android para instalar.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <Card className="glass-effect border-white/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Waves className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm">
                Instalar JUSTDIVE
              </h4>
              <p className="text-blue-200 text-xs mt-1">
                Acesso rápido e funcionalidades offline
              </p>
              
              <div className="flex space-x-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Instalar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAndroidInstructions(true)}
                  className="text-blue-200 hover:bg-white/10"
                >
                  <Smartphone className="w-3 h-3 mr-1" />
                  Android
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="text-blue-200 hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InstallPrompt

