---
kind: frontend_style
name: Apple 风格暗色主题与 CSS 变量设计系统
category: frontend_style
scope:
    - '**'
source_files:
    - src/index.css
    - src/App.css
    - src/components/HeroSection.css
    - src/components/ui/HoloCard.css
    - src/components/AboutSection.css
---

## 1. 采用的体系与方法论
- **CSS 变量 + BEM 类名**：全局设计令牌集中在 `src/index.css` 的 `:root`，组件样式使用语义化类名（如 `.glass-card`、`.section-heading`），无 Tailwind/SCSS/Less 等预处理或原子框架。
- **Apple HIG 暗色主题**：以纯黑背景 (`#000`) 搭配 Apple 风格的紫/青/品红强调色，大量使用 `backdrop-filter: blur(40px) saturate(180%)` 实现毛玻璃卡片与导航栏。
- **字体栈**：通过 Google Fonts 引入 Inter + Noto Sans SC，并回落到 `-apple-system / SF Pro / PingFang SC`，中文优先显示思源黑体。
- **响应式策略**：基于 `@media (max-width: 768px)` 与 `clamp()` 函数做断点与弹性字号，移动端隐藏自定义光标与部分装饰效果。
- **动效与可访问性**：动画集中在 CSS `@keyframes`；对 `prefers-reduced-motion` 提供降级方案，确保低动效用户可用。

## 2. 核心文件与包
- 设计令牌与全局样式：`src/index.css`
- 应用级布局与导航：`src/App.css`
- 首页黑洞粒子叠加层：`src/components/HeroSection.css`
- 全息卡牌特效：`src/components/ui/HoloCard.css`
- 关于页双栏布局：`src/components/AboutSection.css`
- 其他组件级样式：`src/components/*.css`（Contact/KnowledgeBase/WorksSection/YearOneProjects/ProjectDetailModal）
- 3D 场景由 React Three Fiber 渲染，位于 `src/components/three/*`，不依赖外部 UI 库。

## 3. 架构与约定
- **单一入口样式**：所有全局 CSS 在 `index.css` 中集中声明，组件仅引入自身 `.css`，避免跨组件样式污染。
- **设计令牌分层**：颜色、字体、玻璃态参数统一放在 `:root`，组件通过 `var(--xxx)` 引用，新增主题只需改变量。
- **Glass Card 基类**：`.glass-card` 作为通用容器，配合 `border-radius: 20px`、内阴影与 hover 边框高亮，贯穿 Works/About/Contact 等模块。
- **标题系统**：`.section-label` + `.section-heading` + `.section-subheading` 构成统一的章节排版规范，配合渐变 shimmer hover 效果。
- **滚动阶段驱动**：Hero 区通过 GSAP 向 `<body>` 注入 `scroll-phase-*` 类，CSS 据此控制内容淡入/遮罩透明度，实现 3D→HTML 的无缝过渡。
- **自定义光标**：`.custom-cursor` + `.cursor-trail` 在桌面端覆盖默认指针，移动端自动禁用。

## 4. 开发者应遵循的规则
1. **只使用 CSS 变量**：新增颜色/尺寸/模糊半径一律写入 `:root`，禁止硬编码魔法数字。
2. **复用基础类**：卡片用 `.glass-card`，章节标题用 `.section-heading`，标签用 `.section-label`，保持视觉一致性。
3. **组件样式隔离**：每个组件自带同名 `.css`，不在全局文件中追加规则；如需共享样式，先提升到 `index.css` 的令牌层。
4. **响应式断点**：统一使用 `768px` 作为平板/手机分界，配合 `clamp()` 控制字号与间距，避免过多断点碎片化。
5. **动效克制**：优先使用 CSS transition/keyframes；复杂交互交给 R3F 着色器或 GSAP，不要堆叠多层 JS 动画。
6. **无障碍**：为含动画的组件添加 `@media (prefers-reduced-motion: reduce)` 降级；确保对比度满足 WCAG AA。
7. **3D 与 DOM 分层**：R3F Canvas 固定于 `z-index: -1`，HTML 内容在其上层，参考 HeroSection 的 backdrop 模式。