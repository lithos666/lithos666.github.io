/**
 * MetallicPaint — 金属光泽文字效果
 *
 * 使用 CSS gradient animation 实现缓慢流动的金属光泽。
 * 克制运用：仅用于 section 标题，不滥用。
 * 
 * Inspired by reactbits.dev/animations/metallic-paint
 */

import React from 'react';
import './MetallicPaint.css';

export default function MetallicPaint({ children, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={`metallic-paint ${className}`}>
      {children}
    </Tag>
  );
}
