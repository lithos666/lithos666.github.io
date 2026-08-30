import { useI18n } from '../i18n-context';
import './ProjectCaseStudy.css';

const LABELS = {
  zh: {
    problem: 'Problem',
    role: 'My Role',
    approach: 'Engineering Approach',
    prototype: 'Prototype Evolution',
    validation: 'Validation',
    result: 'Result',
    stage: 'Current Stage',
    evidence: 'Evidence',
  },
  en: {
    problem: 'Problem',
    role: 'My Role',
    approach: 'Engineering Approach',
    prototype: 'Prototype Evolution',
    validation: 'Validation',
    result: 'Result',
    stage: 'Current Stage',
    evidence: 'Evidence',
  },
};

function localize(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
}

function localizedList(value, lang) {
  if (Array.isArray(value)) return value;
  return value?.[lang] || value?.zh || [];
}

function DetailList({ items }) {
  return (
    <ul className="pca-detail-list">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function ProjectCaseStudy({ project }) {
  const { lang } = useI18n();
  const caseStudy = project.caseStudy;
  const labels = LABELS[lang];

  if (!caseStudy) return null;

  const role = localizedList(caseStudy.role, lang);
  const prototype = localizedList(caseStudy.prototype, lang);
  const validation = localizedList(caseStudy.validation, lang);
  const result = localizedList(caseStudy.result, lang);

  return (
    <div className="pca-container">
      <section className="pca-section pca-section--wide">
        <span className="pca-kicker">{labels.problem}</span>
        <p className="pca-problem-text">{localize(caseStudy.problem, lang)}</p>
      </section>

      <div className="pca-two-column">
        <section className="pca-section">
          <span className="pca-kicker">{labels.role}</span>
          <div className="pca-role-list">
            {role.map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="pca-section">
          <span className="pca-kicker">{labels.stage}</span>
          <p className="pca-stage-text">{localize(caseStudy.currentStage, lang)}</p>
        </section>
      </div>

      <section className="pca-section pca-section--wide">
        <span className="pca-kicker">{labels.approach}</span>
        <p className="pca-body-text">{localize(caseStudy.approach?.summary, lang)}</p>
        <div className="pca-tech-stack">
          {caseStudy.approach?.technologies?.map((tech) => <span key={tech}>{tech}</span>)}
        </div>
      </section>

      {prototype.length > 0 && (
        <section className="pca-section pca-section--wide">
          <span className="pca-kicker">{labels.prototype}</span>
          <div className="pca-prototype-flow">
            {prototype.map((item, index) => (
              <div className="pca-prototype-step" key={item}>
                <span className="pca-step-number">{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="pca-two-column">
        <section className="pca-section">
          <span className="pca-kicker">{labels.validation}</span>
          <DetailList items={validation} />
        </section>

        <section className="pca-section">
          <span className="pca-kicker">{labels.result}</span>
          <DetailList items={result} />
        </section>
      </div>

      {caseStudy.evidence?.length > 0 && (
        <section className="pca-section pca-section--wide">
          <span className="pca-kicker">{labels.evidence}</span>
          <div className="pca-evidence-grid">
            {caseStudy.evidence.map((item) => (
              <a href={item.href} target="_blank" rel="noopener noreferrer" key={item.href}>
                <span>{item.type?.toUpperCase() || 'FILE'}</span>
                {localize(item.label, lang)}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
