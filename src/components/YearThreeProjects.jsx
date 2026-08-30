/**
 * YearThreeProjects — 大三上学期 (2025 Fall) 实践作品集
 *
 * 使用共享 CoverFlowCarousel 组件，仅保留数据定义和配置。
 * UI 逻辑、Cover Flow 动画、键盘/触摸交互均由 CoverFlowCarousel 处理。
 * 样式复用 YearOneProjects.css (三个学年共享同一套 Cover Flow CSS)
 *
 * 数据来源: /public/projects/3/
 * 当前文件夹: 工效学 / 大创 / 数学物理方法 / 微电路设计 / 自动控制原理 / lerobot / 3D人体网格应变分析
 */

import CoverFlowCarousel from './CoverFlowCarousel';
import { asset } from '../utils/path';
import { useI18n } from '../i18n-context';
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
    title: '智慧课堂·课堂 AI 录音盒',
    titleEn: 'Smart Classroom AI Voice Recorder',
    subtitle: '工效学 · jack 人因设计 · AI 语音',
    subtitleEn: 'Ergonomics · Jack Human Factors Design · AI Voice',
    category: '人机交互 · 工效学设计',
    categoryEn: 'HCI · Ergonomics Design',
    year: '2025 秋',
    yearEn: 'Fall 2025',
    color: '#00B8D4',
    accentColor: 'rgba(0,184,212,0.10)',
    tags: ['jack', 'C#', 'ClearerVoice', 'EyeGestures', '3D 建模', 'STEP'],
    tagsEn: ['Jack', 'C#', 'ClearerVoice', 'EyeGestures', '3D Modeling', 'STEP'],
    description:
      '面向智慧课堂场景的多模态交互硬件与软件综合系统。基于工效学理论进行用户研究、产品迭代设计与交互验证。包含两代完整产品外观设计（STL/STEP/KSP）、基于 jack 开发的人因分析、AI 语音处理模块（ClearerVoice 去噪/变声）。',
    descriptionEn:
      'Multi-modal interaction hardware and software system for smart classroom scenarios. Based on ergonomics theory for user research, product iteration design and interaction verification.',
    highlights: [
      '第一代 + 第二代产品外观设计',
      'jack 智慧课堂交互界面 — 完整 Web 端 UI 项目',
      'AI 语音处理 — ClearerVoice Studio：实时去噪、变声、语音增强',
      'Jack 人因工程软件仿真 — 教室环境人体工程学分析与优化',
    ],
    highlightsEn: [
      'Gen1 + Gen2 product appearance design',
      'Jack smart classroom interaction interface — Complete web UI project',
      'AI voice processing — ClearerVoice Studio: Real-time denoising, voice changing, speech enhancement',
      'Jack human factors software simulation — Classroom environment ergonomic analysis and optimization',
    ],
    images: [
      asset('/projects/3/工效学/工效学产品.jpg'),
      asset('/projects/3/工效学/网页UI界面.jpg'),
      asset('/projects/3/工效学/渲染教室.png'),
      asset('/projects/3/工效学/jack教室.png'),
    ],
    documents: [
      { name: '课程作业.pdf', path: asset('/projects/3/工效学/工效学课程作业-智慧课堂互动硬件设计与多模态交互研究.pdf') },
      { name: '场景文件', path: asset('/projects/3/工效学/Classroom.blend') },
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
      '国家级大学生创新创业训练计划优秀结项项目——「兰精灵」智能养护花盆。专为家庭园艺爱好者打造的智能化植物养护花盆，集成自动浇灌、光照监测、温湿度调控等多传感器融合系统。',
    highlights: [
      '兰精灵 v1.2 三维模型 (.step) — 含风扇外壳等核心部件的参数化建模',
      '两版实物原型 (flower1 / flower2) — 从概念验证到功能完善的迭代过程',
      '大创结项全套材料 — 结项报告(.docx/.pdf) + 汇报PPT',
      '创新创业答辩报告 — 项目背景/技术路线/商业模式/财务预算完整文档链',
      '申报书 — 国家立项资质官方认证文件',
    ],
    images: [
      asset('/projects/3/大创/实物照片.jpg'),
      asset('/projects/3/大创/实物照片1.jpg'),
      asset('/projects/3/大创/产品.png'),
      asset('/projects/3/大创/兰科智护.png'),
    ],
    documents: [
      { name: '结项汇报.pptx', path: asset('/projects/3/大创/大创结项汇报.pptx') },
      { name: '兰精灵申报书', path: '/projects/3/大创/兰精灵申报书.docx' },
      { name: '风扇外壳.step', path: asset('/projects/3/大创/风扇外壳.step') },
      { name: '项目PPT.pptx', path: asset('/projects/3/大创/兰精灵——智能养护花盆.pptx') },
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
      asset('/projects/3/数学物理方法/急速下落.gif'),
      asset('/projects/3/数学物理方法/带电下坠.gif'),
      asset('/projects/3/数学物理方法/不带电下坠.gif'),
    ],
    documents: [
      { name: '中期汇报.pptx', path: asset('/projects/3/数学物理方法/12组——电荷抑制飞溅——中期汇报.pptx') },
      { name: '期末汇报.pptx', path: asset('/projects/3/数学物理方法/电荷抑制飞溅——期末汇报.pptx') },
      { name: '仿真主文件.mph', path: '/projects/3/数学物理方法/water_strike_ground.mph' },
      { name: '理论分析', path: asset('/projects/3/数学物理方法/理论分析.pdf') },
      { name: 'FEM网格划分代码', path: '/projects/3/数学物理方法/run_distmeh1.m' },
      { name: '网格生成器.pdf', path: asset('/projects/3/数学物理方法/简单的网格生成器.pdf') },
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
      asset('/projects/3/微电路设计/海报.jpg'),
    ],
    documents: [
      { name: '扫地机PCB_Gerber', path: '/projects/3/微电路设计/dianjiqudong.eprj' },
      { name: '原理图.pdf', path: asset('/projects/3/微电路设计/原理图.pdf') },
      { name: '演示代码.zip', path: asset('/projects/3/微电路设计/robot_11.zip') },
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
      asset('/projects/3/自动控制原理/禅教台灯.jpg'),
      asset('/projects/3/自动控制原理/禅教台灯1.jpg'),
      asset('/projects/3/自动控制原理/死亡搁浅.jpg'),
      asset('/projects/3/自动控制原理/台灯转动.gif'),
    ],
    documents: [
      { name: '最终报告.docx', path: '/projects/3/自动控制原理/《自动控制原理》报告参考-2025.docx' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑥ 数值分析 — 工程数值分析
  // 资源位置: /projects/3/数值分析/
  // ══════════════════════════════════════════════════════
  {
    id: 'numerical-analysis',
    title: '数值分析 · 工程数值计算',
    subtitle: '数值方法 · MATLAB编程 · 误差分析',
    category: '计算数学 · 数值方法',
    year: '2026 春',
    color: '#42A5F5',
    accentColor: 'rgba(66,165,245,0.10)',
    tags: ['MATLAB', '数值积分', '插值逼近', 'ODE求解', '误差分析'],
    description:
      '数值分析课程的综合实践。涵盖数值插值与逼近、数值积分与微分、常微分方程数值解法、线性方程组迭代解法等核心内容，通过 MATLAB 编程实现各类数值算法并进行工程问题分析。',
    highlights: [
      '数值插值与逼近 — Lagrange / Newton / 样条插值算法实现',
      '数值积分方法 — 梯形法则、Simpson 法则、Gauss 求积',
      'ODE 数值解法 — Euler、Runge-Kutta 方法及稳定性分析',
      '课程汇报 — 完整中期与期末汇报材料',
    ],
    images: [
      asset('/projects/3/数值分析/poster-3.jpg'),
    ],
    documents: [
      { name: '第三次汇报.pdf', nameEn: 'Numerical Analysis Presentation.pdf', path: asset('/projects/3/数值分析/工程数值分析第三次汇报.pdf') },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑦ 产品制造 — 产品制造工艺
  // 资源位置: /projects/3/产品制造/
  // ══════════════════════════════════════════════════════
  {
    id: 'product-manufacturing',
    title: '产品制造 · 工艺与制造',
    subtitle: '制造工艺 · 产品设计 · 工程制图',
    category: '制造工艺 · 产品设计',
    year: '2026 春',
    color: '#26A69A',
    accentColor: 'rgba(38,166,154,0.10)',
    tags: ['SolidWorks', '制造工艺', 'CAD/CAM', '产品设计', '工程制图'],
    description:
      '产品制造课程的综合实践。涵盖产品结构设计、制造工艺规划、CAD/CAM 建模与加工仿真等内容，通过实际产品项目完成从概念设计到制造验证的完整流程。',
    highlights: [
      '产品结构设计 — 三维建模与装配设计',
      '制造工艺规划 — 工艺路线设计与优化',
      'CAD/CAM 应用 — 数控加工编程与仿真',
      '结项报告 — 完整设计制造文档链',
    ],
    images: [
      asset('/projects/3/产品制造/product-image.png'),
      asset('/projects/3/产品制造/product-image-1.png'),
      asset('/projects/3/产品制造/product-image-2.png'),
    ],
    documents: [
      { name: '结项报告.docx', nameEn: 'Final Manufacturing Report.docx', path: '/projects/3/产品制造/final-report.docx' },
    ],
  },
  // ══════════════════════════════════════════════════
  // ⑧ LeRobot — 牙科种植机器人操作演示（大三下 · 精选）
  // 资源位置: /projects/3/dental-lerobot/
  // ══════════════════════════════════════════════════
  {
    id: 'lerobot',
    title: 'LeRobot · 牙科种植机器人',
    subtitle: 'ARUCO视觉定位 · ACT模仿学习 · 强化学习泛化',
    category: '具身智能 · 医疗机器人',
    year: '2026 春',
    color: '#FF7043',
    accentColor: 'rgba(255,112,67,0.10)',
    tags: ['ARUCO定位', 'ACT控制', '强化学习', '牙科机器人', '种植手术'],
    description:
      '基于 HuggingFace LeRobot 框架的牙科种植机器人操作演示系统。机械臂为 6 自由度构型：底座旋转、肩部俯仰、肘部俯仰、腕部俯仰、腕部旋转 5 个关节 + 1 个平行夹爪，总线舵机驱动。通过 ARUCO 码视觉定位确定最下方舵机（底座关节）的空间位姿，结合 ACT（Action Chunking Transformer）模仿学习与强化学习（RL）实现泛化的种植操作动作。',
    highlights: [
      '6-DOF 机械臂 — 底座旋转/肩俯仰/肘俯仰/腕俯仰/腕旋转 5 关节 + 平行夹爪，主从臂遥操作采集示教数据',
      '系统构成 — 主从双臂 + RGB 相机（顶视/腕部）+ ARUCO 标定码 + 种植操作台，LeRobot 数据管线统一采集回放',
      'ARUCO 定位 — 相机检测 ARUCO 码解算最下方舵机（底座）位姿，完成相机-机械臂坐标系标定与目标对齐',
      'ACT + RL 控制流程 — ACT 从示教数据学习动作分块策略，RL 微调提升鲁棒性，实现不同位姿下泛化的种植动作',
    ],
    images: [
      asset('/projects/3/dental-lerobot/lerobot.png'),
      asset('/projects/3/dental-lerobot/遥操.gif'),
      asset('/projects/3/dental-lerobot/dataset_overview.png'),
      asset('/projects/3/dental-lerobot/joint_trajectories.png'),
      asset('/projects/3/dental-lerobot/smoothing_comparison_episode5.png'),
      asset('/projects/3/dental-lerobot/smoothing_summary.png'),
      asset('/projects/3/dental-lerobot/task_keyframes.png'),
    ],
    // 图片过于竖长（W/H≈0.75）：模糊衬底方案下旋转 90° 更好地填充横向卡片
    imageRotate: 90,
    documents: [],
  },

  // ══════════════════════════════════════════════════
  // ⑨ 3D 人体网格应变分析（大三 · 生物力学/工效学）
  // 资源位置: /projects/3/3D人体网格应变分析/
  // ══════════════════════════════════════════════════
  {
    id: 'body-mesh-strain',
    title: '3D 人体网格应变分析',
    subtitle: 'Trimesh 应变计算 · Blender 热力图可视化 · 生物力学',
    category: '计算几何 · 生物力学仿真',
    year: '2026 春',
    color: '#26C6DA',
    accentColor: 'rgba(38,198,218,0.10)',
    tags: ['Blender', 'Trimesh', 'Python', '应变分析', '热力图可视化'],
    description:
      '基于 Python (Trimesh / NumPy) 与 Blender 的三维人体网格形变分析工具链。对比基础姿态（A-Pose 下垂）与目标姿态（抬手形变）两个人体网格，逐三角面计算面积应变、形状畸变（剪切）与边长应变三类力学指标，并在 Blender 中生成红-绿-蓝顶点色热力图，直观呈现皮肤在运动中被拉伸、挤压与扭曲的区域，可服务于服装剪裁与人因工程设计。',
    highlights: [
      'ROI 区域提取 — Blender 编辑模式框选研究区域（如手臂 + 肩部），脚本导出面 ID 列表',
      '三大力学指标 — 面积应变 / 形状畸变（剪切应变）/ 边长应变，逐三角面计算并导出 CSV',
      '热力图可视化 — Blender 顶点色渲染，红=拉伸膨胀、蓝=挤压收缩、绿=无变化，一键切换三种指标',
      '工程应用 — 定位腋窝、肩峰等高应变区域，指导服装剪裁与人体工程设计',
    ],
    images: [
      asset('/projects/3/3D人体网格应变分析/应力分析结果.png'),
      asset('/projects/3/3D人体网格应变分析/model.png'),
      asset('/projects/3/3D人体网格应变分析/选取对比区域.png'),
      asset('/projects/3/3D人体网格应变分析/应力分析.png'),
    ],
    documents: [],
  },

  // ══════════════════════════════════════════════════
  // ⑩ DIY 无刷直流电机（BLDC）— 大三夏 · 精选
  // 资源位置: /projects/3/bldc-motor/
  // GitHub: https://github.com/lithos666/diy_Brushless-DC-Motor
  // ══════════════════════════════════════════════════
  {
    id: 'bldc-motor',
    title: 'DIY 无刷直流电机（BLDC）',
    subtitle: '12槽16极 · 3D打印空芯定子 · 星形接法 · ESP32驱动',
    category: '电机设计 · 3D打印 · 嵌入式控制',
    year: '2026 夏',
    color: '#FFC107',
    accentColor: 'rgba(255,193,7,0.10)',
    tags: ['BLDC', '3D打印', 'ESP32-S3', '电调驱动', '无感换向'],
    description:
      '基于 3D 打印结构的自制三相无刷直流电机：12 槽 16 极（q=0.5 分数槽）、空芯定子、星形接法，由无感航模电调 + ESP32-S3 驱动。完整复刻自开源方案，完成从建模、打印、绕线到电控联调的全过程，实测 KV 约 1000–1200。目前正在进行下一轮高速电机迭代。',
    highlights: [
      '12 槽 16 极构型 — 分数槽 q=0.5，空芯线圈无铁芯，无齿槽转矩',
      '3D 打印定子骨架 — Stator / Stator Base / Rotor / Base Ring 四件套（STL）',
      '全齿集中绕星形接法 — 每齿 17 匝，三相星形 Y 连接，A-B-C 顺序分配',
      'ESP32-S3 + 电调驱动 — 50Hz PWM 油门信号，好盈 Skywalker 40A 电调，2S 锂电供电',
    ],
    images: [
      asset('/projects/3/bldc-motor/videos/运行视频.gif'),
      asset('/projects/3/bldc-motor/images/绕线方式.PNG'),
      asset('/projects/3/bldc-motor/images/磁铁物料-1.JPEG'),
      asset('/projects/3/bldc-motor/images/磁铁物料-2.JPEG'),
    ],
    documents: [
      { name: '运行视频.mp4', nameEn: 'Motor Demo & Repository', path: 'https://github.com/lithos666/diy_Brushless-DC-Motor' },
      { name: '电机设计-工程应用指南.md', nameEn: 'Motor Engineering Guide.md', path: asset('/projects/3/bldc-motor/docs/电机设计-工程应用指南.md') },
      { name: 'Stator-Body.stl', nameEn: 'Stator-Body.stl', path: asset('/projects/3/bldc-motor/models/Stator-Body.stl') },
      { name: 'Rotor-Body.stl', nameEn: 'Rotor-Body.stl', path: asset('/projects/3/bldc-motor/models/Rotor-Body.stl') },
      { name: 'Stator Base-Body.stl', nameEn: 'Stator Base-Body.stl', path: asset('/projects/3/bldc-motor/models/Stator Base-Body.stl') },
      { name: 'Base Ring-Body.stl', nameEn: 'Base Ring-Body.stl', path: asset('/projects/3/bldc-motor/models/Base Ring-Body.stl') },
    ],
  },
];

const YEAR_THREE_EN = {
  'startup-flowerpot': {
    titleEn: 'Lan Spirit Smart Planter',
    subtitleEn: 'National Innovation Program · IoT · Embedded Systems',
    categoryEn: 'Product Innovation · IoT · Embedded Systems',
    yearEn: 'Fall 2025',
    tagsEn: ['SolidWorks', 'Arduino', 'IoT', 'Venture Design', 'Prototype Validation'],
    descriptionEn: 'An award-winning national student innovation project for an intelligent home-gardening planter. The system combines automatic irrigation, light monitoring, temperature and humidity regulation, and multi-sensor feedback in an iterated physical product.',
    highlightsEn: [
      'Lan Spirit v1.2 STEP model with parametric fan housing and core structural components',
      'Two physical prototype generations progressing from proof of concept to functional validation',
      'Complete close-out package with final report and presentation deck',
      'Venture-defense materials covering user needs, technical architecture, business model, and budget',
      'Official documentation for the nationally funded student innovation program',
    ],
  },
  'math-physics-method': {
    titleEn: 'Charged-Droplet Splash Suppression',
    subtitleEn: 'Partial Differential Equations · COMSOL · FEM Meshing',
    categoryEn: 'Applied Mathematics · Computational Physics',
    yearEn: 'Fall 2025',
    tagsEn: ['COMSOL Multiphysics', 'MATLAB', 'Partial Differential Equations', 'FEM Mesh', 'Fluid Mechanics'],
    descriptionEn: 'A computational study applying partial-differential-equation methods to splash suppression in electrically charged droplets. The workflow combines COMSOL multiphysics simulation with a customized MATLAB distmesh preprocessor and literature-based theoretical analysis.',
    highlightsEn: [
      'Three COMSOL water-impact simulations comparing different physical parameters',
      'Customized MATLAB FEM mesh generator based on distmesh, with a Python companion tool',
      'Theoretical derivation and numerical validation of charge-induced splash suppression',
      'Complete midterm and final technical presentations',
    ],
  },
  'microcircuit-design': {
    titleEn: 'Voice-Controlled Cleaning Robot',
    subtitleEn: 'Four-Layer PCB · Embedded C · WonderEcho Voice Module',
    categoryEn: 'Electronics · PCB Design · Embedded Systems',
    yearEn: 'Fall 2025',
    tagsEn: ['PCB', 'Altium/Eagle', 'Embedded C', 'STM32', 'Voice Recognition', 'Gerber'],
    descriptionEn: 'An integrated electronics project combining a four-layer cleaning-robot PCB, the WonderEcho AI voice-interaction module, four generations of voice-controlled mobile robots, and two USB-hub PCB variants.',
    highlightsEn: [
      'Complete four-layer cleaning-robot PCB with manufacturing-ready Gerber output',
      'Hardware–software co-development of the WonderEcho voice module',
      'Four iterative robot generations developed in Arduino and C++',
      'Standard and enhanced USB-hub PCB designs delivered as editable projects',
    ],
  },
  'auto-control-theory': {
    titleEn: 'Buck-Converter Dimming Control',
    subtitleEn: 'PSIM · STM32 Firmware · PID Control · Mechatronic Lamp',
    categoryEn: 'Control Engineering · Embedded Control',
    yearEn: 'Fall 2025',
    tagsEn: ['PSIM', 'PID Control', 'STM32', 'Embedded C', 'Root Locus', 'Frequency Response'],
    descriptionEn: 'A control-engineering portfolio integrating three systems: a PSIM-validated buck converter, a PID-based automatic dimming controller, and a mechatronic desk lamp assembled from 40 printed parts with an optical safety curtain.',
    highlightsEn: [
      'PSIM study of buck-converter behavior under parasitic resistance and capacitance',
      'Complete automatic-dimming project trail from brief and midterm review to final presentation',
      'Mechatronic lamp comprising 40 printable parts, a STEP assembly, and an optical safety device',
      'Two expressive lamp concepts exploring motion and sound-responsive lighting',
    ],
  },
  'numerical-analysis': {
    titleEn: 'Engineering Numerical Methods',
    subtitleEn: 'Numerical Algorithms · MATLAB · Error Analysis',
    categoryEn: 'Computational Mathematics · Numerical Methods',
    yearEn: 'Spring 2026',
    tagsEn: ['MATLAB', 'Numerical Integration', 'Interpolation', 'ODE Solvers', 'Error Analysis'],
    descriptionEn: 'Applied numerical-analysis coursework implemented in MATLAB, covering interpolation and approximation, numerical differentiation and integration, ordinary differential equations, iterative linear solvers, and engineering error analysis.',
    highlightsEn: [
      'Lagrange, Newton, and spline interpolation implementations',
      'Trapezoidal, Simpson, and Gaussian quadrature methods',
      'Euler and Runge–Kutta ODE solvers with stability analysis',
      'Complete midterm and final technical presentations',
    ],
  },
  'product-manufacturing': {
    titleEn: 'Product Manufacturing & Process Planning',
    subtitleEn: 'Manufacturing Processes · CAD/CAM · Engineering Drawings',
    categoryEn: 'Manufacturing Engineering · Product Design',
    yearEn: 'Spring 2026',
    tagsEn: ['SolidWorks', 'Process Planning', 'CAD/CAM', 'Product Design', 'Engineering Drawings'],
    descriptionEn: 'An end-to-end manufacturing project covering structural product design, process planning, CAD/CAM modeling, machining simulation, and design-for-manufacture validation.',
    highlightsEn: [
      'Three-dimensional product architecture and assembly design',
      'Manufacturing-route planning and process optimization',
      'CNC programming and machining simulation through a CAD/CAM workflow',
      'Complete design-and-manufacturing documentation package',
    ],
  },
  lerobot: {
    titleEn: 'LeRobot Dental Implantation Robot',
    subtitleEn: 'ArUco Localization · ACT Imitation Learning · Policy Generalization',
    categoryEn: 'Embodied AI · Medical Robotics',
    yearEn: 'Spring 2026',
    tagsEn: ['ArUco Localization', 'ACT', 'Imitation Learning', 'Dental Robotics', 'Teleoperation'],
    descriptionEn: 'A dental implantation manipulation demonstrator built on Hugging Face LeRobot. A six-degree-of-freedom arm combines master–slave teleoperation, RGB vision, ArUco-based base-pose calibration, and ACT policy learning to reproduce implantation motions across varied poses.',
    highlightsEn: [
      'Six-DOF arm with five rotary joints and a parallel gripper, teleoperated for demonstration collection',
      'Unified LeRobot pipeline for dual-arm state, top-view and wrist-camera video, and synchronized replay',
      'ArUco-based camera-to-robot calibration and target alignment using the base-joint pose',
      'ACT action-chunking policy with reinforcement-learning exploration for improved robustness',
    ],
  },
  'body-mesh-strain': {
    titleEn: '3D Human-Mesh Strain Analysis',
    subtitleEn: 'Trimesh Mechanics · Blender Heatmaps · Biomechanics',
    categoryEn: 'Computational Geometry · Biomechanical Simulation',
    yearEn: 'Spring 2026',
    tagsEn: ['Blender', 'Trimesh', 'Python', 'Strain Analysis', 'Heatmap Visualization'],
    descriptionEn: 'A Python and Blender workflow for comparing human-body meshes across poses. It calculates per-face area strain, shear-like shape distortion, and edge-length strain, then renders vertex-color heatmaps to expose regions of stretch, compression, and distortion for apparel and ergonomic design.',
    highlightsEn: [
      'Region-of-interest selection in Blender with scripted face-ID export',
      'Per-triangle calculation of area, shape-distortion, and edge-length strain exported to CSV',
      'Red–green–blue vertex-color heatmaps with one-click switching between metrics',
      'Engineering interpretation of high-strain regions around the shoulder and underarm',
    ],
  },
  'bldc-motor': {
    titleEn: 'DIY Brushless DC Motor (BLDC)',
    subtitleEn: '12-Slot / 16-Pole · 3D-Printed Air-Core Stator · ESP32 Drive',
    categoryEn: 'Motor Design · Additive Manufacturing · Embedded Control',
    yearEn: 'Summer 2026',
    tagsEn: ['BLDC', '3D Printing', 'ESP32-S3', 'ESC Drive', 'Sensorless Commutation'],
    descriptionEn: 'A self-built three-phase BLDC motor with a 12-slot, 16-pole fractional-slot air-core topology. The project covered CAD, printing, winding, star connection, and ESP32-S3/ESC commissioning, reaching a measured KV of approximately 1,000–1,200 before the next high-speed iteration.',
    highlightsEn: [
      '12-slot / 16-pole fractional-slot topology with air-core coils and no cogging torque',
      'Four-piece printable motor structure: stator, stator base, rotor, and base ring',
      'Concentrated winding with 17 turns per tooth and a three-phase star connection',
      'ESP32-S3 generating a 50 Hz throttle PWM for a 40 A sensorless ESC on a 2S supply',
    ],
  },
};

const LOCALIZED_PROJECTS = PROJECTS.map(project => ({
  ...project,
  ...YEAR_THREE_EN[project.id],
}));

/** 大三实践项目 ID 集合 */
const YEAR_THREE_PRACTICE_IDS = new Set(['ergonomics', 'startup-flowerpot', 'lerobot', 'bldc-motor']);

/** 大三项目状态检测: 区分实践项目 / 课程项目 */
const detectYearThreeStatus = (project) => {
  if (!project?.id) return 'status.coursework';
  if (YEAR_THREE_PRACTICE_IDS.has(project.id)) return 'status.practice';
  return 'status.coursework';
};

export default function YearThreeProjects() {
  const { t } = useI18n();
  return (
    <CoverFlowCarousel
      projects={LOCALIZED_PROJECTS}
      sectionId="year-three"
      badgeText={t('yearthree.badge-text')}
      title={t('yearthree.title')}
      subtitle={t('yearthree.subtitle')}
      layoutIdPrefix="year-three"
      statusDetector={detectYearThreeStatus}
    />
  );
}
