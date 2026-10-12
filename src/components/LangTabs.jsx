import { useApp } from '../hooks/AppContext.jsx';

export default function LangTabs({ hinglish = [], english = [] }) {
  const { lang } = useApp();
  const sections = lang === 'both'
    ? [['Hinglish', hinglish], ['Easy English', english]]
    : lang === 'english'
      ? [['Easy English', english]]
      : [['Hinglish', hinglish]];

  return (
    <div className={sections.length > 1 ? 'grid gap-5 md:grid-cols-2' : 'space-y-3'}>
      {sections.map(([title, paragraphs]) => (
        <section key={title} aria-label={title}>
          {sections.length > 1 && <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--accent)' }}>{title}</h3>}
          <div className="space-y-3">
            {paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </div>
        </section>
      ))}
    </div>
  );
}
