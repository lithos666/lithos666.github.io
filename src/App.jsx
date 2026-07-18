import React, { lazy, Suspense } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/ui/CustomCursor';
import GooeyNav from './components/ui/GooeyNav';
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

// Navigation items for GooeyNav
const NAV_ITEMS = [
  { href: '#works', label: '项目' },
  { href: '#year-one', label: '大一' },
  { href: '#year-two', label: '大二' },
  { href: '#year-three', label: '大三' },
  { href: '#about', label: '关于' },
  { href: '#knowledge', label: '知识库' },
  { href: '#contact', label: '联系' },
];

function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
        <div className="nav-gooey-wrapper" onClick={handleNavClick}>
          <GooeyNav items={NAV_ITEMS} initialActiveIndex={0} />
        </div>
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
