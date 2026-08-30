import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import LanguageToggle from './components/ui/LanguageToggle';
import GooeyNav from './components/ui/GooeyNav';
import HeroSection from './components/HeroSection';
import PersonalStatement from './components/PersonalStatement';
import WorksSection from './components/WorksSection';
import { I18nProvider, useI18n } from './i18n-context.jsx';
import './App.css';

// ── Lazy load below-fold sections for faster initial paint ──
const YearOneProjects = lazy(() => import('./components/YearOneProjects'));
const YearTwoProjects = lazy(() => import('./components/YearTwoProjects'));
const YearThreeProjects = lazy(() => import('./components/YearThreeProjects'));
const ExperienceJourney = lazy(() => import('./components/ExperienceJourney'));
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

// Navbar component
const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const { t } = useI18n();

  const navItems = [
    { href: '#about', label: t('global.nav.about') },
    { href: '#works', label: t('global.nav.projects') },
    { href: '#year-one', label: t('global.nav.archive') },
    { href: '#experience', label: t('global.nav.experience') },
    { href: '#notes', label: t('global.nav.knowledge') },
    { href: '#contact', label: t('global.nav.contact') },
  ];

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
          <span className="logo-mark">X</span>
          <span className="logo-text">Xiao Chuyu</span>
        </a>
        <div className="nav-gooey-wrapper" onClick={handleNavClick}>
          <GooeyNav items={navItems} initialActiveIndex={0} />
        </div>
        <div className="nav-actions">
          <LanguageToggle />
          <a
            className="nav-resume-link"
            href="/resume/Xiao-Chuyu-Resume.pdf"
            download
          >
            {t('global.resume-short')}
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <SmoothScroll>
        <motion.div
          className="scroll-progress"
        />

        <Navbar />

        <main>
          <HeroSection />
          <PersonalStatement />
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
            <ExperienceJourney />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <KnowledgeBase />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <ContactSection />
          </Suspense>
        </main>
      </SmoothScroll>
    </I18nProvider>
  );
}
