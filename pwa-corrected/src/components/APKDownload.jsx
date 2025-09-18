import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Download,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

const APKDownload = ({ className = '' }) => {
  const [downloadState, setDownloadState] = useState('idle') // idle | downloading | success | error
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
          return Math.min(100, prev + Math.random() * 15)
        })
      }, 200)

      // Simular download real do APK (coloque justdive-app.apk em /public)
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

      // Aguardar animação e finalizar
      setTimeout(() => {
        setDownloadProgress(100)
        setDownloadState('success')

        // Reset após 3 segundos
        setTimeout(() => {
          setDownloadState('idle')
          setDownloadProgress(0)
        }, 3000)
      }, 600)
    } catch (err) {
      console.error(err)
      setDownloadState('error')

      // Reset após 3 segundos
      setTimeout(() => {
        setDownloadState('idle')
        setDownloadProgress(0)
      }, 3000)
    }
  }

  const renderStatus = () => {
    if (downloadState === 'downloading') {
      return (
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <div className="w-full max-w-xs">
            <div className="h-2 w-full rounded bg-white/20">
              <div
                className="h-2 rounded bg-white"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <p className="text-blue-200 text-xs mt-1">
              Baixando... {Math.floor(downloadProgress)}%
            </p>
          </div>
        </div>
      )
    }

    if (downloadState === 'success') {
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle className="w-6 h-6 text-white" />
          <p className="text-blue-100 text-sm">Download concluído!</p>
        </div>
      )
    }

    if (downloadState === 'error') {
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="w-6 h-6 text-white" />
          <p className="text-blue-100 text-sm">
            Ocorreu um erro ao baixar o APK. Tente novamente.
          </p>
        </div>
      )
    }

    // idle
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <Smartphone className="w-6 h-6 text-white" />
        <p className="text-blue-100 text-sm">Pronto para baixar o app Android</p>
      </div>
    )
  }

  return (
    <Card className={`weather-widget-container border-white/20 ${className}`}>
      <CardContent className="p-4 flex flex-col items-center gap-4">
        {renderStatus()}

        <Button
          onClick={handleDownload}
          disabled={downloadState === 'downloading'}
          className="bg-white text-blue-900 hover:bg-blue-100"
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadState === 'downloading' ? 'Baixando...' : 'Baixar APK'}
        </Button>

        <p className="text-[11px] text-blue-200">
          Após o download, instale o APK nas configurações do seu Android.
        </p>
      </CardContent>
    </Card>
  )
}

export default APKDownload
