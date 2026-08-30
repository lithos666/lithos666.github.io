import { useI18n } from '../../i18n-context';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useI18n();

  return (
    <button
      className="lang-toggle"
      onClick={toggleLanguage}
      aria-label={lang === 'zh' ? 'Switch to English' : '切换为中文'}
      title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
    >
      <span className={`lang-toggle-lang ${lang === 'zh' ? 'lang-toggle-active' : ''}`}>CN</span>
      <span className="lang-toggle-divider" aria-hidden="true" />
      <span className={`lang-toggle-lang ${lang === 'en' ? 'lang-toggle-active' : ''}`}>EN</span>
    </button>
  );
}
