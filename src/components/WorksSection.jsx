import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import HoloCard from './ui/HoloCard';
import ProjectDetailModal from './ProjectDetailModal';
import { asset } from '../utils/path';
import './WorksSection.css';

const projects = [
  {
    id: 1,
    title: 'Goodent 牙科微动力系统',
    category: '嵌入式系统 · 医疗器械 · 种子轮',
    description: '面向临床诊疗的纯电控制智能牙科微动力系统。基于STM32与无刷直流电机实现高精度扭矩控制，集成多传感器融合反馈回路，完成从概念验证到种子轮融资的全链路产品化落地。',
    tags: ['STM32', 'BLDC控制', '传感器融合', '医疗器械', '种子轮'],
    color: 'rgba(0, 200, 255, 0.75)',
    accentColor: 'rgba(27, 193, 239, 0.15)',
    year: '2026–至今',
    status: '种子轮',
    image: asset('/projects/3/Goodent/第三代样机.jpg'),
  },
  {
    id: 2,
    title: '斯特林发动机',
    category: '机械设计 · 热力学 · 多物理场仿真',
    description: '完整的Gamma型斯特林发动机设计与分析项目。从参数化三维建模（41个SLDPRT零件）到COMSOL流固耦合仿真、ADAMS多体动力学验证，覆盖热机设计全流程。',
    tags: ['SolidWorks', 'COMSOL', 'ADAMS', '3D打印', '热力学循环'],
    color: '#E65100',
    accentColor: 'rgba(230,81,0,0.15)',
    year: '2025 春',
    status: '课程设计',
    image: asset('/projects/2/斯特林发动机/渲染模型1.jpg'),
  },
  {
    id: 3,
    title: '气动小车',
    category: '机械工程 · 3D打印 · 车辆设计',
    description: '基于3D打印技术的气动动力小车完整工程项目。涵盖完整车体结构：变速箱、差速器、车架、发动机、方向盘、前后悬架系统,含有零件bom,支持直接切片打印。',
    tags: ['3D打印', 'SolidWorks', 'STEP', '变速箱', '差速器', '悬架系统'],
    color: '#795548',
    accentColor: 'rgba(121,85,72,0.15)',
    year: '2025 春',
    status: '快速原型',
    image: asset('/projects/2/气动小车/气动小车1.png'),
  },
  {
    id: 4,
    title: '兰精灵 · 智能养护花盆',
    category: '创新创业 · IoT · 嵌入式',
    description: '国家级大学生创新创业训练计划优秀结项项目。面向家庭园艺的智能化植物养护花盆，集成自动浇灌、光照监测、温湿度调控等多传感器融合系统，从概念验证到实物原型迭代再到结项答辩。',
    tags: ['SolidWorks', 'Arduino', 'IoT', '创新创业', '大创'],
    color: '#66BB6A',
    accentColor: 'rgba(102,187,106,0.15)',
    year: '2025 秋',
    status: '已结项',
    image: asset('/projects/3/大创/产品.png'),
  },
];

/* ═══════════════════════════════════════════════════════
   Card Variants v2 — Staggered fade-in-up with glass reveal
   
   Cards animate in sequence as the section enters view.
   The timing is designed to sync with Saturn's phase-3
   dissipation (scroll 0.7–1.0), creating a seamless
   handoff from 3D particles → HTML cards.
   ═══════════════════════════════════════════════════════ */
const cardVariants = {
  hidden: { opacity: 0, y: 55 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: i * 0.14,       // Stagger: each card 140ms after previous
      ease: [0.23, 1, 0.32, 1],  // Apple-standard ease
    },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.23, 1, 0.32, 1] },
  },
};

function ProjectCard({ project, index, onSelect }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <HoloCard
        className="work-card"
        accentColor={project.color || '#7C4DFF'}
        backgroundColor="#0a0814"
        borderRadius={20}
        intensity={0.6}
        sparkleCount={8}
        onClick={() => onSelect(project)}
      >
        <div className="card-accent-line" style={{ background: project.color }} />

        <div className="card-header">
          <div className="card-meta">
            <span className="card-year">{project.year}</span>
            <span className="card-status" style={{ color: project.color }}>
              {project.status}
            </span>
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
          <p className="card-description">{project.description}</p>
        </div>

        {/* 图片预览区域 */}
        {project.image && (
          <div className="card-image-area">
            <img src={project.image} alt={project.title} loading="lazy" />
          </div>
        )}

        <div className="card-footer">
          <div className="card-tags">
            {project.tags.map((tag, i) => (
              <span key={i} className="card-tag">{tag}</span>
            ))}
          </div>
          <div className="card-action" data-hover>
            <span>查看</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </HoloCard>
    </motion.div>
  );
}

export default function WorksSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [selectedProject, setSelectedProject] = useState(null);

  // Toggle in-view class on section element for CSS coordination
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (isInView) {
      el.classList.add('in-view');
    }
    return () => {
      if (el) el.classList.remove('in-view');
    };
  }, [isInView]);

  return (
    <section id="works" className="works-section" ref={sectionRef}>
      {/* Ambient glow elements — subtle depth behind cards */}
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
          <span className="section-label">精选项目</span>
          <h2 className="section-heading">
            工程与创新
            <br />
            <span className="heading-accent">交汇于此</span>
          </h2>
          <p className="section-subheading">
            涵盖医疗器械创业、机械设计热机仿真、快速原型制造与创新创业实践的项目精选集。
          </p>
        </motion.div>

        <div className="works-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onSelect={setSelectedProject} />
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
