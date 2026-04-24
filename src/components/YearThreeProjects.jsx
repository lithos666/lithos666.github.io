/**
 * YearThreeProjects — 大三上学期 (2025 Fall) 实践作品集
 *
 * 使用共享 CoverFlowCarousel 组件，仅保留数据定义和配置。
 * UI 逻辑、Cover Flow 动画、键盘/触摸交互均由 CoverFlowCarousel 处理。
 * 样式复用 YearOneProjects.css (三个学年共享同一套 Cover Flow CSS)
 *
 * 数据来源: /public/projects/3/
 * 当前文件夹: 工效学 / 大创 / 数学物理方法 / 微电路设计 / 自动控制原理
 */

import CoverFlowCarousel from './CoverFlowCarousel';
import './YearOneProjects.css';

// ═════════════════════════════════════════════════════
// 项目数据定义 — 大三上学期
// ═════════════════════════════════════════════════════

const PROJECTS = [
  // ══════════════════════════════════════════════════════
  // ① 工效学 — 智慧课堂多模态交互系统
  // 资源位置: /projects/3/工效学/
  // ══════════════════════════════════════════════════════
  {
    id: 'ergonomics',
    title: '智慧课堂·课堂AI录音盒',
    subtitle: '工效学 · jack人因设计 · AI语音',
    category: '人机交互 · 工效学设计',
    year: '2025 秋',
    color: '#00B8D4',
    accentColor: 'rgba(0,184,212,0.10)',
    tags: ['jack', 'C#', 'ClearerVoice', 'EyeGestures', '3D建模', 'STEP'],
    description:
      '面向智慧课堂场景的多模态交互硬件与软件综合系统。基于工效学理论进行用户研究、产品迭代设计与交互验证。包含两代完整产品外观设计（STL/STEP/KSP）、基于jack开发的人因分析、AI语音处理模块（ClearerVoice去噪/变声）。',
    highlights: [
      '第一代 + 第二代产品外观设计',
      'jack 智慧课堂交互界面 — 完整Web端UI项目',
      'AI语音处理 — ClearerVoice Studio：实时去噪、变声、语音增强',
      'Jack 人因工程软件仿真 — 教室环境人体工程学分析与优化',
    ],
    images: [
      '/projects/3/工效学/工效学产品.jpg',
      '/projects/3/工效学/网页UI界面.jpg',
      '/projects/3/工效学/渲染教室.png',
      '/projects/3/工效学/jack教室.png',
    ],
    documents: [
      { name: '课程作业.pdf', path: '/projects/3/工效学/工效学课程作业-智慧课堂互动硬件设计与多模态交互研究.pdf' },
      { name: '场景文件', path: '/projects/3/工效学/Classroom.blend' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ② 大学生创新创业训练计划（大创）— 兰精灵智能花盆
  // 资源位置: /projects/3/大创/
  // ══════════════════════════════════════════════════════
  {
    id: 'startup-flowerpot',
    title: '兰精灵 · 智能养护花盆',
    subtitle: '大创项目 · 创新创业 · IoT嵌入式',
    category: '创新创业 · IoT · 嵌入式',
    year: '2025 秋',
    color: '#66BB6A',
    accentColor: 'rgba(102,187,106,0.10)',
    tags: ['SolidWorks', 'Arduino', 'IoT', '创新创业', '答辩汇报'],
    description:
      '国家级大学生创新创业训练计划项目——「兰精灵」智能养护花盆。面向家庭园艺爱好者的智能化植物养护设备，集成自动浇灌、光照监测、温湿度调控等多传感器融合系统。',
    highlights: [
      '兰精灵 v1.2 三维模型 (.step) — 含风扇外壳等核心部件的参数化建模',
      '两版实物原型 (flower1 / flower2) — 从概念验证到功能完善的迭代过程',
      '大创结项全套材料 — 结项报告(.docx/.pdf) + 汇报PPT',
      '创新创业答辩报告 — 项目背景/技术路线/商业模式/财务预算完整文档链',
      '申报书 — 国家立项资质官方认证文件',
    ],
    images: [
      '/projects/3/大创/实物照片.jpg',
      '/projects/3/大创/实物照片1.jpg',
      '/projects/3/大创/产品.png',
      '/projects/3/大创/兰科智护.png',
    ],
    documents: [
      { name: '结项汇报.pptx', path: '/projects/3/大创/大创结项汇报.pptx' },
      { name: '兰精灵申报书', path: '/projects/3/大创/兰精灵申报书.docx' },
      { name: '风扇外壳.step', path: '/projects/3/大创/风扇外壳.step' },
      { name: '项目PPT.pptx', path: '/projects/3/大创/兰精灵——智能养护花盆.pptx' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ③ 数学物理方法 — 电荷抑制飞溅仿真
  // 资源位置: /projects/3/数学物理方法/
  // ══════════════════════════════════════════════════════
  {
    id: 'math-physics-method',
    title: '数学物理方法 · 电荷液滴飞溅',
    subtitle: '偏微分方程数值求解 · COMSOL仿真 · 有限元网格生成',
    category: '数理方法 · 计算物理',
    year: '2025 秋',
    color: '#FFA726',
    accentColor: 'rgba(255,167,38,0.10)',
    tags: ['COMSOL Multiphysics', 'MATLAB', '偏微分方程', 'FEM网格', '流体力学'],
    description:
      '将数学物理方法中的偏微分方程理论应用于带电液滴撞击表面的飞溅抑制问题研究。参考香港理工大学关于带电液滴不会飞溅的核心论文，使用 COMSOL 进行流固耦合多物理场仿真，结合 MATLAB 自定义网格生成器(distmesh)进行有限元前处理。',
    highlights: [
      'COMSOL 流体仿真 — water_strike_ground 系列 .mph 文件（3组不同参数对比）',
      'MATLAB FEM 网格生成器 — distmesh 改进版 + mesh.py',
      '电荷抑制效应 — 参考港理工论文的理论推导 + 数值验证',
      '中期汇报 + 期末汇报 PPT — 12组完整答辩材料',
    ],
    images: [
      '/projects/3/数学物理方法/急速下落.gif',
      '/projects/3/数学物理方法/带电下坠.gif',
      '/projects/3/数学物理方法/不带电下坠.gif',
    ],
    documents: [
      { name: '中期汇报.pptx', path: '/projects/3/数学物理方法/12组——电荷抑制飞溅——中期汇报.pptx' },
      { name: '期末汇报.pptx', path: '/projects/3/数学物理方法/电荷抑制飞溅——期末汇报.pptx' },
      { name: '仿真主文件.mph', path: '/projects/3/数学物理方法/water_strike_ground.mph' },
      { name: '理论分析', path: '/projects/3/数学物理方法/理论分析.pdf' },
      { name: 'FEM网格划分代码', path: '/projects/3/数学物理方法/run_distmeh1.m' },
      { name: '网格生成器.pdf', path: '/projects/3/数学物理方法/简单的网格生成器.pdf' },
      { name: '结项报告', path: '/projects/3/数学物理方法/数学物理方法课程结项报告：带电液滴撞击介电基底的电流体动力学仿真与理论验证' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ④ 微电路设计 — PCB + 嵌入式语音小车
  // 资源位置: /projects/3/微电路设计/
  // ══════════════════════════════════════════════════════
  {
    id: 'microcircuit-design',
    title: '微电路设计·扫地机器人',
    subtitle: 'PCB设计 · EDA工具链 · C语言嵌入式 · WonderEcho语音模块',
    category: '电子工程 · PCB设计 · 嵌入式',
    year: '2025 秋',
    color: '#EF5350',
    accentColor: 'rgba(239,83,80,0.10)',
    tags: ['PCB', 'Altium/Eagle', 'C语言', 'STM32', '语音识别', 'Gerber'],
    description:
      '微电路设计课程的综合性实践项目。核心成果包括：(1) 扫地机器人四层PCB完整设计；(2) 一体式AI语音交互模块 WonderEcho 的软硬件协同开发(3) 多版本语音智能小车迭代；(4) USB拓展坞 PCB 设计。',
    highlights: [
      '扫地机器人4层PCB — 完整 Gerber 输出',
      'WonderEcho 语音模块',
      '语音扫地机器人 4代迭代 — robot_car → robot_car4 (Arduino/C++) 逐步升级',
      'USB拓展坞 PCB 设计 — 标准版 + 标准增强版 双方案(eprj工程)',
    ],
    images: [
      '/projects/3/微电路设计/海报.jpg',
      '/projects/3/微电路设计/视频.gif',
    ],
    documents: [
      { name: '扫地机PCB_Gerber', path: '/projects/3/微电路设计/dianjiqudong.eprj' },
      { name: '原理图.pdf', path: '/projects/3/微电路设计/原理图.pdf' },
      { name: '演示代码.zip', path: '/projects/3/微电路设计/robot_11.zip' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑤ 自动控制原理 — Buck电源调光 + 台灯控制
  // 资源位置: /projects/3/自动控制原理/
  // ══════════════════════════════════════════════════════
  {
    id: 'auto-control-theory',
    title: '自动控制原理 · Buck调光系统',
    subtitle: 'PSIM仿真 · STM32固件 · PID控制 · 禅教台灯',
    category: '控制工程 · 嵌入式控制',
    year: '2025 秋',
    color: '#AB47BC',
    accentColor: 'rgba(171,71,188,0.10)',
    tags: ['PSIM', 'PID控制', 'STM32', 'C语言', '根轨迹', '频域分析'],
    description:
      '自动控制原理课程的三大实践方向综合成果。(1) **Buck降压电源**：PSIM电路仿真（寄生电阻电容分析）+ 实际电路搭建，含完整安装教程与操作手册；(2) **直流电源自动调光控制系统**：PID控制器设计与仿真，含任务书→中期→终期全系列PPT；(3) **自动控制台灯项目**：40个3D打印件(STL) + STEP装配 + 安全光幕(step)，完整的机电一体化控制系统。',
    highlights: [
      'Buck电源 PSIM 仿真 — 寄生电阻/电容影响分析 + .psimsch 仿真文件',
      '自动调光控制 — 综合项目全系列：任务书 + 中期PPT(2份) + 终期PPT',
      '自动控制台灯 — 40个STL打印件 + STEP总装 + 光幕安全装置(.step)',
      '死亡搁浅台灯 + 禅教台灯（光随声动）',
    ],
    images: [
      '/projects/3/自动控制原理/禅教台灯.jpg',
      '/projects/3/自动控制原理/禅教台灯1.jpg',
      '/projects/3/自动控制原理/死亡搁浅.jpg',
      '/projects/3/自动控制原理/台灯渲染图.jpg',
      '/projects/3/自动控制原理/台灯渲染图1.jpg',
      '/projects/3/自动控制原理/台灯转动.gif',
      '/projects/3/自动控制原理/buck电路原理图.jpg',
    ],
    documents: [
      { name: '最终报告.docx', path: '/projects/3/自动控制原理/《自动控制原理》报告参考-2025.docx' },
    ],
  },
];

/** 大三实践项目 ID 集合 */
const YEAR_THREE_PRACTICE_IDS = new Set(['ergonomics', 'startup-flowerpot']);

/** 大三项目状态检测: 区分实践项目 / 课程项目 */
const detectYearThreeStatus = (project) => {
  if (!project?.id) return '课程项目';
  if (YEAR_THREE_PRACTICE_IDS.has(project.id)) return '实践项目';
  return '课程项目';
};

export default function YearThreeProjects() {
  return (
    <CoverFlowCarousel
      projects={PROJECTS}
      sectionId="year-three"
      badgeText="YEAR THREE"
      title="大三上学期 · 实践作品集"
      subtitle="2025 秋季 &nbsp;|&nbsp; 5个项目 · 工效学 / 大创 / 数理方法 / 微电路 / 自动控制"
      layoutIdPrefix="year-three"
      statusDetector={detectYearThreeStatus}
    />
  );
}
