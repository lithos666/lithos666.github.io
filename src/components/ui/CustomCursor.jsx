import React, { useEffect, useState, useCallback } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverDetect = (e) => {
      const target = e.target.closest('a, button, [data-hover], .tilt-card, input, textarea');
      setIsHovering(!!target);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleHoverDetect, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleHoverDetect);
    };
  }, [handleMouseMove]);

  return (
    <>
      {/* Main cursor dot — direct follow, zero delay */}
      <div
        className="custom-cursor"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${isHovering ? 0.5 : 1})`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className={`cursor-dot ${isHovering ? 'hovering' : ''}`}
          style={{
            background: isHovering ? 'rgba(124,77,255,0.95)' : '#ffffff',
          }}
        />
      </div>

      {/* Trail ring — very subtle lag (80ms CSS transition) */}
      <div
        className={`cursor-trail ${isHovering ? 'hovering' : ''}`}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${isHovering ? 2.2 : 1})`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
