import { Component } from 'react';
import './HeroSection.css';

/* ═══════════════════════════════════════════════════════
   Error Boundary — 捕获子组件运行时错误防止白屏
   ═══════════════════════════════════════════════════════ */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#000814',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-main)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
              Goodent Portfolio
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Loading...</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════════════
   Hero Section — Cinematic Video Backdrop
   
   Full-screen video background with noise texture overlay
   and gradient fade. Content layer sits on top.
   ═══════════════════════════════════════════════════════ */
export default function HeroSection() {
  return (
    <ErrorBoundary>
      {/* ═══ FIXED VIDEO BACKDROP ═══ */}
      <div className="blackhole-backdrop">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video-bg"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />
        {/* Noise texture overlay */}
        <div className="noise-overlay" />
        {/* Gradient overlay */}
        <div className="hero-video-gradient" />

      </div>
      <section id="hero" className="hero-section">
        <div className="hero-overlay">
          <div className="glass-chip hero-top-chip">
            <span className="chip-label">Portfolio 肖楚煜</span>
            <span className="chip-divider" />
            <span className="chip-year">2023 – 2026</span>
          </div>

          <div className="hero-bottom-row">
            <div className="glass-chip hero-contact-chip">
              <span className="contact-item">肖楚煜</span>
              <span className="contact-item contact-sub">thosli666@gmail.com</span>
            </div>

            <a href="#works" className="glass-chip hero-scroll-chip">
              <span className="scroll-label">Scroll</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
