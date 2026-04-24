import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import './ProjectDetailModal.css';

/* ═════════════════════════════════════════════════════
   ProjectDetailModal — 项目详情弹窗
   
   Features:
   - 图片画廊（左右切换，支持放大预览）
   - 项目亮点列表
   - 附件/文档下载链接
   - 平滑进出动画
   - Props 校验与空值保护
   
   Props:
   - project: 项目数据对象 { title, subtitle, category, color, accentColor,
              description, highlights[], images[], tags[], documents[] }
   - onClose: 关闭回调函数
   ═════════════════════════════════════════════════════ */

/** 默认空项目结构，防止解构 undefined 报错 */
const EMPTY_PROJECT = {
  title: '',
  subtitle: '',
  category: '',
  color: '#7C4DFF',
  accentColor: 'rgba(124,77,255,0.10)',
  description: '',
  highlights: [],
  images: [],
  tags: [],
  documents: [],
};

export default function ProjectDetailModal({ project, onClose }) {
  // ── Props 校验与安全默认值 ──
  const safeProject = useMemo(() => {
    if (!project || typeof project !== 'object') {
      console.warn('[ProjectDetailModal] 收到无效的 project prop，使用默认值');
      return EMPTY_PROJECT;
    }
    return { ...EMPTY_PROJECT, ...project };
  }, [project]);

  const safeOnClose = typeof onClose === 'function'
    ? onClose
    : () => console.warn('[ProjectDetailModal] 缺少 onClose 回调');

  const [imageIndex, setImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const modalRef = useRef(null);
  const bodyRef = useRef(null);

  // ESC 关闭 + body 滚动锁定
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') safeOnClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [safeOnClose]);

  // 阻止详情页内滚轮事件冒泡到主页面
  const handleBodyWheel = (e) => {
    e.stopPropagation();
  };

  // 点击背景关闭
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) safeOnClose();
  };

  // 安全过滤图片：排除空值、目录路径、无效字符串
  const hasImages = Array.isArray(safeProject.images) && safeProject.images.length > 0;
  const validImages = (safeProject.images || []).filter((src) =>
    typeof src === 'string' && src.trim().length > 0 && !src.endsWith('/')
  );

  // 安全获取文档列表
  const documents = Array.isArray(safeProject.documents) ? safeProject.documents : [];
  const highlights = Array.isArray(safeProject.highlights) ? safeProject.highlights : [];
  const tags = Array.isArray(safeProject.tags) ? safeProject.tags : [];

  return (
    <motion.div
      className="pdm-overlay"
      ref={modalRef}
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="pdm-modal"
        style={{
          '--pdm-accent': safeProject.color,
          '--pdm-accent-bg': safeProject.accentColor,
        }}
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30, duration: 0.4 }}
      >
        {/* ── Header ── */}
        <div className="pdm-header">
          <div>
            <span
              className="pdm-category"
              style={{ color: safeProject.color }}
            >
              {safeProject.category}
            </span>
            <h2 className="pdm-title">{safeProject.title}</h2>
            <p className="pdm-subtitle">{safeProject.subtitle}</p>
          </div>
          <button className="pdm-close" onClick={safeOnClose} aria-label="关闭">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Image Gallery ── */}
        {hasImages && validImages.length > 0 && (
          <div className="pdm-gallery" style={{ background: safeProject.imageBg || '#000' }}>
            <div className="pdm-gallery-viewport">
              {validImages.map((src, idx) => (
                <div
                  key={idx}
                  className={`pdm-slide ${idx === imageIndex ? 'pdm-slide--active' : ''}`}
                >
                  <img
                    src={src}
                    alt={`${safeProject.title} — 图 ${idx + 1}`}
                    loading="lazy"
                    onClick={() => setLightboxOpen(true)}
                  />
                </div>
              ))}
            </div>

            {/* Gallery Controls */}
            {validImages.length > 1 && (
              <>
                <button
                  className="pdm-gallery-btn pdm-gallery-prev"
                  onClick={() =>
                    setImageIndex((prev) =>
                      prev === 0 ? validImages.length - 1 : prev - 1
                    )
                  }
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  className="pdm-gallery-btn pdm-gallery-next"
                  onClick={() =>
                    setImageIndex((prev) =>
                      prev === validImages.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="pdm-dots">
                  {validImages.map((_, idx) => (
                    <button
                      key={idx}
                      className={`pdm-dot ${idx === imageIndex ? 'pdm-dot--active' : ''}`}
                      style={{
                        background: idx === imageIndex ? safeProject.color : 'rgba(255,255,255,0.15)',
                      }}
                      onClick={() => setImageIndex(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* No images placeholder */}
        {!hasImages || validImages.length === 0 ? (
          <div
            className="pdm-no-image"
            style={{ borderColor: safeProject.accentColor }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.25">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span>暂无图片</span>
            <small>将图片放入 /public/projects/1/{safeProject.id}/ 并更新组件中的 images 数组即可显示</small>
          </div>
        ) : null}

        {/* ── Description & Highlights ── */}
        <div className="pdm-body" ref={bodyRef} onWheel={handleBodyWheel}>
          <div className="pdm-section">
            <h3 className="pdm-section-title">项目概述</h3>
            <p className="pdm-desc">{safeProject.description}</p>
          </div>

          <div className="pdm-section">
            <h3 className="pdm-section-title">核心亮点</h3>
            <ul className="pdm-highlights">
              {highlights.map((item, i) => (
                <li key={i}>
                  <span
                    className="pdm-hl-dot"
                    style={{ background: safeProject.color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="pdm-tags-row">
            {tags.map((tag) => (
              <span
                key={tag}
                className="pdm-tag"
                style={{
                  borderColor: `${safeProject.color}30`,
                  color: safeProject.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <div className="pdm-section">
              <h3 className="pdm-section-title">相关文档</h3>
              <div className="pdm-docs">
                {documents.map((doc, i) => {
                  // 安全获取文档属性
                  const docName = typeof doc.name === 'string' ? doc.name : '未命名文件';
                  const docPath = typeof doc.path === 'string' ? doc.path : '#';
                  
                  // 根据扩展名选择图标
                  const isVideo = /\.(mp4|avi|mov)$/i.test(docName);
                  const isPdf = /\.pdf$/i.test(docName);
                  const isPpt = /\.(pptx|ppt)$/i.test(docName);
                  const isModel = /\.(step|STEP|stl|STL|iges|IGS|model)$/i.test(docName);

                  return (
                    <a
                      key={i}
                      href={docPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdm-doc-item"
                      style={{ borderColor: safeProject.accentColor }}
                    >
                      <span className="pdm-doc-icon">
                        {isVideo ? (
                          /* Video icon */
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <polygon points="5 3 19 12 5 21" fill="currentColor" opacity="0.3" />
                            <polygon points="7 6 16 12 7 18" />
                          </svg>
                        ) : isPdf ? (
                          /* PDF icon */
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                          </svg>
                        ) : isPpt ? (
                          /* PPT icon */
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                        ) : isModel ? (
                          /* 3D model icon */
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        ) : /* Generic file */ (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                            <polyline points="13 2 13 9 20 9" />
                          </svg>
                        )}
                      </span>
                      <span className="pdm-doc-name">{docName}</span>
                      <svg
                        className="pdm-doc-arrow"
                        width="12" height="12" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Lightbox ── */}
      {lightboxOpen && validImages[imageIndex] && (
        <div className="pdm-lightbox" onClick={() => setLightboxOpen(false)}>
          <img
            src={validImages[imageIndex]}
            alt={`${safeProject.title} — 放大`}
            className="pdm-lightbox-img"
          />
          <button
            className="pdm-lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
}
