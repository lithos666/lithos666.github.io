import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  
  // ══════════════════════════════════════════════════
  // CJS/ESM 兼容性 — 强制预打包有问题的包
  // 这些纯 CJS 库被 ESM 项目 import 时会因缺少 default export 而崩溃:
  //   • use-sync-external-store → 被 framer-motion 内部使用
  //   • lenis → 平滑滚动
  // ══════════════════════════════════════════════════
  optimizeDeps: {
    include: [
      // React 核心 + 生态
      'react',
      'react-dom',
      'react/jsx-runtime',
      
      // 动画库
      'framer-motion',
      
      // ⚠️ 关键修复：CJS 库必须显式加入预打包
      'use-sync-external-store',
      'lenis',
    ],
    // 不排除任何包，让 Vite 全部预打包以避免运行时兼容性问题
    exclude: [],
  },

  build: {
    // ═══ 代码分割优化 ═══
    rollupOptions: {
      output: {
        // Vite 8 要求函数格式
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('use-sync')) {
              return 'react-vendor';
            }
          }
        }
      }
    },
    
    // 压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  
  // 开发服务器配置
  server: {
    port: 5173,
    open: false,
  },
})
