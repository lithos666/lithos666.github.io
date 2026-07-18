import { useState, useRef, useMemo } from 'react';
import './HoloCard.css';

/* ═══════════════════════════════════════════════════════════
   HoloCard — 全息卡片效果 (通用包装器)
   
   视觉特效：
   1. 彩虹全息渐变 (iridescent holographic gradient)
   2. 鼠标跟踪闪光 (cursor-tracking shine sweep)
   3. 全息扫描线 (holographic scan lines)
   4. 悬浮 3D 倾斜 (3D tilt on hover)
   5. 闪烁粒子动画 (sparkle particle animation)
   
   Props:
   - children: 卡片内容
   - className: 额外 CSS 类名
   - accentColor: 主题色 (影响全息渐变和边框)
   - backgroundColor: 卡片背景色
   - borderRadius: 圆角半径 (px)
   - intensity: 全息效果强度 (0~1)
   - sparkleCount: 闪烁粒子数量
   - onClick: 点击回调
   ═══════════════════════════════════════════════════════════ */

function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) || 128;
  const g = parseInt(hex.substring(2, 4), 16) || 128;
  const b = parseInt(hex.substring(4, 6), 16) || 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function HoloCard({
  children,
  className = '',
  accentColor = '#7C4DFF',
  backgroundColor = '#0a0814',
  borderRadius = 18,
  intensity = 0.6,
  sparkleCount = 8,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // ── 使用 useMemo 生成稳定的随机卡片编号 ──
  const cardNumber = useMemo(
    () => Math.floor(Math.random() * 900 + 100),
    []
  );
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [shinePos, setShinePos] = useState({ x: -100, y: -100 });

  /* ── Mouse move handler — 3D tilt + shine tracking ── */
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -14;
    const rotateY = (x - 0.5) * 14;
    setTiltStyle({ rotateX, rotateY });
    setShinePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
    setShinePos({ x: -100, y: -100 });
  };

  // 根据主题色生成彩虹渐变色环
  const irisGradient = useMemo(() => {
    const base = accentColor;
    return `conic-gradient(
      from var(--iris-angle, 0deg) at 50% 50%,
      transparent 0deg,
      ${hexToRgba(base, 0.10)} 30deg,
      ${hexToRgba('#00c8ff', 0.08)} 60deg,
      ${hexToRgba(base, 0.07)} 90deg,
      ${hexToRgba('#ffc800', 0.09)} 120deg,
      ${hexToRgba('#00ffb4', 0.06)} 150deg,
      ${hexToRgba('#ff4080', 0.08)} 180deg,
      ${hexToRgba(base, 0.09)} 210deg,
      ${hexToRgba('#ff8000', 0.06)} 240deg,
      ${hexToRgba('#c000ff', 0.08)} 270deg,
      ${hexToRgba('#00ff80', 0.06)} 300deg,
      ${hexToRgba('#ff00c0', 0.07)} 330deg,
      transparent 360deg
    )`;
  }, [accentColor]);

  return (
    <div
      ref={cardRef}
      className={`holo-card ${isHovered ? 'holo-card--active' : ''} ${className}`}
      style={{
        '--holo-border': accentColor,
        '--holo-glow': hexToRgba(accentColor, 0.25),
        '--holo-bg': backgroundColor,
        '--holo-shimmer': hexToRgba(accentColor, 0.15),
        '--shine-x': `${shinePos.x}%`,
        '--shine-y': `${shinePos.y}%`,
        '--holo-radius': `${borderRadius}px`,
        perspective: '1000px',
        transform: `rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* ── Layer 1: Holographic iridescent overlay ── */}
      <div className="holo-iris" style={{ background: irisGradient }} />

      {/* ── Layer 2: Cursor-tracking shine sweep ── */}
      <div
        className="holo-shine"
        style={{
          background: `radial-gradient(circle 120px at var(--shine-x) var(--shine-y), 
            rgba(255,255,255,${isHovered ? 0.3 * intensity : 0.12 * intensity}) 0%, 
            transparent 70%)`,
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ── Layer 3: Animated holographic lines ── */}
      <div className="holo-lines">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="holo-line"
            style={{
              top: `${(i / 7) * 100}%`,
              animationDelay: `${i * 0.2}s`,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${hexToRgba(accentColor, isHovered ? 0.25 : 0.1)} 20%,
                ${hexToRgba(accentColor, isHovered ? 0.4 : 0.15)} 50%, 
                ${hexToRgba(accentColor, isHovered ? 0.25 : 0.1)} 80%,
                transparent 100%)`,
            }}
          />
        ))}
      </div>

      {/* ── Layer 4: Sparkle particles ── */}
      {isHovered && (
        <div className="holo-sparkles">
          {[...Array(sparkleCount)].map((_, i) => (
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
        {children}
      </div>

      {/* ── Bottom decorative bar ── */}
      <div className="holo-bottom-bar" style={{
        background: `linear-gradient(90deg, 
          ${accentColor}00, 
          ${accentColor}, 
          ${accentColor}66, 
          ${accentColor},
          ${accentColor}00)`,
      }}/>
    </div>
  );
}
