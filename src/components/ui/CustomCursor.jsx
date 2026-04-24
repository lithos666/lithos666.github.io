import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const lastMoveTime = useRef(0);

  const springConfig = { damping: 26, stiffness: 280, mass: 0.45 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const trailX = useSpring(0, { damping: 38, stiffness: 160, mass: 0.72 });
  const trailY = useSpring(0, { damping: 38, stiffness: 160, mass: 0.72 });

  const handleMouseMove = useCallback((e) => {
    // Throttle: update at most ~60fps equivalent
    const now = performance.now();
    if (now - lastMoveTime.current < 16) return;
    lastMoveTime.current = now;

    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    trailX.set(e.clientX);
    trailY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [isVisible, cursorX, cursorY, trailX, trailY]);

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
      <motion.div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          left: cursorX,
          top: cursorY,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0.5 : 1,
        }}
      >
        <div className={`cursor-dot ${isHovering ? 'hovering' : ''}`} style={{
        background: isHovering ? 'rgba(124,77,255,0.95)' : '#ffffff',
      }} />
      </motion.div>

      <motion.div
        ref={trailRef}
        className="cursor-trail"
        style={{
          left: trailX,
          top: trailY,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 2.5 : 1,
        }}
      />
    </>
  );
}
