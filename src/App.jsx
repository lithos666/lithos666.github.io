import React, { lazy, Suspense } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/ui/CustomCursor';
import HeroSection from './components/HeroSection';
import WorksSection from './components/WorksSection';

// ── Lazy load below-fold sections for faster initial paint ──
const YearOneProjects = lazy(() => import('./components/YearOneProjects'));
const YearTwoProjects = lazy(() => import('./components/YearTwoProjects'));
const YearThreeProjects = lazy(() => import('./components/YearThreeProjects'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const KnowledgeBase = lazy(() => import('./components/KnowledgeBase'));
const ContactSection = lazy(() => import('./components/ContactSection'));

// Minimal loading fallback
const SectionSkeleton = () => (
  <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: 'rgba(255,255,255,0.6)', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

import './App.css';

function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="navbar-inner">
        <a href="#hero" className="nav-logo" data-hover>
          <span className="logo-mark">G</span>
          <span className="logo-text">Goodent</span>
        </a>
        <ul className="nav-links">
          <li><a href="#works" data-hover>项目</a></li>
          <li><a href="#year-one" data-hover>大一作品集</a></li>
          <li><a href="#year-two" data-hover>大二作品集</a></li>
          <li><a href="#year-three" data-hover>大三作品集</a></li>
          <li><a href="#about" data-hover>关于</a></li>
          <li><a href="#knowledge" data-hover>知识库</a></li>
          <li><a href="#contact" data-hover>联系</a></li>
        </ul>
      </div>
    </motion.nav>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <SmoothScroll>
      <CustomCursor />

      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <WorksSection />
        <Suspense fallback={<SectionSkeleton />}>
          <YearOneProjects />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <YearTwoProjects />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <YearThreeProjects />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <KnowledgeBase />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>
    </SmoothScroll>
  );
}
