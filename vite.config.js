import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/goodent-deploy/',
  plugins: [react()],
  
  // ══════════════════════════════════════════════════
  // 修复 #1/#2: CJS/ESM 兼容性 — 强制预打包有问题的包
  // 这些纯 CJS 库被 ESM 项目 import 时会因缺少 default export 而崩溃:
  //   • stats.js      → 被 @react-three/drei 内部 Stats 组件导入
  //   • use-sync-external-store → 被 framer-motion 内部使用
  //   • @studio-freight/lenis → 旧版 Lenis 的 CJS 构建
  // ══════════════════════════════════════════════════
  optimizeDeps: {
    include: [
      // React 核心 + 生态
      'react',
      'react-dom',
      'react/jsx-runtime',
      
      // 动画库
      'framer-motion',
      
      // 3D 渲染栈 (Three.js 生态)
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      
      // ⚠️ 关键修复：CJS 库必须显式加入预打包
      'stats.js',
      'use-sync-external-store',
      'lenis',
      
      // GSAP
      'gsap',
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
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
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
