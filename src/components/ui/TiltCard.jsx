import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({ children, className = '', style = {}, onClick }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card || !card.getBoundingClientRect) return;

    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

    if (glareRef.current && glareRef.current.style) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12), transparent 55%)`;
      glareRef.current.style.opacity = '1';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card && card.style) {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current && glareRef.current.style) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onClick={onClick}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'transform 0.12s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div ref={glareRef} className="tilt-glare" />
    </motion.div>
  );
}
