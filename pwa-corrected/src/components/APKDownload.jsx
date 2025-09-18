import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Download,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import {
  fetchApkMetadata,
  resolveApkDownloadName,
  resolveApkDownloadUrl,
} from '@/services/apkService'

const APKDownload = ({ className = '' }) => {
  const [downloadState, setDownloadState] = useState('idle') // idle | downloading | success | error
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadError, setDownloadError] = useState('')
  const [apkInfo, setApkInfo] = useState(null)
  const [metadataStatus, setMetadataStatus] = useState('loading') // loading | ready | error
  const [metadataMessage, setMetadataMessage] = useState('')
  const [metadataAttempt, setMetadataAttempt] = useState(0)

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    const loadMetadata = async () => {
      setMetadataStatus('loading')
      setMetadataMessage('')

      try {
        const metadata = await fetchApkMetadata({ signal: controller.signal })

        if (!active) return

        setApkInfo(metadata)
        setMetadataStatus('ready')
      } catch (error) {
        if (!active || error.name === 'AbortError') return

        const message =
          error.status === 404
            ? error.message || 'APK ainda não está disponível para download.'
            : error.message || 'Não foi possível verificar a disponibilidade do APK.'

        setMetadataStatus('error')
        setMetadataMessage(message)
      }
    }

    loadMetadata()

    return () => {
      active = false
      controller.abort()
    }
  }, [metadataAttempt])

  const handleDownload = async () => {
    if (metadataStatus !== 'ready') {
      setDownloadState('error')
      setDownloadError(
        metadataMessage || 'O APK ainda não está disponível para download.'
      )

      setTimeout(() => {
        setDownloadState('idle')
        setDownloadError('')
      }, 4000)

      return
    }

    setDownloadState('downloading')
    setDownloadProgress(0)
    setDownloadError('')

    const progressInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          return prev
        }

        return Math.min(95, prev + Math.random() * 15)
      })
    }, 200)

    try {
      const response = await fetch(resolveApkDownloadUrl(apkInfo))
      if (!response.ok) {
        const error =
          response.status === 404
            ? 'Arquivo APK não encontrado (erro 404).'
            : 'Erro ao baixar o APK.'
        throw new Error(error)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = resolveApkDownloadName(apkInfo)
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
          setDownloadError('')
        }, 3000)
      }, 600)
    } catch (err) {
      console.error(err)
      setDownloadState('error')
      setDownloadError(err.message || 'Erro ao baixar o APK. Tente novamente.')

      // Reset após 3 segundos
      setTimeout(() => {
        setDownloadState('idle')
        setDownloadProgress(0)
        setDownloadError('')
      }, 3000)
    } finally {
      clearInterval(progressInterval)
    }
  }

  const retryMetadata = () => {
    setDownloadError('')
    setMetadataAttempt((attempt) => attempt + 1)
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
            {downloadError || 'Ocorreu um erro ao baixar o APK. Tente novamente.'}
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
          disabled={
            downloadState === 'downloading' || metadataStatus !== 'ready'
          }
          className="bg-white text-blue-900 hover:bg-blue-100"
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadState === 'downloading'
            ? 'Baixando...'
            : metadataStatus === 'loading'
              ? 'Verificando...'
              : metadataStatus === 'error'
                ? 'Indisponível'
                : 'Baixar APK'}
        </Button>

        {metadataStatus === 'ready' && apkInfo ? (
          <div className="text-[11px] text-blue-100 text-center space-y-1">
            <p>Versão: {apkInfo.version}</p>
            <p>Tamanho: {apkInfo.sizeFormatted}</p>
          </div>
        ) : null}

        {metadataStatus === 'loading' ? (
          <p className="text-[11px] text-blue-200 text-center">
            Verificando disponibilidade do APK...
          </p>
        ) : null}

        {metadataStatus === 'error' ? (
          <div className="text-[11px] text-red-200 text-center space-y-2">
            <p>{metadataMessage}</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={retryMetadata}
              className="h-7 px-3 text-red-100 hover:bg-red-500/20"
            >
              Tentar novamente
            </Button>
          </div>
        ) : null}

        {downloadState !== 'downloading' && metadataStatus === 'ready' ? (
          <p className="text-[11px] text-blue-200 text-center">
            Após o download, instale o APK nas configurações do seu Android.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default APKDownload
