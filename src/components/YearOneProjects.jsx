/**
 * YearOneProjects — 大一学年 (2024 Fall) 实践作品集
 *
 * 使用共享 CoverFlowCarousel 组件，仅保留数据定义和配置。
 * UI 逻辑、Cover Flow 动画、键盘/触摸交互均由 CoverFlowCarousel 处理。
 *
 * 数据来源: /public/projects/1/
 * 当前文件夹: 产品设计 / 2024年个性化实践答辩 / 重庆夏令营——明月湖 / 定量工程分析 /
 *            工程原理 / 物理实验 / 线性代数 / 致行科技实习 / Robocon战队 / 2023年个性化实践报告
 */

import CoverFlowCarousel from './CoverFlowCarousel';
import { asset } from '../utils/path';
import { useI18n } from '../i18n-context';
import './YearOneProjects.css';

// ═════════════════════════════════════════════════════
// 项目数据定义 — 大一学年
// ═════════════════════════════════════════════════════

const PROJECTS = [
  // ══════════════════════════════════════════════════════
  // ① 产品设计 · 泳伴科技
  // 资源位置: /projects/1/产品设计/
  // ══════════════════════════════════════════════════════
  {
    id: 'product-design',
    title: '产品设计 · 泳伴科技',
    titleEn: 'Product Design · SwimMate Tech',
    subtitle: 'SolidWorks三维建模 · 商业计划书 · 团队协作',
    subtitleEn: 'SolidWorks 3D Modeling · Business Plan · Teamwork',
    category: '产品设计 · 创新创业 · AR眼镜',
    categoryEn: 'Product Design · Innovation · AR Glasses',
    year: '2024 秋',
    yearEn: 'Fall 2024',
    color: '#FF6B35',
    accentColor: 'rgba(255,107,53,0.10)',
    tags: ['AR眼镜', '产品设计', '3D建模', '商业计划书', '团队协作'],
    tagsEn: ['AR Glasses', 'Product Design', '3D Modeling', 'Business Plan', 'Teamwork'],
    description:
      '面向游泳爱好者的智能辅助穿戴设备。完成从用户调研、需求定义、概念设计到三维建模的全流程产品开发。核心零部件包括鼻托支架、VR眼镜造型等，并撰写完整商业计划书参加创新创业比赛。',
    descriptionEn:
      'Smart wearable assistive device for swimming enthusiasts. Completed full-cycle product development from user research, requirement definition, concept design to 3D modeling. Core parts include nose-bridge brackets and VR-glasses styling, with a complete business plan written for innovation competitions.',
    highlights: [
      'SolidWorks 参数化建模：鼻托 / 眼镜 v3  / 整体装配',
      '智能穿戴AR眼镜模型 — 独立设计模块',
      '商业计划书撰写 + 多轮迭代 PPT 汇报',
      '团队协作：项目团队leader',
    ],
    highlightsEn: [
      'SolidWorks parametric modeling: nose bridge / glasses v3 / full assembly',
      'Smart wearable AR glasses model — independent design module',
      'Business plan writing + multi-round iterative PPT presentations',
      'Team collaboration: project team leader',
    ],
    images: [
      asset('/projects/1/产品设计/图片/产品.png'),
      asset('/projects/1/产品设计/图片/实物.png'),
      asset('/projects/1/产品设计/图片/背景.png'),
      asset('/projects/1/产品设计/海报.png'),
      asset('/projects/1/产品设计/模型.png'),
      asset('/projects/1/产品设计/页面1.png'),
    ],
    documents: [
      { name: '最终汇报.pptx', path: asset('/projects/1/产品设计/泳伴科技最终.pptx') },
      { name: '眼镜模型.step', path: asset('/projects/1/产品设计/眼镜 v3.step') },
      { name: '整体装配.step', path: asset('/projects/1/产品设计/整体.step') },
      { name: '渲染图.ksp', path: '/projects/1/产品设计/112.ksp' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ② 个性化实践报告
  // 资源位置: /projects/1/2023年个性化实践报告/ + /projects/1/2024年个性化实践答辩/
  // ══════════════════════════════════════════════════════
  {
    id: 'personal-practice-report',
    title: '个性化实践报告',
    titleEn: 'Personal Practice Report',
    subtitle: '明月班科创训练营 · 课程答辩与项目报告',
    subtitleEn: 'Mingyue Class Innovation Camp · Course Defense & Project Report',
    category: '综合实践',
    categoryEn: 'Comprehensive Practice',
    year: '2024 秋',
    yearEn: 'Fall 2024',
    color: '#00BFA5',
    accentColor: 'rgba(0,191,165,0.10)',
    tags: ['个人实践', '答辩汇报', '课程报告'],
    tagsEn: ['Personal Practice', 'Defense Presentation', 'Course Report'],
    description:
      '明月班个性化实践课程的大一学年完整报告集合。包括实物作品的设计过程与成果展示。',
    descriptionEn:
      'Complete freshman-year report collection for Mingyue Class personal practice course. Includes physical work design process and achievement showcase.',
    highlights: [
      '2023 级个性化实践报告 — 明月班科创训练营完整文档',
      '2024 年答辩汇报 — PPT + 逐字稿 + 整机装配模型',
      '多学科作品展示',
      '完整项目时间线与团队贡献记录',
    ],
    highlightsEn: [
      '2023 class personal practice report — complete Mingyue Innovation Camp documents',
      '2024 defense presentation — PPT + verbatim transcript + full assembly model',
      'Multi-disciplinary work showcase',
      'Complete project timeline and team contribution records',
    ],
    images: [
      asset('/projects/1/2024年个性化实践答辩/A海格力斯越野型小车 v1.png'),
      asset('/projects/1/2024年个性化实践答辩/初代 模型.png'),
      asset('/projects/1/2024年个性化实践答辩/仿生手臂整体 v1.png'),
      asset('/projects/1/2024年个性化实践答辩/仿生手臂整体 v2.png'),
      asset('/projects/1/2024年个性化实践答辩/个性化实践2.png'),
      asset('/projects/1/2024年个性化实践答辩/整车.png'),
      asset('/projects/1/2024年个性化实践答辩/时间占比.png'),
    ],
    documents: [
      { name: '答辩PPT.pptx', path: asset('/projects/1/2024年个性化实践答辩/2024个性化实践--肖楚煜.pptx') },
      { name: '答辩PDF.pdf', path: asset('/projects/1/2024年个性化实践答辩/2024个性化实践--肖楚煜.pdf') },
      { name: '整机装配.STEP', path: '/projects/1/2024年个性化实践答辩/整机装配.STEP' },
      { name: '仿生机械臂.ksp', path: '/projects/1/2024年个性化实践答辩/仿生机械臂.ksp' },
      { name: '实践报告.pdf', path: asset('/projects/1/2023年个性化实践报告/肖楚煜个性化实践报告.pdf') },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ③ 重庆夏令营 · 明月湖
  // 资源位置: /projects/1/重庆夏令营——明月湖/
  // ══════════════════════════════════════════════════════
  {
    id: 'chongqing-camp',
    title: '重庆夏令营 · 明月湖',
    subtitle: '智能养护 · 兰科智护产品设计 · 科创训练',
    category: '暑期实践 · 创新创业 · 兰花养护',
    year: '2024 夏',
    color: '#4CAF50',
    accentColor: 'rgba(76,175,80,0.10)',
    tags: ['暑期实践', '智能养护', '产品设计', 'PPT 汇报'],
    description:
      '重庆明月湖基地科创训练营暑期实践活动。围绕「兰科智护」智能兰花养护产品进行市场调研、产品设计与商业模式探索。完成竞品分析报告、Demo Day 演示文稿、个人心得体会等。',
    highlights: [
      '兰科智护 — 智能兰花养护产品完整设计方案（多版本PPT）',
      '竞品分析报告 — 市场调研与差异化定位',
      'Demo Day 演示 — 思维导图 + 路演 PPT',
      '个人心得体会 — 科创训练营学习总结',
    ],
    highlightsEn: [
      'Lanke Zhihu — Complete smart orchid care product design proposals (multiple PPT versions)',
      'Competitor analysis report — Market research and differentiated positioning',
      'Demo Day presentation — Mind map + pitch deck PPT',
      'Personal reflection — Innovation camp learning summary',
    ],
    images: [
      asset('/projects/1/重庆夏令营——明月湖/产品图.jpg'),
      asset('/projects/1/重庆夏令营——明月湖/Demo Day PPT.png'),
      asset('/projects/1/重庆夏令营——明月湖/1.png'),
    ],
    documents: [
      { name: '最终汇报.pptx', path: asset('/projects/1/重庆夏令营——明月湖/最终版本.pptx') },
      { name: '竞品分析.pptx', path: asset('/projects/1/重庆夏令营——明月湖/竞品分析.pptx') },
      { name: 'Demo Day PPT.xmind', path: '/projects/1/重庆夏令营——明月湖/Demo Day PPT.xmind' },
      { name: '推进方案.docx', path: '/projects/1/重庆夏令营——明月湖/第四组推进方案.docx' },
      { name: '心得体会.docx', path: '/projects/1/重庆夏令营——明月湖/心得体会-个人-重庆明月湖基地科创训练营-肖楚煜-17725080058.docx' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ④ 致行科技实习
  // 资源位置: /projects/1/致行科技实习/
  // ══════════════════════════════════════════════════════
  {
    id: 'zhixing-internship',
    title: '致行科技实习',
    subtitle: '参数化建模 · 产品设计 · 工业设计',
    category: '企业实习 · 工业设计',
    year: '2024 夏/秋',
    color: '#3F51B5',
    accentColor: 'rgba(63,81,181,0.10)',
    imageBg: '#ffffff',              /* logo透明底黑字，需要白背景 */
    tags: ['Fusion360', 'keyshot', '工业设计', '专利检索', '每日总结'],
    description:
      '致行科技（已获Pre-A轮融资）实习期间积累的完整工程项目资料。涵盖海格力斯越野车整车三维建模（SolidWorks + Creo 双平台）、零件库管理、logo设计、竞品分析、专利检索等全方位工业设计流程，以及每日工作总结记录。',
    highlights: [
      '海格力斯建模 — 613个 SolidWorks 零件库（.SLDPRT/.CREO/.SLDASM）',
      '汽车悬架系统 — 完整底盘与悬架设计',
      'logo设计 — 多版本设计方案（.step/.pdf/.psd/.ai）',
      '竞品分析 + 专利检索 — 市场与技术调研报告',
      '每日总结 — 16篇实习工作日志',
    ],
    images: [
      asset('/projects/1/致行科技实习/founder.png'),
      asset('/projects/1/致行科技实习/测试.png'),
      asset('/projects/1/致行科技实习/logo.png'),
      asset('/projects/1/致行科技实习/背包.png'),
      asset('/projects/1/致行科技实习/设计稿.jpg'),
    ],
    documents: [
      { name: '预路演', path: asset('/projects/1/致行科技实习/【保密】肖楚煜内部学习资料/海格力斯项目7月预演.pptx') },
      { name: '布袋设计稿', path: asset('/projects/1/致行科技实习/布袋设计/设计稿.pptx') },
      { name: '竞品分析', path: asset('/projects/1/致行科技实习/竞品分析/竞品分析（内部资料）.pptx') },
      { name: '每日总结', path: '/projects/1/致行科技实习/每日总结/' },
      { name: '优化方案', path: '/projects/1/致行科技实习/优化方案/A海格力斯越野型小车.STEP' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑤ Robocon战队
  // 资源位置: /projects/1/Robocon战队/
  // ══════════════════════════════════════════════════════
  {
    id: 'robocon-team',
    title: 'Robocon战队',
    subtitle: 'Robocon机器人大赛 · 底盘设计 · 悬架系统',
    category: '学科竞赛 · 机器人',
    year: '2024 秋',
    color: '#E91E63',
    accentColor: 'rgba(233,30,99,0.10)',
    tags: ['Robocon', 'SolidWorks', '底盘设计', '汽车悬架', '机械设计'],
    description:
      'Robocon全国大学生机器人大赛的备赛训练资料。参与机器人底盘设计与汽车悬架系统建模，掌握 SolidWorks 参数化建模与装配仿真技术。',
    highlights: [
      '底盘悬架系统 — 100个 SolidWorks 零件（.SLDPRT/.SLDASM）',
      '底盘模块 — 独立底盘设计与优化',
      '滑轨组件 — 线性滑轨机构设计',
      '机器人整体方案设计文档',
    ],
    images: [asset('/projects/1/Robocon/底盘和夹爪.png')],
    documents: [
      { name: '汽车悬架系统/', path: '/projects/1/Robocon战队/汽车悬架系统/' },
      { name: '底盘.step', path: asset('/projects/1/Robocon战队/底盘/底盘 v30.step') },
      { name: '机器人.step', path: asset('/projects/1/Robocon战队/机器人/机器人R1总装 v72.step') },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑥ 物理实验与COMSOL数值仿真
  // 资源位置: /projects/1/物理实验/
  // ══════════════════════════════════════════════════════
  {
    id: 'physics-simulation',
    title: '物理实验与COMSOL数值仿真',
    subtitle: '湍流 · 悬浮液 · 卡皮查摆',
    category: '物理实验 · 数值方法',
    year: '2024 秋',
    color: '#7C4DFF',
    accentColor: 'rgba(124,77,255,0.10)',
    tags: ['COMSOL Multiphysics', '湍流仿真', '流体力学', '负重力效应'],
    description: '振荡容器中的悬浮流体涉及流体动力学和多相流的稳定性。',
    highlights: [
      '瑞利-泰勒不稳定性 — COMSOL 二维湍流仿真',
      '磁性悬浮液 — 4组参数对比实验',
      '卡皮查摆 — 动力学振荡理论推导',
      '数理综合 — 一阶常微分方程组求解与应用',
    ],
    images: [
      asset('/projects/1/物理实验/11月12日/实验效果.gif'),
      asset('/projects/1/物理实验/11月12日/稳定装填.gif'),
      asset('/projects/1/物理实验/11月12日/深度.gif'),
      asset('/projects/1/物理实验/卡皮查摆动.gif'),
      asset('/projects/1/物理实验/仿真和试验.png'),
    ],
    documents: [
      { name: '悬浮液最终版.pptx', path: asset('/projects/1/物理实验/悬浮液最终版本3.pptx') },
      { name: 'comsol仿真.mph', path: '/projects/1/物理实验/仿真二维湍流 甘空甘.mph' },
      { name: '参考文献.pdf', path: asset('/projects/1/物理实验/floating中文.pdf') },
      { name: '卡皮查摆理论.pdf', path: asset('/projects/1/物理实验/卡皮查摆.pdf') },
      { name: '理论.pdf', path: asset('/projects/1/物理实验/理论.pdf') },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑦ 工程原理
  // 资源位置: /projects/1/工程原理/
  // ══════════════════════════════════════════════════════
  {
    id: 'engineering-principles',
    title: '工程原理',
    subtitle: '电机驱动 · PLC · 数字逻辑',
    category: '工程基础 · 电子系统 · 寻迹小车',
    year: '2024 秋',
    color: '#AB47BC',
    accentColor: 'rgba(171,71,188,0.10)',
    tags: ['电机驱动', 'stm32', 'PLC', 'Verilog/HDL', '数字逻辑'],
    description: '工程原理课程综合学习。涵盖 PWM 电机驱动、可编程逻辑器件(FPGA)、硬件描述语言 Verilog 三大模块。',
    highlights: [
      'Part III 电机驱动 —  PWM脉冲宽度调制',
      'Part VI 可编程逻辑器件 — 第11讲 FPGA / 第13讲 HDL语言',
      '工程原理项目任务书 — 综合性课程设计',
      '闭环寻迹小车',
    ],
    images: [asset('/projects/1/工程原理/video_20240519_175309.gif'),
              asset('/projects/1/工程原理/循迹.png'),
    ],
    documents: [
      { name: '死亡之桥.docx', path: '/projects/1/工程原理/死亡之桥.docx' },

    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑧ 定量工程分析 · 水翼船
  // 资源位置: /projects/1/定量工程分析/
  // ══════════════════════════════════════════════════════
  {
    id: 'engineering-analysis-ship',
    title: '定量工程分析',
    subtitle: 'CAE有限元 · 水翼船设计',
    category: 'CAE分析 · 造船工程',
    year: '2024 秋',
    color: '#FF4081',
    accentColor: 'rgba(255,64,129,0.10)',
    tags: ['有限元分析', 'STL/STEP', '结构优化', '船舶设计', 'NACA翼型'],
    description: '定量工程设计方法综合实践，聚焦造船/海洋工程。「水翼船」完整设计——NACA 翼型选型、参数化建模到结构受力分析。',
    highlights: [
      '水翼船 — 完整三维模型',
      'NACA 水翼翼型 — 流体动力学截面设计与参数化建模',
      'QEA 报告 v3.0 — 定量分析方法论总结',
      '多软件兼容：SW(.step) / CATIA(.123dx) / Inventor(.sldprt)',
    ],
    images: [asset('/projects/1/定量工程分析/船1.png'),
             asset('/projects/1/定量工程分析/船2.jpg'),    ],
    documents: [
      { name: 'QEA报告v3.docx', path: '/projects/1/定量工程分析/qea报告3.0(1).docx' },
      { name: '水翼模型v7.step', path: asset('/projects/1/定量工程分析/船.step') },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑨ 线性代数 · 人脸识别
  // 资源位置: /projects/1/线性代数/
  // ══════════════════════════════════════════════════════
  {
    id: 'linear-algebra-face',
    title: '线性代数 · 人脸识别',
    subtitle: '数字图像处理中的矩阵运算应用',
    category: '数学应用 · 图像处理',
    year: '2024 秋',
    color: '#42A5F5',
    accentColor: 'rgba(66,165,245,0.10)',
    tags: ['线性代数', 'MATLAB', '图像处理', '人脸检测', 'PCA降维'],
    description: '将线性代数核心概念应用于数字图像处理。以人脸检测为载体，理解矩阵表示、PCA降维在人脸识别中的作用。',
    highlights: [
      '图像矩阵表示 — 像素阵列与灰度变换几何意义',
      'PCA 人脸识别 — 特征值分解实现降维与特征提取',
      'MATLAB App Designer 交互式人脸检测界面',
      '配套讲义：第3/4/6/7讲 + 项目思路文档',
    ],
    images: [asset('/projects/1/线性代数/matlabapp.png'),
             asset('/projects/1/线性代数/code.png'),
    ],
    documents: [
      {name: '总项目压缩包',   path: asset('/projects/1/线性代数/人脸识别进阶版.zip')},
      {name: '照片库',   path: asset('/projects/1/线性代数/照片库.zip')},
    ],
  },

  // ══════════════════════════════════════════════════════
  // ⑩ 自然与设计 · 仿生鱼（待补充）
  // 资源位置: /projects/1/自然与设计—仿生鱼/
  // ══════════════════════════════════════════════════════
  {
    id: 'nature-design-bionic',
    title: '自然与设计·仿生鱼',
    subtitle: '仿生学 · 产品设计 · 形态仿生',
    category: '产品设计 · 仿生学',
    year: '2024 秋',
    color: '#00ACC1',
    accentColor: 'rgba(0,172,193,0.10)',
    tags: ['仿生学', '形态仿生', '产品设计'],
    description: '基于自然界生物形态的仿生设计项目。从自然中汲取灵感，将生物结构特征应用于产品造型设计。',
    highlights: [
      '仿生学研究 — 自然界生物形态分析与提取',
      '概念设计 — 从生物特征到产品形态的转化过程',
    ],
    images: [],
    documents: [],
  },
];

const YEAR_ONE_EN = {
  'chongqing-camp': {
    titleEn: 'Mingyue Lake Innovation Camp',
    subtitleEn: 'Smart Orchid Care · Product Design · Venture Training',
    categoryEn: 'Summer Practice · Innovation & Entrepreneurship',
    yearEn: 'Summer 2024',
    tagsEn: ['Summer Program', 'Smart Plant Care', 'Product Design', 'Pitch Deck'],
    descriptionEn: 'A summer innovation program at Chongqing Mingyue Lake focused on a smart orchid-care product. The work combined market research, product definition, competitive analysis, business-model exploration, and a Demo Day pitch.',
  },
  'zhixing-internship': {
    titleEn: 'Product Design Internship · Zhixing Technology',
    subtitleEn: 'Parametric Modeling · Product Design · Industrial Design',
    categoryEn: 'Industry Internship · Industrial Design',
    yearEn: 'Summer–Fall 2024',
    tagsEn: ['Fusion 360', 'KeyShot', 'Industrial Design', 'Patent Research', 'Work Logs'],
    descriptionEn: 'Engineering and industrial-design work completed at Zhixing Technology, a Pre-A-funded mobility startup. Responsibilities covered full-vehicle CAD for the Hercules off-road platform, part-library management, visual identity, competitor and patent research, and structured daily documentation.',
    highlightsEn: [
      'Hercules vehicle model supported by a 613-part SolidWorks and Creo library',
      'Complete chassis and automotive-suspension modeling',
      'Multiple logo and product-identity concepts across STEP, PDF, PSD, and AI formats',
      'Competitive landscape and patent research combining market and technical analysis',
      'Sixteen structured internship work logs documenting decisions and progress',
    ],
  },
  'robocon-team': {
    titleEn: 'Robocon Team',
    subtitleEn: 'Robot Chassis · Suspension System · Competition Preparation',
    categoryEn: 'Robotics Competition · Mechanical Design',
    yearEn: 'Fall 2024',
    tagsEn: ['Robocon', 'SolidWorks', 'Chassis Design', 'Suspension', 'Mechanical Design'],
    descriptionEn: 'Mechanical-design training for the national Robocon competition. My work focused on robot chassis architecture and suspension modeling, strengthening parametric CAD, assembly design, and system-integration skills.',
    highlightsEn: [
      'Chassis and suspension system comprising roughly 100 SolidWorks parts and assemblies',
      'Independent chassis-module design and iterative optimization',
      'Linear-rail mechanism design for guided motion',
      'System-level robot concept and design documentation',
    ],
  },
  'physics-simulation': {
    titleEn: 'Physics Experiments & COMSOL Simulation',
    subtitleEn: 'Turbulence · Suspensions · Kapitza Pendulum',
    categoryEn: 'Experimental Physics · Numerical Methods',
    yearEn: 'Fall 2024',
    tagsEn: ['COMSOL Multiphysics', 'Turbulence', 'Fluid Mechanics', 'Effective Negative Gravity'],
    descriptionEn: 'Experimental and numerical studies of stability in oscillating multiphase systems, combining fluid mechanics, suspension behavior, and nonlinear dynamics.',
    highlightsEn: [
      'Two-dimensional COMSOL simulation of Rayleigh–Taylor instability',
      'Four comparative parameter studies of magnetic suspensions',
      'Theoretical derivation and experiment for the Kapitza pendulum',
      'Solution and application of first-order ordinary differential-equation systems',
    ],
  },
  'engineering-principles': {
    titleEn: 'Engineering Principles',
    subtitleEn: 'Motor Drive · PLC · Digital Logic',
    categoryEn: 'Engineering Fundamentals · Electronic Systems',
    yearEn: 'Fall 2024',
    tagsEn: ['Motor Drive', 'STM32', 'PLC', 'Verilog/HDL', 'Digital Logic'],
    descriptionEn: 'Integrated engineering coursework spanning PWM motor drives, programmable logic devices, FPGA fundamentals, and Verilog hardware-description methods.',
    highlightsEn: [
      'PWM motor-drive design and pulse-width modulation experiments',
      'Programmable logic studies covering FPGA architecture and HDL development',
      'Integrated engineering design assignment and technical documentation',
      'Closed-loop line-following vehicle prototype',
    ],
  },
  'engineering-analysis-ship': {
    titleEn: 'Quantitative Engineering Analysis',
    subtitleEn: 'CAE · Hydrofoil Design · Structural Analysis',
    categoryEn: 'CAE · Marine Engineering',
    yearEn: 'Fall 2024',
    tagsEn: ['Finite-Element Analysis', 'STL/STEP', 'Structural Optimization', 'Marine Design', 'NACA Hydrofoil'],
    descriptionEn: 'A quantitative engineering-design study centered on a hydrofoil craft, progressing from NACA profile selection and parametric CAD to structural-load analysis and cross-platform model delivery.',
    highlightsEn: [
      'Complete three-dimensional hydrofoil craft model',
      'Parameterized NACA hydrofoil profile for hydrodynamic design',
      'QEA report v3.0 summarizing the quantitative-analysis workflow',
      'Interoperable models for SolidWorks, CATIA, and Inventor',
    ],
  },
  'linear-algebra-face': {
    titleEn: 'Linear Algebra · Face Recognition',
    subtitleEn: 'Matrix Methods for Digital Image Processing',
    categoryEn: 'Applied Mathematics · Image Processing',
    yearEn: 'Fall 2024',
    tagsEn: ['Linear Algebra', 'MATLAB', 'Image Processing', 'Face Detection', 'PCA'],
    descriptionEn: 'An applied linear-algebra project using face recognition to connect matrix representation, eigenvalue decomposition, and PCA dimensionality reduction with digital-image processing.',
    highlightsEn: [
      'Pixel-matrix representation and the geometry of grayscale transformations',
      'PCA face recognition using eigendecomposition for dimensionality reduction',
      'Interactive face-detection interface built with MATLAB App Designer',
      'Supporting lecture notes and a documented implementation plan',
    ],
  },
  'nature-design-bionic': {
    titleEn: 'Biomimetic Fish Design',
    subtitleEn: 'Biomimetics · Product Design · Form Exploration',
    categoryEn: 'Product Design · Biomimetics',
    yearEn: 'Fall 2024',
    tagsEn: ['Biomimetics', 'Form Study', 'Product Design'],
    descriptionEn: 'A biomimetic design study translating biological structures and natural forms into product-shape concepts.',
    highlightsEn: [
      'Analysis and abstraction of biological forms found in nature',
      'Concept-development process translating natural features into product geometry',
    ],
  },
};

const LOCALIZED_PROJECTS = PROJECTS.map(project => ({
  ...project,
  ...YEAR_ONE_EN[project.id],
}));

/**
 * 判断大一项目的类型标签
 */
const detectYearOneStatus = (project) => {
  if (!project?.id) return 'status.coursework';
  const practiceIds = ['product-design', 'personal-practice-report', 'chongqing-camp', 'zhixing-internship', 'robocon-team'];
  if (practiceIds.includes(project.id)) return 'status.practice';
  return 'status.coursework';
};

export default function YearOneProjects() {
  const { t } = useI18n();
  return (
    <CoverFlowCarousel
      projects={LOCALIZED_PROJECTS}
      sectionId="year-one"
      badgeText={t('yearone.badge-text')}
      title={t('yearone.title')}
      subtitle={t('yearone.subtitle')}
      layoutIdPrefix="year-one"
      statusDetector={detectYearOneStatus}
    />
  );
}
