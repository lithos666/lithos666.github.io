import React, { useState } from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加表单提交逻辑
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const socialLinks = [
    { name: 'GitHub', url: '#', icon: '💻' },
    { name: 'LinkedIn', url: '#', icon: '💼' },
    { name: 'Twitter', url: '#', icon: '🐦' },
    { name: 'Instagram', url: '#', icon: '📸' }
  ];

  return (
    <section id="contact" className="contact-section">
      {/* 背景装饰 */}
      <div className="contact-glow glow-top"></div>
      <div className="contact-glow glow-bottom"></div>

      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Let's Create Something Amazing</h2>
          <p className="contact-subtitle">
            Have a project in mind? Let's collaborate and bring your vision to life.
          </p>
        </div>

        <div className="contact-content">
          {/* 联系表单 */}
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <div className="input-underline"></div>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <div className="input-underline"></div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Project Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <div className="input-underline"></div>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-input form-textarea"
                  rows="6"
                ></textarea>
                <div className="input-underline"></div>
              </div>

              <button type="submit" className="submit-btn">
                <span>{submitted ? 'Message Sent!' : 'Send Message'}</span>
                <span className="submit-icon">✈️</span>
              </button>
            </form>

            {/* 成功提示 */}
            {submitted && (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>Thank you! I'll get back to you soon.</p>
              </div>
            )}
          </div>

          {/* 联系信息 */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <a href="mailto:hello@example.com">hello@example.com</a>
            </div>

            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Location</h3>
              <p>Creative Studio, Your City</p>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3>Availability</h3>
              <p>Mon - Fri, 9AM - 6PM</p>
            </div>

            {/* 社交链接 */}
            <div className="social-links">
              <h4>Connect With Me</h4>
              <div className="socials">
                {socialLinks.map((link, idx) => (
                  <a key={idx} href={link.url} className="social-link" title={link.name}>
                    <span className="social-icon">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Creative Portfolio. All rights reserved.</p>
          <div className="footer-links">
            <a href="#hero">Back to top</a>
            <span className="separator">•</span>
            <a href="#works">View Works</a>
          </div>
        </div>

        {/* 返回顶部按钮 */}
        <a href="#hero" className="back-to-top">
          <span>↑</span>
        </a>
      </footer>

      {/* SVG 装饰 */}
      <svg className="contact-decoration" viewBox="0 0 1200 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(177, 62, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(0, 217, 255, 0.15)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="none" stroke="url(#contactGradient)" strokeWidth="1" opacity="0.4" />
        <circle cx="1100" cy="500" r="100" fill="none" stroke="url(#contactGradient)" strokeWidth="1" opacity="0.4" />
        <path d="M 0 300 L 1200 300" stroke="url(#contactGradient)" strokeWidth="1" opacity="0.2" />
      </svg>
    </section>
  );
};

export default ContactSection;
