import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function getScriptUrl() {
  try {
    const configPath = join(__dirname, 'src', 'config.js')
    const content = readFileSync(configPath, 'utf-8')
    const m = content.match(/GOOGLE_SCRIPT_URL\s*=\s*["']([^"']+)["']/)
    return m ? m[1] : ''
  } catch {
    return ''
  }
}

export default defineConfig({
  plugins: [react()],
  base: '/ChaCasaNova/',
  server: {
    proxy: (() => {
      const scriptUrl = getScriptUrl()
      if (!scriptUrl || scriptUrl.includes('COLE_AQUI')) return undefined
      const urlObj = new URL(scriptUrl)
      return {
        '/api/sheets': {
          target: urlObj.origin,
          changeOrigin: true,
          secure: true,
          rewrite: (path) =>
            urlObj.pathname + (path.includes('?') ? path.substring(path.indexOf('?')) : ''),
        },
      }
    })(),
  },
})
