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
  text('嵌入式与控制', 'Embedded Systems & Control'),
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
      category: localize(text('医疗器械 · 电机控制 · 创业', 'Medical Devices · Motor Control · Entrepreneurship'), lang),
      year: localize(text('2026–至今', '2026–Present'), lang),
      status: localize(text('50 万元种子轮', 'RMB 500k Seed Funding'), lang),
      color: '#32D8FF',
      accentColor: 'rgba(50,216,255,0.14)',
      description: localize(text(
        '我作为联合创始人负责产品定义、系统架构与电机控制。经过三代原型迭代，系统已进入工程验证准备阶段。',
        'As co-founder, I lead product definition, system architecture and motor control. We have completed three prototype iterations and are preparing for engineering validation.'
      ), lang),
      tags: localize(text(['STM32', 'BLDC / PMSM', '扭矩估算', '医疗器械'], ['STM32', 'BLDC / PMSM', 'Torque Estimation', 'Medical Devices']), lang),
      images: [asset('/projects/3/Goodent/第三代样机.jpg')],
      caseStudy: {
        problem: text(
          '现有牙科动力系统主要提供稳定动力，医生仍高度依赖手感识别钻穿、卡针与异常负载，反馈不够结构化。',
          'Existing dental power systems mainly provide consistent power output, while clinicians still rely heavily on tactile feedback to identify drill breakthrough, tool jamming and abnormal loads.'
        ),
        role: {
          zh: ['联合创始人', '产品定义', '系统架构', '电机控制'],
          en: ['Co-founder', 'Product Definition', 'System Architecture', 'Motor Control'],
        },
        approach: {
          summary: text(
            '我将电机驱动、电流采样、扭矩估算、故障响应、散热和灌溉纳入同一套系统架构，通过 V1、V2、V3 三代原型逐步调整结构与控制方案。',
            'I brought motor drive, current sensing, torque estimation, fault response, cooling and irrigation into one system architecture, refining the mechanical and control design through V1, V2 and V3.'
          ),
          technologies: text(['BLDC / PMSM', '电流采样', '扭矩估算', 'STM32', '散热', '灌溉'], ['BLDC / PMSM', 'Current Sensing', 'Torque Estimation', 'STM32', 'Cooling', 'Irrigation']),
        },
        prototype: {
          zh: ['V1：功能与驱动链路验证', 'V2：结构、散热与控制迭代', 'V3：系统集成与工程验证样机'],
          en: ['V1: functional and motor-drive verification', 'V2: mechanical, thermal and control refinements', 'V3: integrated engineering-validation prototype'],
        },
        validation: {
          zh: ['扭矩与负载响应测试', '转速稳定性测试', '连续运行温升测试', '异常负载与停机逻辑验证'],
          en: ['Torque and load-response testing', 'Speed stability testing', 'Continuous-run thermal testing', 'Abnormal-load and shutdown-logic verification'],
        },
        result: {
          zh: ['完成三代系统原型迭代', '获得 50 万元种子轮投资', '进入工程验证准备与医疗器械合规准备阶段'],
          en: ['Completed three prototype iterations', 'Secured RMB 500k in seed funding', 'Advanced to preparation for engineering validation and medical-device regulatory work'],
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
        '我完成了 41 个零件的参数化装配，并用 COMSOL 和 ADAMS 检查热流体响应与机构运动，再通过实物装配验证设计。',
        'I created a 41-part parametric assembly, used COMSOL and ADAMS to examine thermal-fluid behaviour and mechanism motion, and checked the design through a physical build.'
      ), lang),
      tags: localize(text(['SolidWorks', 'COMSOL', 'ADAMS', '3D 打印'], ['SolidWorks', 'COMSOL', 'ADAMS', '3D Printing']), lang),
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
            '我先确定 Gamma 构型，完成零件配合与运动关系设计，再用 COMSOL 检查热流体响应、用 ADAMS 分析机构动力学，最后进行实物装配。',
            'I defined the Gamma configuration and designed the part interfaces and motion relationships, then examined thermal-fluid response in COMSOL and mechanism dynamics in ADAMS before assembling the physical prototype.'
          ),
          technologies: text(['41 件 CAD 装配', 'COMSOL 流固耦合', 'ADAMS', '拓扑优化', '3D 打印'], ['41-part CAD Assembly', 'COMSOL FSI', 'ADAMS', 'Topology Optimisation', '3D Printing']),
        },
        validation: {
          zh: ['装配干涉与运动检查', '流固耦合仿真', '多体动力学验证', '实体原型装配'],
          en: ['Assembly interference and motion checks', 'Fluid-structure simulation', 'Multibody dynamics validation', 'Physical prototype assembly'],
        },
        result: {
          zh: ['完成热力学分析、CAD 装配、CAE 仿真与实物装配', '整理了可复用的热机系统分析流程'],
          en: ['Completed thermodynamic analysis, CAD assembly, CAE simulation and a physical build', 'Established a reusable thermodynamic-system analysis workflow'],
        },
        currentStage: text('课程项目完成 / 设计与仿真资料归档', 'Completed / Design and simulation evidence archived'),
        evidence: [
          { label: text('参数化装配渲染', 'Parametric assembly render'), href: asset('/projects/2/斯特林发动机/渲染模型1.jpg'), type: 'image' },
          { label: text('拓扑优化结果', 'Topology optimisation result'), href: asset('/projects/2/斯特林发动机/拓扑优化模型.png'), type: 'image' },
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
        '我把传动、转向和悬架设计成可打印、可装配的模块，完成整车装配模型、零件集和 BOM，让制造与维护更清楚。',
        'I designed the transmission, steering and suspension as modules suitable for 3D printing and assembly, then prepared the complete assembly model, part set and BOM for fabrication and maintenance.'
      ), lang),
      tags: localize(text(['SolidWorks', '变速箱', '差速器', '悬架', 'BOM'], ['SolidWorks', 'Gearbox', 'Differential', 'Suspension', 'BOM']), lang),
      images: [
        asset('/projects/2/气动小车/assembly-cad.png'),
        asset('/projects/2/气动小车/assembly-render.png'),
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
            '我把整车拆为车架、发动机、变速箱、差速器、转向和悬架模块，逐项检查打印方向、支撑与装配间隙，并考虑后续拆装维护。',
            'I split the vehicle into chassis, engine, gearbox, differential, steering and suspension modules, checking print orientation, supports and assembly clearances while accounting for disassembly and maintenance.'
          ),
          technologies: text(['参数化 CAD', '3D 打印', '齿轮传动', '差速器', 'BOM'], ['Parametric CAD', '3D Printing', 'Gear Train', 'Differential', 'BOM']),
        },
        validation: {
          zh: ['数字装配检查', '零件可打印性检查', '变速箱运动演示', 'BOM 与分件核对'],
          en: ['Digital assembly checks', 'Part printability review', 'Gearbox motion demonstration', 'BOM and part-breakdown verification'],
        },
        result: {
          zh: ['完成整车装配模型与可打印零件集', '积累了模块化机械系统设计经验'],
          en: ['Delivered a complete vehicle assembly and printable part set', 'Gained experience in modular mechanical-system design'],
        },
        currentStage: text('原型完成 / 制造文件归档', 'Prototype completed / Manufacturing files archived'),
        evidence: [
          { label: text('整车模型', 'Vehicle assembly'), href: asset('/projects/2/气动小车/assembly-cad.png'), type: 'image' },
          { label: 'BOM', href: asset('/projects/2/气动小车/bom.jpg'), type: 'image' },
        ],
      },
    },
    {
      id: 'flowerpot',
      title: localize(text('兰精灵 · 智能养护花盆', 'Lanjingling Smart Planter'), lang),
      category: localize(text('IoT · 产品开发 · 创新创业', 'IoT · Product Development · Innovation'), lang),
      year: localize(text('2025 秋', 'Autumn 2025'), lang),
      status: localize(text('优秀结项', 'Excellent Completion Rating'), lang),
      color: '#66D58A',
      accentColor: 'rgba(102,213,138,0.14)',
      description: localize(text(
        '我负责把养护需求转化为产品，整合环境传感、自动浇灌与结构设计。项目完成两代原型，获国家级大创优秀结项。',
        'I led the translation of plant-care needs into a product, integrating environmental sensing, automatic irrigation and enclosure design. We built two prototype generations, and the project received an Excellent completion rating in the national student innovation programme.'
      ), lang),
      tags: localize(text(['Arduino', '传感器', 'IoT', '用户调研', '原型迭代'], ['Arduino', 'Sensors', 'IoT', 'User Research', 'Prototype Iteration']), lang),
      images: [
        asset('/projects/3/大创/产品.png'),
        asset('/projects/3/大创/实物照片.jpg'),
        asset('/projects/3/大创/实物照片1.jpg'),
        asset('/projects/3/大创/兰科智护.png'),
      ],
      caseStudy: {
        problem: text(
          '家庭兰花养护依赖持续的浇灌、光照和温湿度管理，普通用户缺少稳定的监测与执行工具。',
          'Home orchid care requires consistent management of watering, light, temperature and humidity, while users often lack reliable tools to monitor and manage these conditions.'
        ),
        role: {
          zh: ['项目负责人', '产品设计', '嵌入式集成', '答辩与商业方案'],
          en: ['Project Lead', 'Product Design', 'Embedded Integration', 'Pitch and Business Plan'],
        },
        approach: {
          summary: text(
            '我从用户养护需求出发，在两代原型中整合环境传感、自动浇灌、结构设计与交互反馈，并完成项目文档和结项答辩。',
            'I started with users’ plant-care needs, integrated sensing, irrigation, enclosure design and feedback across two prototypes, and completed the project documentation and final presentation.'
          ),
          technologies: text(['Arduino', '多传感器融合', '自动浇灌', 'SolidWorks', '快速原型'], ['Arduino', 'Multisensor Fusion', 'Automatic Irrigation', 'SolidWorks', 'Rapid Prototyping']),
        },
        prototype: {
          zh: ['V1：功能链路与基础结构', 'V2：产品外观、集成度与可靠性改进'],
          en: ['V1: core functions and initial enclosure', 'V2: improved form, integration and reliability'],
        },
        validation: {
          zh: ['传感器与自动浇灌联调', '两代实物原型对比', '项目结项报告与现场答辩'],
          en: ['Sensor and irrigation integration tests', 'Comparison of two physical prototypes', 'Final report and project presentation'],
        },
        result: {
          zh: ['国家级大学生创新创业训练计划优秀结项', '完成从用户需求到可演示产品的完整流程'],
          en: ['Excellent completion rating in the national student innovation and entrepreneurship training programme', 'Completed the workflow from user needs to a demonstrable product'],
        },
        currentStage: text('项目结项 / 原型与答辩资料归档', 'Completed / Prototype and presentation materials archived'),
        evidence: [
          { label: text('产品原型', 'Product prototype'), href: asset('/projects/3/大创/产品.png'), type: 'image' },
          { label: text('实物照片', 'Physical build'), href: asset('/projects/3/大创/实物照片.jpg'), type: 'image' },
        ],
      },
    },
    {
      id: 'lerobot',
      title: localize(text('LeRobot 牙科种植机器人', 'LeRobot Dental Robotics Prototype'), lang),
      category: localize(text('具身智能 · 视觉定位 · 模仿学习', 'Embodied AI · Visual Positioning · Imitation Learning'), lang),
      year: localize(text('2026 春', 'Spring 2026'), lang),
      status: localize(text('研究原型', 'Research Prototype'), lang),
      color: '#FF7657',
      accentColor: 'rgba(255,118,87,0.14)',
      description: localize(text(
        '我将 ArUco 标定、主从示教和 ACT 数据分析串联在 6 自由度机械臂上，搭建可采集、回放和分析的牙科操作实验系统。',
        'I integrated ArUco calibration, leader-follower demonstration collection and ACT data analysis into a robotic-arm setup for recording, replaying and analysing experimental dental procedures.'
      ), lang),
      tags: localize(text(['LeRobot', 'ACT', 'ArUco', '遥操作', '数据集分析'], ['LeRobot', 'ACT', 'ArUco', 'Teleoperation', 'Dataset Analysis']), lang),
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
          'Dental robotics requires estimating the target pose and reproducing precise movements in a confined workspace; scripted motion alone has limited adaptability to different positions and operators.'
        ),
        role: {
          zh: ['系统集成', '视觉标定', '数据管线', '策略验证'],
          en: ['System Integration', 'Vision Calibration', 'Data Pipeline', 'Policy Validation'],
        },
        approach: {
          summary: text(
            '我通过主从双臂采集示教，用 RGB 相机与 ArUco 对齐坐标，再通过 LeRobot 整理数据集，开展 ACT 动作分块策略的学习与分析。',
            'I collected leader-follower demonstrations, aligned coordinates with RGB cameras and ArUco, organised the dataset in LeRobot, and explored ACT action-chunking policy learning and analysis.'
          ),
          technologies: text(['6 自由度机械臂', 'ArUco', 'LeRobot', 'ACT', '遥操作', 'RGB 视觉'], ['Robotic Arm', 'ArUco', 'LeRobot', 'ACT', 'Teleoperation', 'RGB Vision']),
        },
        validation: {
          zh: ['数据集分布检查', '关节轨迹分析', '平滑前后对比', '关键帧与任务阶段核对'],
          en: ['Dataset distribution review', 'Joint-trajectory analysis', 'Comparison before and after smoothing', 'Keyframe and task-phase inspection'],
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
      title: localize(text('自制 BLDC 电机', 'DIY BLDC Motor'), lang),
      category: localize(text('电机设计 · 3D 打印 · 嵌入式控制', 'Motor Design · 3D Printing · Embedded Control'), lang),
      year: localize(text('2026 夏', 'Summer 2026'), lang),
      status: localize(text('V2 迭代中', 'V2 In Progress'), lang),
      color: '#FFD04A',
      accentColor: 'rgba(255,208,74,0.14)',
      description: localize(text(
        '我完成了 12 槽 16 极空芯 V1 的制作与运行验证。目前正根据绕组、磁路和驱动调试的经验，迭代内转子 V2。',
        'I built and ran the 12-slot/16-pole coreless V1. I am now applying what I learned about winding, magnet layout and drive setup to develop an inner-rotor V2.'
      ), lang),
      tags: localize(text(['BLDC', '内转子', '绕组设计', 'ESP32-S3', 'ESC'], ['BLDC', 'Inner Rotor', 'Winding Design', 'ESP32-S3', 'ESC']), lang),
      images: [
        asset('/projects/3/bldc-motor/videos/运行视频.gif'),
        asset('/projects/3/bldc-motor/v2/inner-rotor-prototype.mp4'),
        asset('/projects/3/bldc-motor/v2/inner-rotor-winding-diagram.png'),
        asset('/projects/3/bldc-motor/images/绕线方式.PNG'),
        asset('/projects/3/bldc-motor/images/磁铁物料-1.JPEG'),
        asset('/projects/3/bldc-motor/images/磁铁物料-2.JPEG'),
      ],
      documents: [
        { name: '电机设计工程笔记', nameEn: 'Motor Design Engineering Notes', path: asset('/projects/3/bldc-motor/docs/电机设计-工程应用指南.md') },
        { name: 'Stator-Body.stl', nameEn: 'Stator-Body.stl', path: asset('/projects/3/bldc-motor/models/Stator-Body.stl') },
        { name: 'Rotor-Body.stl', nameEn: 'Rotor-Body.stl', path: asset('/projects/3/bldc-motor/models/Rotor-Body.stl') },
      ],
      caseStudy: {
        problem: text(
          '如何从可运行的教学型空芯电机出发，理解绕组、极槽配合与驱动链路，并进一步设计结构更紧凑的内转子方案？',
          'How can a working educational coreless motor help me understand winding, slot/pole combinations and motor-drive integration, and inform a more compact inner-rotor design?'
        ),
        role: {
          zh: ['电机结构设计', '绕组方案', '3D 打印', '驱动联调'],
          en: ['Motor Mechanical Design', 'Winding Scheme', '3D Printing', 'Drive Integration'],
        },
        approach: {
          summary: text(
            '我先制作了 12 槽 16 极、星形接法的空芯 V1，用 ESP32-S3 和无感电调完成驱动联调。V2 改为内转子结构，目前正在调整相序、绕组方向、磁极布局和机械支撑。',
            'I first built a 12-slot/16-pole coreless V1 with a star connection and commissioned the ESP32-S3 and sensorless ESC drive. V2 moves to an inner rotor, with phase order, winding direction, magnet layout and mechanical support still being refined.'
          ),
          technologies: text(['12 槽 16 极', '星形绕组', '内转子', 'ESP32-S3', '无感电调', '3D 打印'], ['12S16P', 'Star Winding', 'Inner Rotor', 'ESP32-S3', 'Sensorless ESC', '3D Printing']),
        },
        prototype: {
          zh: ['V1：12 槽 16 极空芯电机，完成运行验证', 'V2：新内转子无刷电机，正在进行结构与绕组迭代'],
          en: ['V1: running 12-slot/16-pole coreless motor', 'V2: inner-rotor BLDC with ongoing mechanical and winding refinements'],
        },
        validation: {
          zh: ['V1 运行视频与换向验证', '三相绕组与相序核对', 'V2 内转子结构演示', '绕组图与磁极方向复核'],
          en: ['V1 running and commutation demonstration', 'Three-phase winding and phase-order review', 'V2 inner-rotor prototype demonstration', 'Winding-diagram and pole-direction review'],
        },
        result: {
          zh: ['完成一台可运行的自制 BLDC 原型', '开始从空芯 V1 向内转子 V2 迭代', '整理了可复用的模型、绕组图与调试记录'],
          en: ['Built a functioning DIY BLDC prototype', 'Established an iteration path from the coreless build to inner-rotor V2', 'Archived reusable models, winding diagrams and debugging notes'],
        },
        currentStage: text('V1 已运行 / V2 内转子方案迭代中', 'V1 Operational / V2 Inner-Rotor Design in Progress'),
        evidence: [
          { label: text('V2 内转子演示视频', 'V2 inner-rotor prototype video'), href: asset('/projects/3/bldc-motor/v2/inner-rotor-prototype.mp4'), type: 'video' },
          { label: text('V2 绕组与磁极示意图', 'V2 winding and pole diagram'), href: asset('/projects/3/bldc-motor/v2/inner-rotor-winding-diagram.png'), type: 'image' },
          { label: text('V1 运行记录', 'V1 operation demonstration'), href: asset('/projects/3/bldc-motor/videos/运行视频.gif'), type: 'image' },
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
        label: 'PROJECTS',
        title: 'Selected Work',
        subtitle: 'Six projects, from mechanical systems to dental robotics. Here is what I worked on, how I tested it and where each project stands.',
      }
    : {
        label: '项目精选',
        title: '代表项目',
        subtitle: '从机械系统到牙科机器人，六个项目记录了我做过的设计、验证过程和当前进展。',
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
          <ProjectDetailModal project={projects.find((project) => project.id === selectedProject.id)} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
