import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useI18n } from '../i18n-context';
import BorderGlow from './ui/BorderGlow';
import ProjectDetailModal from './ProjectDetailModal';
import { asset } from '../utils/path';
import './WorksSection.css';

const text = (zh, en) => ({ zh, en });

const CAPABILITY_PATH = [
  text('机械设计', 'Mechanical Design'),
  text('仿真分析', 'Simulation & Analysis'),
  text('嵌入式与控制', 'Embedded & Control'),
  text('机器人', 'Robotics'),
  text('医疗器械', 'Medical Devices'),
  text('Goodent', 'Goodent'),
];

function localize(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
}

function getProjects(lang) {
  return [
    {
      id: 'goodent',
      title: localize(text('Goodent 牙科微动力系统', 'Goodent Dental Power System'), lang),
      category: localize(text('医疗器械 · 电机控制 · 创业', 'Medical Devices · Motor Control · Venture'), lang),
      year: localize(text('2026–至今', '2026–Present'), lang),
      status: localize(text('50 万元种子轮', 'RMB 500k Seed'), lang),
      color: '#32D8FF',
      accentColor: 'rgba(50,216,255,0.14)',
      description: localize(text(
        '作为联合创始人负责产品定义、系统架构与电机控制，三代原型把异常负载识别推进为可测试的工程系统。',
        'As co-founder, I lead product definition, system architecture and motor control, advancing abnormal-load detection through three testable prototype generations.'
      ), lang),
      tags: ['STM32', 'BLDC / PMSM', 'Torque Estimation', 'Medical Devices'],
      images: [asset('/projects/3/Goodent/第三代样机.jpg')],
      caseStudy: {
        problem: text(
          '现有牙科动力系统主要提供稳定动力，医生仍高度依赖手感识别钻穿、卡针与异常负载，反馈不够结构化。',
          'Existing dental power systems mainly provide stable motion, while clinicians still rely heavily on tactile feel to identify penetration, tool jamming and abnormal loads.'
        ),
        role: {
          zh: ['联合创始人', '产品定义', '系统架构', '电机控制'],
          en: ['Co-founder', 'Product Definition', 'System Architecture', 'Motor Control'],
        },
        approach: {
          summary: text(
            '围绕 BLDC / PMSM 驱动、电流采样、扭矩估算、故障响应、冷却与灌溉集成构建系统架构，并通过 V1 → V2 → V3 原型持续收敛结构与控制方案。',
            'Built the system architecture around BLDC / PMSM drive, current sensing, torque estimation, fault response, cooling and irrigation integration, iterating the mechanical and control design through V1 → V2 → V3 prototypes.'
          ),
          technologies: ['BLDC / PMSM', 'Current Sensing', 'Torque Estimation', 'STM32', 'Cooling', 'Irrigation'],
        },
        prototype: {
          zh: ['V1：功能与驱动链路验证', 'V2：结构、散热与控制迭代', 'V3：系统集成与工程验证样机'],
          en: ['V1: functional drive-chain proof', 'V2: mechanical, thermal and control iteration', 'V3: integrated engineering-validation prototype'],
        },
        validation: {
          zh: ['扭矩与负载响应测试', '转速稳定性测试', '连续运行温升测试', '异常负载与停机逻辑验证'],
          en: ['Torque and load-response testing', 'Speed stability testing', 'Continuous-run thermal testing', 'Abnormal-load and shutdown-logic verification'],
        },
        result: {
          zh: ['完成三代系统原型迭代', '获得 50 万元种子轮投资', '进入工程验证与医疗器械合规准备阶段'],
          en: ['Completed three prototype iterations', 'Secured RMB 500k in seed funding', 'Advanced into engineering validation and medical-device regulatory preparation'],
        },
        currentStage: text('原型迭代 / EVT 准备 / 医疗器械合规准备', 'Prototype Iteration / EVT Preparation / Regulatory Preparation'),
        evidence: [
          { label: text('第三代系统样机', 'Third-generation prototype'), href: asset('/projects/3/Goodent/第三代样机.jpg'), type: 'image' },
        ],
      },
    },
    {
      id: 'stirling',
      title: localize(text('Gamma 型斯特林发动机', 'Gamma-type Stirling Engine'), lang),
      category: localize(text('机械设计 · 热力学 · 多物理场仿真', 'Mechanical Design · Thermodynamics · Multiphysics'), lang),
      year: localize(text('2025 春', 'Spring 2025'), lang),
      status: localize(text('课程项目', 'Course Project'), lang),
      color: '#FF8A45',
      accentColor: 'rgba(255,138,69,0.14)',
      description: localize(text(
        '以 41 个零件的参数化装配为起点，用 COMSOL 与 ADAMS 完成从热力学原理、机构设计到实物验证的闭环。',
        'A 41-part parametric assembly carried the Stirling cycle from thermodynamic theory through COMSOL, ADAMS and a physical build.'
      ), lang),
      tags: ['SolidWorks', 'COMSOL', 'ADAMS', '3D Printing'],
      images: [
        asset('/projects/2/斯特林发动机/渲染模型0.PNG'),
        asset('/projects/2/斯特林发动机/渲染模型1.jpg'),
        asset('/projects/2/斯特林发动机/渲染模型2.png'),
        asset('/projects/2/斯特林发动机/墙体照片.jpg'),
        asset('/projects/2/斯特林发动机/拓扑优化模型.png'),
      ],
      caseStudy: {
        problem: text(
          '如何把斯特林循环的热力学原理转化为可装配、可制造并可通过多物理场验证的实体系统？',
          'How can the Stirling cycle be translated into an assembly that is manufacturable and verifiable through multiphysics analysis?'
        ),
        role: {
          zh: ['机械系统设计', '参数化建模', '仿真分析', '原型制造'],
          en: ['Mechanical System Design', 'Parametric CAD', 'Simulation', 'Prototype Fabrication'],
        },
        approach: {
          summary: text(
            '建立 Gamma 构型与完整装配，完成关键配合和运动关系设计，再以 COMSOL 与 ADAMS 分别检查热流体响应和机构动力学。',
            'Created the Gamma configuration and full assembly, designed critical interfaces and kinematics, then used COMSOL and ADAMS to inspect thermal-fluid response and mechanism dynamics.'
          ),
          technologies: ['41-part CAD Assembly', 'COMSOL FSI', 'ADAMS', 'Topology Study', '3D Printing'],
        },
        validation: {
          zh: ['装配干涉与运动检查', '流固耦合仿真', '多体动力学验证', '实体原型装配'],
          en: ['Assembly interference and motion checks', 'Fluid-structure simulation', 'Multibody dynamics validation', 'Physical prototype assembly'],
        },
        result: {
          zh: ['完成从原理、CAD、CAE 到实物的闭环', '形成可复用的热机系统分析流程'],
          en: ['Closed the loop from theory and CAD to CAE and hardware', 'Established a reusable thermodynamic-system analysis workflow'],
        },
        currentStage: text('课程项目完成 / 设计与仿真资料归档', 'Completed / Design and simulation evidence archived'),
        evidence: [
          { label: text('参数化装配渲染', 'Parametric assembly render'), href: asset('/projects/2/斯特林发动机/渲染模型1.jpg'), type: 'image' },
          { label: text('拓扑优化结果', 'Topology study result'), href: asset('/projects/2/斯特林发动机/拓扑优化模型.png'), type: 'image' },
        ],
      },
    },
    {
      id: 'pneumatic',
      title: localize(text('3D 打印气动小车', '3D-printed Pneumatic Vehicle'), lang),
      category: localize(text('机械系统 · 快速原型 · 车辆设计', 'Mechanical Systems · Rapid Prototyping · Vehicle Design'), lang),
      year: localize(text('2025 春', 'Spring 2025'), lang),
      status: localize(text('完整装配', 'Built Prototype'), lang),
      color: '#C6A278',
      accentColor: 'rgba(198,162,120,0.14)',
      description: localize(text(
        '把变速箱、差速器、车架、转向和悬架拆成可打印、可装配、可维护的模块，并用 BOM 支撑实物制造。',
        'Turned the gearbox, differential, chassis, steering and suspension into printable, serviceable modules backed by a structured BOM.'
      ), lang),
      tags: ['SolidWorks', 'Gearbox', 'Differential', 'Suspension', 'BOM'],
      images: [
        asset('/projects/2/气动小车/气动小车.png'),
        asset('/projects/2/气动小车/气动小车1.png'),
        asset('/projects/2/气动小车/气动小车2.png'),
        asset('/projects/2/气动小车/bom.jpg'),
        asset('/projects/2/气动小车/变速箱.gif'),
      ],
      caseStudy: {
        problem: text(
          '如何把气动动力、传动、转向和悬架集成为一套适合桌面 3D 打印制造的车辆系统？',
          'How can pneumatic power, transmission, steering and suspension be integrated into a vehicle that can be manufactured through desktop 3D printing?'
        ),
        role: {
          zh: ['整车机械设计', '传动系统', 'DFM', '装配规划'],
          en: ['Vehicle Mechanical Design', 'Transmission', 'DFM', 'Assembly Planning'],
        },
        approach: {
          summary: text(
            '将整车拆分为车架、发动机、变速箱、差速器、转向和悬架模块，围绕打印方向、支撑、装配间隙与维护性迭代结构。',
            'Decomposed the vehicle into chassis, engine, gearbox, differential, steering and suspension modules, iterating around print orientation, supports, assembly clearances and serviceability.'
          ),
          technologies: ['Parametric CAD', '3D Printing', 'Gear Train', 'Differential', 'BOM'],
        },
        validation: {
          zh: ['数字装配检查', '零件可打印性检查', '变速箱运动演示', 'BOM 与分件核对'],
          en: ['Digital assembly checks', 'Part printability review', 'Gearbox motion demonstration', 'BOM and part-breakdown verification'],
        },
        result: {
          zh: ['形成完整车辆装配与可打印零件集', '沉淀模块化机械系统设计经验'],
          en: ['Delivered a complete vehicle assembly and printable part set', 'Built reusable experience in modular mechanical-system design'],
        },
        currentStage: text('原型完成 / 制造文件归档', 'Prototype completed / Manufacturing files archived'),
        evidence: [
          { label: text('整车模型', 'Vehicle assembly'), href: asset('/projects/2/气动小车/气动小车.png'), type: 'image' },
          { label: 'BOM', href: asset('/projects/2/气动小车/bom.jpg'), type: 'image' },
        ],
      },
    },
    {
      id: 'flowerpot',
      title: localize(text('兰精灵 · 智能养护花盆', 'Lanjingling Smart Planter'), lang),
      category: localize(text('IoT · 产品开发 · 创新创业', 'IoT · Product Development · Innovation'), lang),
      year: localize(text('2025 秋', 'Fall 2025'), lang),
      status: localize(text('优秀结项', 'Excellent Completion'), lang),
      color: '#66D58A',
      accentColor: 'rgba(102,213,138,0.14)',
      description: localize(text(
        '作为项目负责人，从用户需求出发整合传感、自动浇灌与结构设计，完成两代原型并获国家级大创优秀结项。',
        'Led user research, sensing, irrigation and enclosure design through two prototype generations and an Excellent national-project completion.'
      ), lang),
      tags: ['Arduino', 'Sensors', 'IoT', 'User Research', 'Prototype Iteration'],
      images: [
        asset('/projects/3/大创/产品.png'),
        asset('/projects/3/大创/实物照片.jpg'),
        asset('/projects/3/大创/实物照片1.jpg'),
        asset('/projects/3/大创/兰科智护.png'),
      ],
      caseStudy: {
        problem: text(
          '家庭兰花养护依赖持续的浇灌、光照和温湿度管理，普通用户缺少稳定的监测与执行工具。',
          'Home orchid care depends on consistent irrigation, light, temperature and humidity management, while most users lack reliable monitoring and actuation tools.'
        ),
        role: {
          zh: ['项目负责人', '产品设计', '嵌入式集成', '答辩与商业方案'],
          en: ['Project Lead', 'Product Design', 'Embedded Integration', 'Pitch and Business Plan'],
        },
        approach: {
          summary: text(
            '从用户需求出发，把环境传感、自动浇灌、结构设计与交互反馈整合到两代原型中，并同步完成项目文档与答辩。',
            'Started with user needs and integrated environment sensing, automatic irrigation, enclosure design and feedback into two prototype generations, alongside project documentation and defense.'
          ),
          technologies: ['Arduino', 'Multisensor Fusion', 'Automatic Irrigation', 'SolidWorks', 'Rapid Prototyping'],
        },
        prototype: {
          zh: ['V1：功能链路与基础结构', 'V2：产品外观、集成度与可靠性改进'],
          en: ['V1: functional chain and base enclosure', 'V2: improved form, integration and reliability'],
        },
        validation: {
          zh: ['传感器与自动浇灌联调', '两代实物原型对比', '项目结项报告与现场答辩'],
          en: ['Sensor and irrigation integration tests', 'Comparison of two physical prototypes', 'Final report and project defense'],
        },
        result: {
          zh: ['国家级大学生创新创业训练计划优秀结项', '完成从用户需求到可演示产品的完整流程'],
          en: ['Excellent completion in the National College Student Innovation Program', 'Completed the workflow from user needs to a demonstrable product'],
        },
        currentStage: text('项目结项 / 原型与答辩资料归档', 'Completed / Prototype and defense materials archived'),
        evidence: [
          { label: text('产品原型', 'Product prototype'), href: asset('/projects/3/大创/产品.png'), type: 'image' },
          { label: text('实物照片', 'Physical build'), href: asset('/projects/3/大创/实物照片.jpg'), type: 'image' },
        ],
      },
    },
    {
      id: 'lerobot',
      title: localize(text('LeRobot 牙科种植机器人', 'LeRobot Dental Robotics'), lang),
      category: localize(text('具身智能 · 视觉定位 · 模仿学习', 'Embodied AI · Visual Positioning · Imitation Learning'), lang),
      year: localize(text('2026 春', 'Spring 2026'), lang),
      status: localize(text('研究原型', 'Research Prototype'), lang),
      color: '#FF7657',
      accentColor: 'rgba(255,118,87,0.14)',
      description: localize(text(
        '围绕 6 自由度机械臂建立从 ArUco 标定、主从示教到 ACT 数据分析的牙科操作实验链路。',
        'Built a dental-manipulation pipeline from ArUco calibration and leader-follower demonstrations to ACT dataset analysis on a 6-DOF arm.'
      ), lang),
      tags: ['LeRobot', 'ACT', 'ArUco', 'Teleoperation', 'Dataset Analysis'],
      images: [
        asset('/projects/3/dental-lerobot/lerobot.png'),
        asset('/projects/3/dental-lerobot/遥操.gif'),
        asset('/projects/3/dental-lerobot/dataset_overview.png'),
        asset('/projects/3/dental-lerobot/joint_trajectories.png'),
        asset('/projects/3/dental-lerobot/smoothing_comparison_episode5.png'),
        asset('/projects/3/dental-lerobot/task_keyframes.png'),
      ],
      caseStudy: {
        problem: text(
          '牙科机器人需要在有限空间内理解目标位姿并复现精细操作，单纯脚本控制难以覆盖不同位置与操作者差异。',
          'Dental robots must understand target pose and reproduce precise actions in a constrained workspace, where scripted motion alone does not generalize across positions and operators.'
        ),
        role: {
          zh: ['系统集成', '视觉标定', '数据管线', '策略验证'],
          en: ['System Integration', 'Vision Calibration', 'Data Pipeline', 'Policy Validation'],
        },
        approach: {
          summary: text(
            '通过主从双臂采集示教，使用 RGB 相机与 ArUco 完成坐标对齐，以 LeRobot 统一数据集，并用 ACT 学习动作分块策略。',
            'Captured demonstrations through leader-follower teleoperation, aligned coordinates with RGB cameras and ArUco, standardized the dataset in LeRobot and trained ACT action chunks.'
          ),
          technologies: ['6-DOF Arm', 'ArUco', 'LeRobot', 'ACT', 'Teleoperation', 'RGB Vision'],
        },
        validation: {
          zh: ['数据集分布检查', '关节轨迹分析', '平滑前后对比', '关键帧与任务阶段核对'],
          en: ['Dataset distribution review', 'Joint-trajectory analysis', 'Before/after smoothing comparison', 'Keyframe and task-phase inspection'],
        },
        result: {
          zh: ['完成可回放的牙科操作演示链路', '建立从示教采集到策略分析的完整数据流程'],
          en: ['Delivered a replayable dental-manipulation demonstration', 'Established an end-to-end workflow from demonstration capture to policy analysis'],
        },
        currentStage: text('研究原型 / 数据与策略迭代', 'Research prototype / Dataset and policy iteration'),
        evidence: [
          { label: text('主从遥操作', 'Leader-follower teleoperation'), href: asset('/projects/3/dental-lerobot/遥操.gif'), type: 'image' },
          { label: text('关节轨迹', 'Joint trajectories'), href: asset('/projects/3/dental-lerobot/joint_trajectories.png'), type: 'image' },
        ],
      },
    },
    {
      id: 'bldc',
      title: localize(text('自制 BLDC：空芯 V1 → 内转子 V2', 'DIY BLDC: Coreless V1 → Inner-Rotor V2'), lang),
      category: localize(text('电机设计 · 3D 打印 · 嵌入式控制', 'Motor Design · 3D Printing · Embedded Control'), lang),
      year: localize(text('2026 夏', 'Summer 2026'), lang),
      status: localize(text('V2 迭代中', 'V2 In Progress'), lang),
      color: '#FFD04A',
      accentColor: 'rgba(255,208,74,0.14)',
      description: localize(text(
        '让 12 槽 16 极空芯 V1 先跑起来，再把绕组、磁路、结构与驱动经验推进到新的内转子 V2。',
        'Got the 12-slot/16-pole coreless V1 running, then carried its winding, magnetic, mechanical and drive lessons into a new inner-rotor V2.'
      ), lang),
      tags: ['BLDC', 'Inner Rotor', 'Winding Design', 'ESP32-S3', 'ESC'],
      images: [
        asset('/projects/3/bldc-motor/videos/运行视频.gif'),
        asset('/projects/3/bldc-motor/v2/inner-rotor-prototype.mp4'),
        asset('/projects/3/bldc-motor/v2/inner-rotor-winding-diagram.png'),
        asset('/projects/3/bldc-motor/images/绕线方式.PNG'),
        asset('/projects/3/bldc-motor/images/磁铁物料-1.JPEG'),
        asset('/projects/3/bldc-motor/images/磁铁物料-2.JPEG'),
      ],
      documents: [
        { name: localize(text('电机设计工程笔记', 'Motor Design Engineering Notes'), lang), path: asset('/projects/3/bldc-motor/docs/电机设计-工程应用指南.md') },
        { name: 'Stator-Body.stl', path: asset('/projects/3/bldc-motor/models/Stator-Body.stl') },
        { name: 'Rotor-Body.stl', path: asset('/projects/3/bldc-motor/models/Rotor-Body.stl') },
      ],
      caseStudy: {
        problem: text(
          '如何从可运行的教学型空芯电机出发，理解绕组、极槽配合与驱动链路，并进一步设计结构更紧凑的内转子方案？',
          'How can a running educational coreless motor be used to understand winding, slot/pole pairing and the drive chain, then evolve into a more compact inner-rotor design?'
        ),
        role: {
          zh: ['电机结构设计', '绕组方案', '3D 打印', '驱动联调'],
          en: ['Motor Mechanical Design', 'Winding Scheme', '3D Printing', 'Drive Integration'],
        },
        approach: {
          summary: text(
            'V1 采用 12 槽 16 极、空芯定子与星形接法，由 ESP32-S3 配合无感电调驱动；V2 转向内转子结构，重新梳理相序、绕组方向、磁极布局与机械支撑。',
            'V1 uses a 12-slot/16-pole coreless stator with a star connection, driven by an ESP32-S3 and sensorless ESC. V2 moves to an inner-rotor architecture with revised phase order, winding direction, magnet layout and mechanical support.'
          ),
          technologies: ['12S16P', 'Star Winding', 'Inner Rotor', 'ESP32-S3', 'Sensorless ESC', '3D Printing'],
        },
        prototype: {
          zh: ['V1：12 槽 16 极空芯电机，完成运行验证', 'V2：新内转子无刷电机，正在进行结构与绕组迭代'],
          en: ['V1: running 12-slot/16-pole coreless motor', 'V2: new inner-rotor BLDC under mechanical and winding iteration'],
        },
        validation: {
          zh: ['V1 运行视频与换向验证', '三相绕组与相序核对', 'V2 内转子结构演示', '绕组图与磁极方向复核'],
          en: ['V1 running and commutation demonstration', 'Three-phase winding and phase-order review', 'V2 inner-rotor prototype demonstration', 'Winding-diagram and pole-direction review'],
        },
        result: {
          zh: ['完成一台可运行的自制 BLDC 原型', '形成从空芯外形到内转子 V2 的迭代路径', '沉淀可复用的模型、绕组图与调试记录'],
          en: ['Built a functioning DIY BLDC prototype', 'Established an iteration path from the coreless build to inner-rotor V2', 'Archived reusable models, winding diagrams and debugging notes'],
        },
        currentStage: text('V1 已运行 / V2 内转子方案迭代中', 'V1 Running / V2 Inner-Rotor Design In Progress'),
        evidence: [
          { label: text('V2 内转子演示视频', 'V2 inner-rotor prototype video'), href: asset('/projects/3/bldc-motor/v2/inner-rotor-prototype.mp4'), type: 'video' },
          { label: text('V2 绕组与磁极示意图', 'V2 winding and pole diagram'), href: asset('/projects/3/bldc-motor/v2/inner-rotor-winding-diagram.png'), type: 'image' },
          { label: text('V1 运行记录', 'V1 running record'), href: asset('/projects/3/bldc-motor/videos/运行视频.gif'), type: 'image' },
        ],
      },
    },
  ];
}

const cardVariants = {
  hidden: { opacity: 0, y: 55 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.23, 1, 0.32, 1] } },
};

function ProjectCard({ project, index, onSelect, lang }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <BorderGlow
        className="work-card"
        backgroundColor="#111113"
        borderRadius={28}
        onClick={() => onSelect(project)}
      >
        <div className="card-accent-line" style={{ background: project.color }} />

        <div className="card-header">
          <div className="card-meta">
            <span className="card-year">{project.year}</span>
            <span className="card-status" style={{ color: project.color }}>{project.status}</span>
          </div>
          <div className="card-icon-wrapper" style={{ background: project.accentColor, color: project.color }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <div className="card-body">
          <span className="card-category" style={{ color: project.color }}>{project.category}</span>
          <h3 className="card-title">{project.title}</h3>
          <p className="card-role-line">{project.caseStudy.role[lang].join(' · ')}</p>
          <p className="card-description">{project.description}</p>
        </div>

        {project.images?.[0] && (
          <div className="card-image-area" style={{ '--card-img': `url("${project.images[0]}")` }}>
            <img src={project.images[0]} alt={project.title} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          </div>
        )}

        <div className="card-footer">
          <div className="card-tags">
            {project.tags.map((tag) => <span key={tag} className="card-tag">{tag}</span>)}
          </div>
          <div className="card-action" data-hover>
            <span>{lang === 'en' ? 'Case Study' : '查看案例'}</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  );
}

export default function WorksSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [selectedProject, setSelectedProject] = useState(null);
  const { lang } = useI18n();
  const projects = getProjects(lang);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;
    if (isInView) element.classList.add('in-view');
    return () => element.classList.remove('in-view');
  }, [isInView]);

  const copy = lang === 'en'
    ? {
        label: 'Selected Work',
        title: 'Six selected projects that show how my capabilities developed.',
        subtitle: 'From mechanical design, simulation and embedded control to robotics, medical devices and venture work, each case explains the problem, my role and how the result was validated.',
      }
    : {
        label: '代表项目',
        title: '六个代表项目，记录我的能力怎样一步步形成。',
        subtitle: '从机械设计、仿真和嵌入式控制，到机器人、医疗器械与创业，每个案例都说明我解决了什么问题、承担了什么工作，以及如何验证结果。',
      };

  return (
    <section id="works" className="works-section" ref={sectionRef}>
      <div className="works-bg-glow works-glow-1" />
      <div className="works-bg-glow works-glow-2" />

      <div className="works-container">
        <motion.div
          className="works-header"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label">{copy.label}</span>
          <h2 className="section-heading">{copy.title}</h2>
          <p className="section-subheading">{copy.subtitle}</p>
        </motion.div>

        <motion.div
          className="capability-path"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {CAPABILITY_PATH.map((stage, index) => (
            <div className="capability-path-fragment" key={stage.en}>
              <span className="capability-stage">{localize(stage, lang)}</span>
              {index < CAPABILITY_PATH.length - 1 && <span className="capability-arrow" aria-hidden="true">→</span>}
            </div>
          ))}
        </motion.div>

        <div className="works-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onSelect={setSelectedProject}
              lang={lang}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
