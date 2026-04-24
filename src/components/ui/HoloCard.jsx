import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import './HoloCard.css';

/* ═══════════════════════════════════════════════════════════
   HoloCard — Pokemon 全息卡片效果
   
   视觉特效：
   1. 彩虹全息渐变 (iridescent holographic gradient)
   2. 鼠标跟踪闪光 (cursor-tracking shine sweep)
   3. 稀有度发光边框 (rarity glow border)
   4. 悬浮 3D 倾斜 (3D tilt on hover)
   5. 闪烁粒子动画 (sparkle particle animation)
   6. 底部稀有度徽章 (rarity badge)
   
   Props:
   - card: { title, type, description, skills[], metrics{} }
   - rarityStyles: { border, glow, bg, shimmer, label, labelColor }
   - phaseColor: 当前阶段主题色
   ═══════════════════════════════════════════════════════════ */

export default function HoloCard({ card, rarityStyles, phaseColor }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // ── 使用 useMemo 生成稳定的随机卡片编号 ──
  // 修复 React StrictMode 下 Math.random() 在 render 中导致闪烁的问题
  const cardNumber = useMemo(
    () => Math.floor(Math.random() * 900 + 100),
    [] // 仅在挂载时生成一次
  );
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [shinePos, setShinePos] = useState({ x: -100, y: -100 });

  /* ── Mouse move handler — 3D tilt + shine tracking ── */
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate relative position (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;  
    const y = (e.clientY - rect.top) / rect.height;

    // Tilt: max ±12deg rotation
    const rotateX = (y - 0.5) * -16;
    const rotateY = (x - 0.5) * 16;
    
    setTiltStyle({ rotateX, rotateY });
    
    // Shine position (percentage-based for CSS gradient)
    setShinePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
    setShinePos({ x: -100, y: -100 });
  };

  const isLegendary = card.rarity === 'legendary';

  return (
    <motion.div
      ref={cardRef}
      className={`holo-card holo-card--${card.rarity} ${isHovered ? 'holo-card--active' : ''}`}
      style={{
        '--holo-border': rarityStyles.border,
        '--holo-glow': rarityStyles.glow,
        '--holo-bg': rarityStyles.bg,
        '--holo-shimmer': rarityStyles.shimmer,
        '--holo-label-color': rarityStyles.labelColor,
        '--shine-x': `${shinePos.x}%`,
        '--shine-y': `${shinePos.y}%`,
        perspective: '1000px',
        transform: `rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.4s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      
      {/* ── Layer 1: Holographic iridescent overlay ── */}
      <div className="holo-iris" />
      
      {/* ── Layer 2: Cursor-tracking shine sweep ── */}
      <div 
        className="holo-shine"
        style={{
          background: `radial-gradient(circle 120px at var(--shine-x) var(--shine-y), 
            rgba(255,255,255,${isHovered ? 0.35 : 0.15}) 0%, 
            transparent 70%)`,
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* ── Layer 3: Animated holographic lines (like Pokemon card pattern) ── */}
      <div className="holo-lines">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="holo-line" 
            style={{ 
              top: `${(i / 7) * 100}%`,
              animationDelay: `${i * 0.2}s`,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${rarityStyles.border}${isHovered ? '40' : '15'} 20%,
                ${rarityStyles.border}${isHovered ? '60' : '25'} 50%, 
                ${rarityStyles.border}${isHovered ? '40' : '15'} 80%,
                transparent 100%)`,
            }} 
          />
        ))}
      </div>

      {/* ── Layer 4: Sparkle particles (more for legendary/shiny) ── */}
      {isHovered && (
        <div className="holo-sparkles">
          {[...Array(isLegendary ? 14 : isHovered && card.rarity === 'shiny' ? 10 : 6)].map((_, i) => (
            <span
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                fontSize: `${8 + Math.random() * 10}px`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}

      {/* ═══ CARD CONTENT ═══ */}
      <div className="holo-content">
        
        {/* Rarity badge + Title */}
        <div className="holo-top">
          <span className="holo-rarity-badge" style={{
            color: rarityStyles.labelColor,
            borderColor: rarityStyles.labelColor + '44',
            background: `${rarityStyles.labelColor}10`,
          }}>
            {card.type}
          </span>
          
          {/* Pokemon-style card number — 使用稳定的随机值 */}
          <span className="holo-card-num" style={{ color: `${phaseColor}50` }}>
            #{cardNumber}
          </span>
        </div>

        <h4 className="holo-title">{card.title}</h4>
        <p className="holo-desc">{card.description}</p>

        {/* Skills list */}
        <ul className="holo-skills">
          {card.skills.map((skill, i) => (
            <li key={i} className="holo-skill-item">
              <span className="skill-bullet" style={{ background: rarityStyles.border + '88' }}>▸</span>
              {skill}
            </li>
          ))}
        </ul>

        {/* Metrics footer */}
        <div className="holo-metrics">
          {Object.entries(card.metrics).map(([key, val]) => (
            <div key={key} className="metric">
              <span className="metric-val">{val}</span>
              <span className="metric-key">{key}</span>
            </div>
          ))}
        </div>

        {/* Bottom rarity bar */}
        <div className="holo-bottom-bar" style={{
          background: `linear-gradient(90deg, 
            ${rarityStyles.border}00, 
            ${rarityStyles.border}, 
            ${rarityStyles.border}66, 
            ${rarityStyles.border},
            ${rarityStyles.border}00)`,
        }}/>
      </div>

      {/* ── Legendary extra glow ring ── */}
      {isLegendary && (
        <>
          <div className="legendary-ring legendary-ring--outer" style={{
            borderColor: rarityStyles.border + '40',
            boxShadow: `0 0 20px ${rarityStyles.glow}, inset 0 0 20px ${rarityStyles.glow}`,
          }}/>
          <div className="legendary-ring legendary-ring--inner" style={{
            borderColor: rarityStyles.border + '25',
          }}/>
        </>
      )}
    </motion.div>
  );
}
