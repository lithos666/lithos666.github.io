import React from 'react';
import MetallicPaint from './ui/MetallicPaint';
import HoloCard from './ui/HoloCard';
import './ContactSection.css';

const ContactSection = () => {
  const infoItems = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
      label: 'Email',
      value: 'thosli666@gmail.com',
      href: 'mailto:thosli666@gmail.com',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: 'Location',
      value: '中国 · 重庆',
      href: null,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      label: 'University',
      value: '重庆大学 · 机器人工程',
      href: null,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
      ),
      label: 'GitHub',
      value: 'github.com',
      href: 'https://github.com',
    },
  ];

  return (
    <section id="contact" className="contact-section">
      {/* 背景装饰 */}
      <div className="contact-glow glow-top"></div>
      <div className="contact-glow glow-bottom"></div>

      <div className="contact-container">
        <div className="contact-header">
          <div className="contact-avatar">
            <img src="/avatar-new.png" alt="肖楚煜" />
          </div>
          <span className="contact-badge">CONTACT</span>
          <h2 className="contact-title"><MetallicPaint>肖楚煜</MetallicPaint></h2>
          <p className="contact-subtitle">
            重庆大学 · 机器人工程 &nbsp;|&nbsp; thosli666@gmail.com
          </p>
        </div>

        <div className="contact-info-grid">
          {infoItems.map((item, idx) => (
            <HoloCard
              key={idx}
              className="contact-info-card"
              accentColor="#5E5CE6"
              backgroundColor="#0a0814"
              borderRadius={18}
              intensity={0.5}
              sparkleCount={5}
            >
              <div className="contact-card-icon">
                {item.icon}
              </div>
              <span className="contact-card-label">{item.label}</span>
              {item.href ? (
                <a href={item.href} className="contact-card-value" target="_blank" rel="noopener noreferrer">
                  {item.value}
                </a>
              ) : (
                <span className="contact-card-value">{item.value}</span>
              )}
            </HoloCard>
          ))}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 肖楚煜 · Goodent. All rights reserved.</p>
          <div className="footer-links">
            <a href="#hero">返回顶部</a>
            <span className="separator">·</span>
            <a href="#works">查看作品</a>
          </div>
        </div>
      </footer>

      {/* 返回顶部按钮 */}
      <a href="#hero" className="back-to-top">
        <span>↑</span>
      </a>
    </section>
  );
};

export default ContactSection;
