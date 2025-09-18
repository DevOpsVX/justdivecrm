const METADATA_ENDPOINT = '/api/apk/metadata'
const FALLBACK_DOWNLOAD_URL = '/justdive-app.apk'

export async function fetchApkMetadata(options = {}) {
  const { signal } = options

  const response = await fetch(METADATA_ENDPOINT, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (response.ok) {
    return response.json()
  }

  const errorClone = response.clone()
  let errorMessage = 'Falha ao obter informações do APK.'

  try {
    const payload = await errorClone.json()
    if (payload?.message) {
      errorMessage = payload.message
    }
  } catch (jsonError) {
    try {
      const text = await errorClone.text()
      if (text) {
        errorMessage = text
      }
    } catch (textError) {
      console.error('Erro ao ler resposta de erro do APK:', textError)
    }
  }

  const error = new Error(errorMessage)
  error.status = response.status
  throw error
}

export function resolveApkDownloadUrl(metadata) {
  return metadata?.downloadUrl || FALLBACK_DOWNLOAD_URL
}

export function resolveApkDownloadName(metadata) {
  return metadata?.downloadFileName || metadata?.fileName || 'justdive-app.apk'
}
