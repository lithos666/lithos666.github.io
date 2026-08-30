import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useI18n } from '../i18n-context';
import ProjectDetailModal from './ProjectDetailModal';
import MetallicPaint from './ui/MetallicPaint';
import { COVER_FLOW, CARD_STYLE } from '../constants';
import './YearOneProjects.css';

const PUBLISHED_EVIDENCE_PATHS = new Set([
  '/projects/3/数值分析/工程数值分析第三次汇报.pdf',
  '/projects/3/产品制造/final-report.docx',
  '/projects/3/bldc-motor/docs/电机设计-工程应用指南.md',
  '/projects/3/bldc-motor/models/Stator-Body.stl',
  '/projects/3/bldc-motor/models/Rotor-Body.stl',
  '/projects/3/bldc-motor/models/Stator Base-Body.stl',
  '/projects/3/bldc-motor/models/Base Ring-Body.stl',
]);

const getPublishedDocuments = (project) => (project.documents || []).filter(doc => {
  const path = typeof doc?.path === 'string' ? doc.path : '';
  return /^https?:\/\//i.test(path) || PUBLISHED_EVIDENCE_PATHS.has(path);
});

const getResponsiveCoverFlow = () => {
  const viewportWidth = typeof window === 'undefined' ? 1440 : window.innerWidth;

  if (viewportWidth <= 600) {
    return {
      activeWidth: Math.min(360, viewportWidth - 28),
      activeHeight: 440,
      inactiveWidth: 240,
      inactiveHeight: 300,
      xOffset: 250,
    };
  }

  if (viewportWidth <= 900) {
    return {
      activeWidth: 430,
      activeHeight: 540,
      inactiveWidth: 320,
      inactiveHeight: 390,
      xOffset: 300,
    };
  }

  return {
    activeWidth: COVER_FLOW.ACTIVE_CARD_WIDTH,
    activeHeight: COVER_FLOW.ACTIVE_CARD_HEIGHT,
    inactiveWidth: COVER_FLOW.INACTIVE_CARD_WIDTH,
    inactiveHeight: COVER_FLOW.INACTIVE_CARD_HEIGHT,
    xOffset: COVER_FLOW.CARD_X_OFFSET,
  };
};

/**
 * CoverFlowCarousel — 共享的 Cover Flow 轮播组件
 *
 * 解决问题: YearOneProjects / YearTwoProjects / YearThreeProjects 三个组件
 * 包含 ~800 行完全重复的 Cover Flow 逻辑。此组件将公共逻辑抽取为一处，
 * 通过 props 传入数据和配置，实现 DRY 原则。
 *
 * Props:
 * - projects: 项目数据数组 (必需)
 * - sectionId: section DOM id (如 'year-one')
 * - badgeText: 年级标签文字 ('YEAR ONE' / 'YEAR TWO' / ...)
 * - title: 标题文字
 * - subtitle: 副标题/描述文字
 * - layoutIdPrefix: Framer Motion layoutId 前缀 (必须全局唯一!)
 * - statusDetector: 判断项目是"实践项目"还是"课程项目"的函数
 */
export default function CoverFlowCarousel({
  projects = [],
  sectionId = '',
  badgeText = '',
  title = '',
  subtitle = '',
  layoutIdPrefix = 'coverflow',
  statusDetector = null,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);
  const dragX = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [coverFlowSize, setCoverFlowSize] = useState(getResponsiveCoverFlow);
  const dragStartX = useRef(0);
  const { lang, t } = useI18n();

  useEffect(() => {
    const syncCoverFlowSize = () => setCoverFlowSize(getResponsiveCoverFlow());
    window.addEventListener('resize', syncCoverFlowSize);
    return () => window.removeEventListener('resize', syncCoverFlowSize);
  }, []);

  // ── 双语项目数据处理 ──
  // 如果项目有 _zh/_en 字段，使用对应语言的文本；否则回退到原字段
  const getLocalizedField = (project, enField, zhField) => {
    if (lang === 'en' && project[`${zhField}En`]) {
      return project[`${zhField}En`];
    }
    return project[zhField] || project[enField] || '';
  };

  const getLocalizedHighlights = (project) => {
    if (lang === 'en' && project.highlightsEn) {
      return project.highlightsEn;
    }
    return project.highlights || [];
  };

  const getLocalizedTags = (project) => {
    if (lang === 'en' && project.tagsEn) {
      return project.tagsEn;
    }
    return project.tags || [];
  };

  // ── 安全导航函数 ──
  const goTo = useCallback((idx) => {
    if (!Number.isFinite(idx)) return;
    const total = projects.length;
    // 循环处理：超出范围则回绕到另一端
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    setActiveIndex(idx);
  }, [projects.length]);

  // ── 卡片样式计算 (纯函数, 无副作用) ──
  const getCardStyle = useCallback((index) => {
    const total = projects.length;

    // 计算相对当前选中项的偏移量，支持环形排列
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);

    // 缩放: 从中心向两侧平滑衰减
    const scale =
      absOffset === 0
        ? CARD_STYLE.SCALE_CENTER
        : absOffset === 1
          ? CARD_STYLE.SCALE_ADJACENT
          : Math.max(CARD_STYLE.SCALE_MIN, 1 - absOffset * CARD_STYLE.SCALE_DECAY);

    // 透明度: 平滑淡出
    const opacity =
      absOffset === 0
        ? CARD_STYLE.OPACITY_CENTER
        : Math.max(CARD_STYLE.OPACITY_MIN, 1 - absOffset * CARD_STYLE.OPACITY_DECAY);

    // 景深模糊: 距离越远越模糊 (二次增长 + 线性项)
    const blur =
      absOffset === 0
        ? CARD_STYLE.BLUR_CENTER
        : Math.min(CARD_STYLE.BLUR_MAX, absOffset * absOffset * 3 + absOffset * 2);

    // X 轴偏移、层级、3D 倾斜
    const xOffset = offset * coverFlowSize.xOffset;
    const zIndex = total - absOffset;
    const rotateY = offset * -COVER_FLOW.ROTATE_Y_DEG;

    return { scale, opacity, blur, xOffset, zIndex, rotateY };
  }, [activeIndex, coverFlowSize.xOffset, projects.length]);

  // ── 键盘事件监听 ──
  useEffect(() => {
    const handleKey = (e) => {
      if (selectedProject) return; // 模态框打开时不响应键盘导航
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      else if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, goTo, selectedProject]);

  // ── 输入验证（所有 hooks 之后） ──
  if (!Array.isArray(projects) || projects.length === 0) {
    console.warn('[CoverFlowCarousel] projects 必须为非空数组');
    return null;
  }

  // ── 拖拽结束处理 ──
  const onDragEnd = (_, info) => {
    setIsDragging(false);
    if (Math.abs(info.velocity.x) > COVER_FLOW.DRAG_VELOCITY_THRESHOLD) {
      goTo(info.velocity.x > 0 ? activeIndex - 1 : activeIndex + 1);
    }
    // 使用 animate 实现平滑回弹，而非直接 set(0)
    dragX.animate(0, {
      type: 'spring',
      stiffness: COVER_FLOW.SPRING_STIFFNESS,
      damping: COVER_FLOW.SPRING_DAMPING,
    });
  };

  // ── 安全获取项目状态文本 ──
  const getStatusText = (project) => {
    if (typeof statusDetector === 'function') {
      return t(statusDetector(project));
    }
    // 默认逻辑：通过 id 列表判断
    if (project.id?.includes('practice') || project.id?.includes('stirling')) {
      return t('status.practice');
    }
    if (project.id?.includes('sutd')) {
      return t('status.exchange');
    }
    return t('status.coursework');
  };

  // ── 安全图片加载处理 ──
  const handleImageError = (e) => {
    // 隐藏加载失败的图片容器
    if (e.target.parentElement) {
      e.target.parentElement.style.display = 'none';
    }
  };

  return (
    <section className="year-one-section" id={sectionId}>
      {/* Ambient glow orbs */}
      <div className="y1-glow y1-glow-1" />
      <div className="y1-glow y1-glow-2" />
      <div className="y1-glow y1-glow-3" />

      {/* Header */}
      <div className="y1-header">
        <motion.div
          className="y1-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {badgeText}
        </motion.div>
        <motion.h2
          className="y1-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <MetallicPaint>{title}</MetallicPaint>
        </motion.h2>
        <motion.p
          className="y1-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Tab Navigation */}
      <div className="y1-tabs">
        {projects.map((project, idx) => (
          <button
            key={project.id || idx}
            className={`y1-tab ${idx === activeIndex ? 'y1-tab--active' : ''}`}
            onClick={() => goTo(idx)}
            style={{
              '--tab-color': project.color,
              '--tab-accent': project.accentColor,
            }}
          >
            <span
              className="y1-tab-icon"
              style={{ background: project.color }}
            >
              {getLocalizedField(project, 'titleEn', 'title').charAt(0)}
            </span>
            <span className="y1-tab-text">
              <span className="y1-tab-title">{getLocalizedField(project, 'titleEn', 'title')}</span>
              <span className="y1-tab-sub">
                {(getLocalizedField(project, 'categoryEn', 'category') || '').split(' ')[0]}
              </span>
            </span>
            {/* 使用唯一的 layoutId 避免冲突 */}
            {idx === activeIndex && (
              <motion.div
                className="y1-tab-indicator"
                layoutId={`${layoutIdPrefix}-tab-indicator`}
                style={{ background: project.color }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Cover Flow Carousel */}
      <div className="coverflow-container" ref={containerRef}>
        <button
          className="coverflow-arrow coverflow-arrow--left"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="上一项"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className="coverflow-arrow coverflow-arrow--right"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="下一项"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <motion.div
          className="coverflow-track"
          x={dragX}
          drag="x"
          dragConstraints={COVER_FLOW.DRAG_CONSTRAINT}
          dragElastic={COVER_FLOW.DRAG_ELASTICITY}
          onDragStart={() => {
            setIsDragging(true);
            dragStartX.current = dragX.get();
          }}
          onDragEnd={onDragEnd}
        >
          {projects.map((project, index) => {
            const s = getCardStyle(index);
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={project.id || index}
                className={`coverflow-card ${isActive ? 'coverflow-card--active' : ''}`}
                style={{
                  '--cf-color': project.color,
                  '--cf-accent': project.accentColor,
                  width: isActive ? coverFlowSize.activeWidth : coverFlowSize.inactiveWidth,
                  height: isActive ? coverFlowSize.activeHeight : coverFlowSize.inactiveHeight,
                  x: s.xOffset - (isActive ? coverFlowSize.activeWidth / 2 : coverFlowSize.inactiveWidth / 2),
                  zIndex: s.zIndex,
                  cursor: isDragging ? 'grabbing' : 'pointer',
                }}
                animate={{
                  scale: s.scale,
                  opacity: s.opacity,
                  filter: `blur(${s.blur}px)`,
                  rotateY: s.rotateY,
                }}
                transition={{
                  type: 'spring',
                  stiffness: COVER_FLOW.SPRING_STIFFNESS,
                  damping: COVER_FLOW.SPRING_DAMPING,
                  mass: COVER_FLOW.SPRING_MASS,
                }}
                onClick={() => {
                  // 拖拽位移超过阈值时不触发点击导航，避免与拖拽冲突
                  const dragDelta = Math.abs(dragX.get() - dragStartX.current);
                  if (dragDelta < 5) goTo(index);
                }}
              >
                <div className="coverflow-inner">
                  <div className="cf-header">
                    <span className="cf-year">{getLocalizedField(project, 'yearEn', 'year')}</span>
                    <span className="cf-status" style={{ color: project.color }}>
                      {getStatusText(project)}
                    </span>
                  </div>
                  <h3 className="cf-title">{getLocalizedField(project, 'titleEn', 'title')}</h3>
                  <p className="cf-subtitle">{getLocalizedField(project, 'subtitleEn', 'subtitle')}</p>
                  <span className="cf-category" style={{ color: project.color }}>
                    {getLocalizedField(project, 'categoryEn', 'category')}
                  </span>
                  <p className="cf-desc">
                    {getLocalizedField(project, 'descriptionEn', 'description')}
                  </p>

                  {/* 图片预览 - 仅在活跃卡片且有有效图片时显示；毛玻璃衬底完整展示 */}
                  {isActive && Array.isArray(project.images) && project.images.length > 0 && project.images[0] && (
                    <div
                      className={`cf-preview-img${project.imageRotate ? ' cf-img-rotate' : ''}`}
                      style={{
                        background: project.imageBg || 'rgba(255, 255, 255, 0.03)',
                        '--cf-img': `url("${project.images[0]}")`,
                        '--img-rotate-deg': project.imageRotate ? `${project.imageRotate}deg` : undefined,
                      }}
                    >
                      <img
                        src={project.images[0]}
                        alt={getLocalizedField(project, 'titleEn', 'title') || 'Project'}
                        loading="lazy"
                        onError={handleImageError}
                      />
                    </div>
                  )}

                  {/* 亮点列表 */}
                  <ul className="cf-highlights">
                    {getLocalizedHighlights(project).map((item, i) => (
                      <li key={i}>
                        <span
                          className="cf-dot"
                          style={{ background: project.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* 标签 */}
                  <div className="cf-tags">
                    {getLocalizedTags(project).map((tag) => (
                      <span
                        key={tag}
                        className="cf-tag"
                        style={{
                          borderColor: `${project.color}33`,
                          color: project.color,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 查看详情按钮 - 仅活跃卡片显示 */}
                  {isActive && (
                    <button
                      className="cf-btn"
                      style={{ background: project.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject({
                          ...project,
                          documents: getPublishedDocuments(project),
                        });
                      }}
                    >
                      {t('view-details')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 圆点指示器 */}
        <div className="coverflow-dots">
          {projects.map((_, idx) => (
            <button
              key={idx}
              className={`coverflow-dot ${idx === activeIndex ? 'coverflow-dot--active' : ''}`}
              onClick={() => goTo(idx)}
              style={{
                background:
                  idx === activeIndex ? projects[idx].color : 'rgba(255,255,255,0.15)',
                transform: idx === activeIndex ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
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
