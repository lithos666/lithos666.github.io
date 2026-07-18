import { useRef, useEffect, useState } from 'react';

/**
 * MetallicText — 金属光泽文字效果 (Apple-style restrained)
 * 
 * 基于 Canvas 2D 绘制文字，通过线性渐变 + 动画实现微妙的
 * 金属光泽流动效果。仅用于 Hero 标题等重点位置。
 * 
 * Props:
 * - text: 要显示的文字
 * - className: 额外 CSS 类名
 * - fontSize: 字号 (px 或 clamp 字符串)
 * - fontWeight: 字重
 */
export default function MetallicText({
  text,
  className = '',
  fontSize = '48px',
  fontWeight = 800,
  style = {},
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const textRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Measure text
    const measure = () => {
      const el = textRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.ceil(rect.width);
      const h = Math.ceil(rect.height);
      setDims({ w, h });
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    measure();

    // Animation loop
    let time = 0;
    const draw = () => {
      if (!canvas.width || !canvas.height) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const computedStyle = window.getComputedStyle(textRef.current);
      const fontFamily = computedStyle.fontFamily || 'Inter, sans-serif';
      const computedFontSize = computedStyle.fontSize || fontSize;

      ctx.font = `${fontWeight} ${computedFontSize} ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const cx = canvas.width / (2 * dpr);
      const cy = canvas.height / (2 * dpr);

      // Metallic gradient — subtle silver-to-white shimmer
      const gradX = cx + Math.sin(time * 0.8) * cx * 0.6;
      const grad = ctx.createLinearGradient(
        gradX - cx * 0.8, 0,
        gradX + cx * 0.8, canvas.height / dpr
      );

      // Core metallic colors — silver, white highlight, steel blue accent
      grad.addColorStop(0, 'rgba(180, 190, 210, 0.9)');
      grad.addColorStop(0.3, 'rgba(240, 245, 255, 0.95)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.7, 'rgba(200, 210, 230, 0.92)');
      grad.addColorStop(1, 'rgba(160, 175, 200, 0.85)');

      ctx.fillStyle = grad;
      ctx.fillText(text, cx, cy);

      // Subtle specular highlight that moves across
      const specX = cx + Math.sin(time * 1.2 + 1) * cx * 0.5;
      const specGrad = ctx.createRadialGradient(
        specX, cy * 0.8, 0,
        specX, cy * 0.8, cx * 0.5
      );
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = specGrad;
      ctx.fillText(text, cx, cy);

      ctx.restore();

      time += 0.016;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [text, fontSize, fontWeight]);

  return (
    <div
      ref={textRef}
      className={`metallic-text-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        fontSize,
        fontWeight,
        ...style,
      }}
    >
      {/* Hidden text for measurement and accessibility */}
      <span
        aria-hidden="false"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      <canvas
        ref={canvasRef}
        style={{
          display: dims.w ? 'block' : 'none',
        }}
      />
    </div>
  );
}
