import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-staticwebapp-config',
      closeBundle() {
        // Copiar staticwebapp.config.json al dist después del build
        // Primero intenta desde public/, luego desde la raíz
        const srcPublic = join(__dirname, 'public', 'staticwebapp.config.json')
        const srcRoot = join(__dirname, 'staticwebapp.config.json')
        const dest = join(__dirname, 'dist', 'staticwebapp.config.json')
        
        try {
          // Intentar copiar desde public/ primero (Vite ya lo copia, pero por si acaso)
          if (existsSync(srcPublic)) {
            copyFileSync(srcPublic, dest)
            console.log('✅ staticwebapp.config.json copiado desde public/ a dist/')
          } else if (existsSync(srcRoot)) {
            copyFileSync(srcRoot, dest)
            console.log('✅ staticwebapp.config.json copiado desde raíz a dist/')
          } else {
            console.warn('⚠️ No se encontró staticwebapp.config.json')
          }
        } catch (err) {
          console.warn('⚠️ No se pudo copiar staticwebapp.config.json:', err.message)
        }
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})


