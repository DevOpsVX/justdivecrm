import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Download, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Smartphone
} from 'lucide-react'

const APKDownload = ({ className = '' }) => {
  const [downloadState, setDownloadState] = useState('idle') // idle, downloading, success, error
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleDownload = async () => {
    setDownloadState('downloading')
    setDownloadProgress(0)

    try {
      // Simular progresso de download
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)

      // Simular download do APK
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

      // Aguardar conclusão da animação
      setTimeout(() => {
        clearInterval(progressInterval)
        setDownloadProgress(100)
        setDownloadState('success')
        
        // Reset após 3 segundos
        setTimeout(() => {
          setDownloadState('idle')
          setDownloadProgress(0)
        }, 3000)
      }, 1000)

    } catch (error) {
      console.error('Erro no download:', error)
      setDownloadState('error')
      
      // Reset após 3 segundos
      setTimeout(() => {
        setDownloadState('idle')
        setDownloadProgress(0)
      }, 3000)
    }
  }

  const getButtonContent = () => {
    switch (downloadState) {
      case 'downloading':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Baixando... {Math.round(downloadProgress)}%
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            Download Concluído!
          </>
        )
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
            Erro no Download
          </>
        )
      default:
        return (
          <>
            <Download className="w-4 h-4 mr-2" />
            Baixar APK
          </>
        )
    }
  }

  const getButtonVariant = () => {
    switch (downloadState) {
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <Card className={`bg-gradient-to-br from-green-600 to-green-800 border-green-500/30 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              App Smartphone Nativo
            </h3>
            <p className="text-green-100 text-sm mb-3">
              Widget meteorológico, notificações push e funcionalidades offline
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={handleDownload}
                disabled={downloadState === 'downloading'}
                variant={getButtonVariant()}
                className="w-full bg-white text-green-800 hover:bg-green-50 font-semibold"
              >
                {getButtonContent()}
              </Button>
              
              {downloadState === 'downloading' && (
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Smartphone className="w-8 h-8 text-white/70" />
          </div>
        </div>
        
        {downloadState === 'success' && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white">
                <p className="font-medium mb-1">APK baixado com sucesso!</p>
                <p className="text-green-100">
                  Ative "Fontes desconhecidas" nas configurações do Smartphone e instale o aplicativo.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {downloadState === 'error' && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white">
                <p className="font-medium mb-1">Erro no download</p>
                <p className="text-red-100">
                  Tente novamente ou contacte o suporte técnico.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-green-200 space-y-1">
          <div className="flex justify-between">
            <span>Versão:</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Tamanho:</span>
            <span>~25 MB</span>
          </div>
          <div className="flex justify-between">
            <span>Smartphone:</span>
            <span>6.0+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default APKDownload

