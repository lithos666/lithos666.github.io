import { Component, useRef, useEffect } from 'react';
import { useI18n } from '../i18n-context';
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
  const videoRef = useRef(null);
  const { t } = useI18n();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // When video is 1.2s from end, start fade-out transition
      if (video.duration - video.currentTime < 1.2) {
        video.classList.add('video-fading');
      }
    };

    const handleEnded = () => {
      // Reset to beginning and play again
      video.currentTime = 0;
      video.play().catch(() => {});
      // Brief delay then fade back in
      requestAnimationFrame(() => {
        video.classList.remove('video-fading');
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* ═══ FIXED VIDEO BACKDROP ═══ */}
      <div className="hero-backdrop">
        <video
          ref={videoRef}
          autoPlay
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
            <span className="chip-label">{t('hero.chip-portfolio')}</span>
            <span className="chip-divider" />
            <span className="chip-year">{t('hero.chip-years')}</span>
          </div>

          <div className="hero-positioning">
            <span className="hero-positioning-eyebrow">{t('hero.positioning-eyebrow')}</span>
            <h1>{t('hero.positioning-title')}</h1>
            <p>{t('hero.positioning-summary')}</p>

            <div className="hero-proof-row" aria-label={t('hero.proof-label')}>
              <span>{t('hero.proof-education')}</span>
              <span>{t('hero.proof-projects')}</span>
              <span>{t('hero.proof-funding')}</span>
            </div>

            <div className="hero-primary-actions">
              <a href="#works" className="hero-primary-cta">
                {t('hero.cta-projects')}
              </a>
              <a href="/resume/Xiao-Chuyu-Resume.pdf" download className="hero-secondary-cta">
                {t('global.resume-short')}
              </a>
            </div>
          </div>

          <div className="hero-bottom-row">
            <div className="glass-chip hero-contact-chip">
              <span className="contact-item">{t('hero.contact-name')}</span>
              <span className="contact-item contact-sub">{t('hero.contact-email')}</span>
            </div>

            <a href="#works" className="glass-chip hero-scroll-chip">
              <span className="scroll-label">{t('hero.scroll-label')}</span>
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
