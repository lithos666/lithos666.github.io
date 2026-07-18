---
kind: dependency_management
name: npm 依赖管理（Vite + React Three Fiber 单页应用）
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
---

本项目采用 npm 作为包管理器，通过 `package.json` 声明运行时与开发时依赖，配合 `package-lock.json`（lockfileVersion 3）锁定完整依赖树，确保构建可重复。无 `.npmrc`、私有 registry 或 vendoring 配置，所有包均从默认 npm 公共仓库拉取。

- 声明式依赖：`dependencies` 包含 React 19、Three.js 生态（`@react-three/fiber`、`@react-three/drei`）、动画库（framer-motion、gsap、lenis）等；`devDependencies` 包含 Vite 8、ESLint 9、gh-pages 等构建与部署工具。
- 版本策略：全部使用 `^` 语义化范围，允许次/补丁升级，由 lockfile 固定实际安装版本。
- 发布脚本：`predeploy` 先执行 `vite build`，再由 `gh-pages -d dist` 推送静态产物至 gh-pages 分支。
- 无多包/monorepo 结构，亦无子项目独立 manifest，依赖管理集中在根目录单一 package.json 中。