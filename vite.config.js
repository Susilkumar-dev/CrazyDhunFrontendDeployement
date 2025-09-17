import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9999,       // use your desired port
    strictPort: true,  // fail if port is busy
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 9999       // HMR WebSocket uses same port
    },
  },
})
