import { useI18n } from '../../i18n-context';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useI18n();

  return (
    <button
      className="lang-toggle"
      onClick={toggleLanguage}
      aria-label={lang === 'zh' ? '切换为英文' : 'Switch to Chinese'}
      title={lang === 'zh' ? '切换为英文' : 'Switch to Chinese'}
    >
      <span className={`lang-toggle-lang ${lang === 'zh' ? 'lang-toggle-active' : ''}`}>CN</span>
      <span className="lang-toggle-divider" aria-hidden="true" />
      <span className={`lang-toggle-lang ${lang === 'en' ? 'lang-toggle-active' : ''}`}>EN</span>
    </button>
  );
}
