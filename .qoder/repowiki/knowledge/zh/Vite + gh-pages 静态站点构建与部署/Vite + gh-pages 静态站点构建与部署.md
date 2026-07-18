---
kind: build_system
name: Vite + gh-pages 静态站点构建与部署
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - vite.config.js
    - index.html
    - cleanup.ps1
---

## 构建系统概览

本项目采用 **Vite 8** 作为前端构建工具，配合 `@vitejs/plugin-react` 提供 React JSX/TSX 支持，通过 npm scripts 驱动开发、构建与部署全流程。产物为纯静态站点，直接部署到 GitHub Pages。

## 核心文件与职责

- `package.json`：定义所有脚本命令与依赖，是构建系统的唯一入口
- `vite.config.js`：Vite 构建配置，包含插件、依赖预打包、代码分割与压缩策略
- `index.html`：HTML 模板，挂载 `/src/main.jsx` 作为应用入口
- `cleanup.ps1`：PowerShell 辅助脚本，用于清理 `public/projects` 中的非图片资源（本地使用）

## 构建流程与约定

### 开发阶段
```bash
npm run dev          # 启动 Vite 开发服务器 (端口 5173)
npm run preview      # 预览生产构建产物
```

### 生产构建
```bash
npm run build        # 执行 vite build，输出至 dist/
```

### 部署流程
```bash
npm run deploy       # 先执行 predeploy → build，再用 gh-pages 推送 dist/ 到 gh-pages 分支
```

部署链路由 npm 的 `predeploy` 钩子保证顺序：先构建再推送，无需手动干预。

## 构建优化策略

### 依赖预打包（optimizeDeps）
针对 CJS/ESM 兼容性问题，显式将以下包加入预打包白名单：
- `stats.js`、`use-sync-external-store`、`lenis` — 旧版 CJS 库
- `react`、`react-dom`、`framer-motion`、`three`、`gsap` — 大型运行时依赖

同时设置 `exclude: []` 强制全部预打包，避免运行时兼容性崩溃。

### 代码分割（manualChunks）
按功能域拆分 vendor chunk，提升缓存命中率与首屏加载性能：
- `three-vendor`：Three.js 及 @react-three/* 生态
- `animation-vender`：framer-motion + GSAP
- `react-vendor`：React 核心 + scheduler + use-sync-external-store

### 压缩与体积控制
- 使用 `terser` 进行代码压缩，生产环境移除 `console` 与 `debugger`
- 启用 `reportCompressedSize` 输出压缩后体积报告
- 设置 `chunkSizeWarningLimit: 1000` 防止单个 chunk 过大

## 资源管理约定

- 项目素材（图片、模型、视频等）统一放在 `public/projects/<编号>/<分类>/` 下，由 Vite 原样复制到 `dist/`
- 字体文件（`.typeface.json`）、图标（`favicon.svg`、`icons.svg`）置于 `public/` 根目录
- 构建时不会对这些静态资源做额外处理，保持原始路径引用

## 开发者注意事项

1. **新增第三方依赖**：若引入新的 CJS 库导致 ESM 报错，需同步添加到 `optimizeDeps.include` 中
2. **大依赖拆分**：新增超过 1MB 的依赖时，考虑在 `manualChunks` 中为其创建独立 chunk
3. **静态资源**：所有需要被构建产物引用的资源必须放入 `public/` 目录，并通过绝对路径 `/xxx` 引用
4. **部署前检查**：可使用 `npm run preview` 验证构建产物是否正确
5. **清理资源**：本地修改 `public/projects` 后可运行 `cleanup.ps1` 删除非图片文件减小仓库体积