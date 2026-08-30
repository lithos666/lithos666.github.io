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

const NAV_SECTIONS = [
  { href: '#about', labelKey: 'global.nav.about' },
  { href: '#works', labelKey: 'global.nav.projects' },
  { href: '#year-one', labelKey: 'global.nav.archive' },
  { href: '#experience', labelKey: 'global.nav.experience' },
  { href: '#notes', labelKey: 'global.nav.knowledge' },
  { href: '#contact', labelKey: 'global.nav.contact' },
];

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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const mobileToggleRef = React.useRef(null);
  const firstMobileLinkRef = React.useRef(null);
  const sheetId = React.useId();
  const { t, lang } = useI18n();

  const navItems = NAV_SECTIONS.map(item => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;
      const pageBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (pageBottom >= documentHeight - 4) {
        setActiveIndex(NAV_SECTIONS.length - 1);
        return;
      }

      const probeY = window.scrollY + Math.min(window.innerHeight * 0.3, 240);
      let nextIndex = 0;

      NAV_SECTIONS.forEach((item, index) => {
        const section = document.querySelector(item.href);
        if (!section) return;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= probeY) nextIndex = index;
      });

      setActiveIndex(current => current === nextIndex ? current : nextIndex);
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    const main = document.querySelector('main');
    const resizeObserver = typeof ResizeObserver !== 'undefined' && main
      ? new ResizeObserver(scheduleUpdate)
      : null;

    resizeObserver?.observe(main);
    scheduleUpdate();
    const delayedUpdates = [
      window.setTimeout(scheduleUpdate, 250),
      window.setTimeout(scheduleUpdate, 1200),
    ];
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      delayedUpdates.forEach(timeoutId => window.clearTimeout(timeoutId));
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
      window.removeEventListener('load', scheduleUpdate);
    };
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 901px)');
    const closeAtDesktop = event => {
      if (event.matches) setMobileMenuOpen(false);
    };

    mediaQuery.addEventListener('change', closeAtDesktop);
    return () => mediaQuery.removeEventListener('change', closeAtDesktop);
  }, []);

  React.useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const navigateToSection = (event, href, index) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    setActiveIndex(index);
    setMobileMenuOpen(false);
    window.history.replaceState(null, '', href);
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleNavClick = (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    const index = NAV_SECTIONS.findIndex(item => item.href === href);
    if (index >= 0) navigateToSection(e, href, index);
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="navbar-inner">
          <a href="#hero" className="nav-logo" data-hover>
            <span className="logo-mark">X</span>
            <span className="logo-text">Xiao Chuyu</span>
          </a>
          <div className="nav-gooey-wrapper" onClick={handleNavClick}>
            <GooeyNav
              items={navItems}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
            />
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
            <button
              ref={mobileToggleRef}
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
              type="button"
              aria-label={mobileMenuOpen
                ? (lang === 'zh' ? '关闭导航菜单' : 'Close navigation menu')
                : (lang === 'zh' ? '打开导航菜单' : 'Open navigation menu')}
              aria-expanded={mobileMenuOpen}
              aria-controls={sheetId}
              onClick={() => setMobileMenuOpen(open => !open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.nav>

      <div
        className={`mobile-nav-layer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />
        <nav
          id={sheetId}
          className="mobile-nav-sheet"
          aria-label={lang === 'zh' ? '移动端导航' : 'Mobile navigation'}
        >
          <div className="mobile-nav-heading">
            <span>{lang === 'zh' ? '浏览作品集' : 'Explore portfolio'}</span>
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(navItems.length).padStart(2, '0')}</span>
          </div>
          <div className="mobile-nav-links">
            {navItems.map((item, index) => (
              <a
                ref={index === 0 ? firstMobileLinkRef : null}
                key={item.href}
                href={item.href}
                className={activeIndex === index ? 'is-active' : ''}
                aria-current={activeIndex === index ? 'page' : undefined}
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={event => navigateToSection(event, item.href, index)}
              >
                <span className="mobile-nav-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{item.label}</span>
                <span className="mobile-nav-arrow" aria-hidden="true">↘</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
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
