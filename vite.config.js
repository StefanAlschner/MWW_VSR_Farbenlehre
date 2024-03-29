import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dsv from '@rollup/plugin-dsv'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MWW_VSR_Farbenlehre/',
  plugins: [react(), dsv()],
  server: {
    host: '172.17.8.144',
    port: 5174,
    watch: {
      ignored: ['node_modules/**'],
    },
    assetsInclude: ['**/*.csv'],
  }
})
