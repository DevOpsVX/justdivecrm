import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FRONTEND_ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(FRONTEND_ROOT, 'dist')
const BACKEND_STATIC_DIR = path.resolve(FRONTEND_ROOT, '..', 'src', 'static')
const PUBLIC_APK_PATH = path.join(FRONTEND_ROOT, 'public', 'justdive-app.apk')
const DIST_APK_PATH = path.join(DIST_DIR, 'justdive-app.apk')
const TARGET_APK_PATH = path.join(BACKEND_STATIC_DIR, 'justdive-app.apk')

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function emptyDirectory(targetDir) {
  const entries = await fs.readdir(targetDir, { withFileTypes: true })
  await Promise.all(
    entries.map((entry) =>
      fs.rm(path.join(targetDir, entry.name), { recursive: true, force: true })
    )
  )
}

async function copyDirectory(sourceDir, destinationDir) {
  await fs.cp(sourceDir, destinationDir, { recursive: true })
}

async function ensureApkFile() {
  const sourceApk = (await pathExists(DIST_APK_PATH)) ? DIST_APK_PATH : PUBLIC_APK_PATH

  if (!(await pathExists(sourceApk))) {
    console.warn('[sync-static] APK não encontrado nas pastas dist ou public.')
    return
  }

  await fs.copyFile(sourceApk, TARGET_APK_PATH)
  console.log('[sync-static] APK sincronizado com a pasta estática do backend.')
}

async function synchronizeStaticAssets() {
  if (!(await pathExists(DIST_DIR))) {
    console.error('[sync-static] Diretório dist não encontrado. Execute "npm run build" primeiro.')
    process.exit(1)
  }

  await fs.mkdir(BACKEND_STATIC_DIR, { recursive: true })
  await emptyDirectory(BACKEND_STATIC_DIR)
  await copyDirectory(DIST_DIR, BACKEND_STATIC_DIR)
  console.log('[sync-static] Conteúdo do dist copiado para src/static.')

  await ensureApkFile()
}

synchronizeStaticAssets().catch((error) => {
  console.error('[sync-static] Falha ao sincronizar assets estáticos:', error)
  process.exit(1)
})
