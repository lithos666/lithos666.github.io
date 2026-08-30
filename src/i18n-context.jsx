/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translations } from './i18n-translations';

// Default to Chinese if browser language is detected as Chinese
const DEFAULT_LANGUAGE = 'zh';

const I18nContext = createContext({});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Check localStorage first
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('preferred-lang') : null;
    if (stored === 'zh' || stored === 'en') return stored;

    // Fall back to browser language detection
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    // Persist preference to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferred-lang', lang);
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = lang === 'zh'
      ? '肖楚煜｜机器人工程作品集'
      : 'Xiao Chuyu | Robotics Engineering Portfolio';
  }, [lang]);

  const t = (key, values = {}) => {
    const value = translations[key]?.[lang];
    if (!value) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    if (Array.isArray(value)) {
      throw new Error(`Use tArray() for array keys: ${key}`);
    }

    // Simple template replacement for special tags like <GPA>, <Rank>
    let text = value.replace(/\{\{(\w+)\}\}/g, (_, k) => values[k] ?? '');
    text = text.replace(/<\/?em>/g, (match) => match.replace(/em/g, ''));

    return text;
  };

  const tArray = (key, index = 0) => {
    const value = translations[key]?.[lang];
    if (!value || !Array.isArray(value)) {
      console.warn(`Invalid array translation for key: ${key}`);
      return [];
    }
    return value[index];
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <I18nContext.Provider value={{ lang, t, tArray, toggleLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}
I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
