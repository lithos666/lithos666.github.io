import BorderGlow from './ui/BorderGlow';
import { useI18n } from '../i18n-context';
import './ContactSection.css';

const ContactSection = () => {
  const { lang } = useI18n();
  const copy = lang === 'en'
    ? {
        eyebrow: 'Let’s talk',
        title: 'Let’s talk about robotics,\nmedical devices and intelligent hardware.',
        location: 'Chongqing, China',
        university: 'Chongqing University · Robotics Engineering',
        subtitle: 'Robotics · Medical Devices · Intelligent Hardware',
        resume: 'Download Resume PDF',
        top: 'Back to top',
        work: 'View projects',
        copyright: '© 2026 Xiao Chuyu · Portfolio',
      }
    : {
        eyebrow: '保持联系',
        title: '欢迎交流机器人、\n医疗器械与智能硬件。',
        location: '中国 · 重庆',
        university: '重庆大学 · 机器人工程',
        subtitle: '机器人 · 医疗器械 · 智能硬件',
        resume: '下载简历 PDF',
        top: '返回顶部',
        work: '查看项目',
        copyright: '© 2026 肖楚煜 · Portfolio',
      };

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
      value: copy.location,
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
      value: copy.university,
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
      value: 'github.com/lithos666',
      href: 'https://github.com/lithos666',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M12 12v6m0 0-3-3m3 3 3-3" />
        </svg>
      ),
      label: 'Resume',
      value: copy.resume,
      href: '/resume/Xiao-Chuyu-Resume.pdf',
      download: true,
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
          <span className="contact-badge">{copy.eyebrow}</span>
          <h2 className="contact-title">{copy.title}</h2>
          <p className="contact-subtitle">
            {copy.subtitle} &nbsp;|&nbsp; thosli666@gmail.com
          </p>
        </div>

        <div className="contact-info-grid">
          {infoItems.map((item, idx) => (
            <BorderGlow
              key={idx}
              className="contact-info-card"
              backgroundColor="#111113"
              borderRadius={24}
            >
              <div className="contact-card-icon">
                {item.icon}
              </div>
              <span className="contact-card-label">{item.label}</span>
              {item.href ? (
                <a href={item.href} className="contact-card-value" target="_blank" rel="noopener noreferrer" download={item.download || undefined}>
                  {item.value}
                </a>
              ) : (
                <span className="contact-card-value">{item.value}</span>
              )}
            </BorderGlow>
          ))}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="footer">
        <div className="footer-content">
          <p>{copy.copyright}</p>
          <div className="footer-links">
            <a href="#hero">{copy.top}</a>
            <span className="separator">·</span>
            <a href="#works">{copy.work}</a>
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
