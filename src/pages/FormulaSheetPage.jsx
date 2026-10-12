import { useMemo, useState } from 'react';
import { Check, Copy, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UNITS } from '../data/topics.js';
import { FORMULAS } from '../data/formulas.js';
import { Tex } from '../components/Tex.jsx';

export default function FormulaSheetPage() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');
  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return UNITS.map((unit) => ({
      ...unit,
      formulas: FORMULAS.filter((formula) => {
        if (formula.unit && formula.unit !== unit.id) return false;
        const topic = unit.topics.find((item) => item.id === formula.topicId);
        const text = `${formula.title} ${formula.latex} ${topic?.title ?? ''}`.toLowerCase();
        return !needle || text.includes(needle);
      }),
    })).filter((unit) => unit.formulas.length);
  }, [query]);

  const copy = async (formula) => {
    setError('');
    try {
      await navigator.clipboard.writeText(formula.latex);
      setCopied(formula.id);
      window.setTimeout(() => setCopied((current) => current === formula.id ? '' : current), 1600);
    } catch {
      setError('Copy is unavailable in this browser context. Select the formula text and copy it manually.');
    }
  };

  return (
    <article className="mx-auto max-w-4xl space-y-5">
      <header>
        <p className="text-sm" style={{ color: 'var(--accent)' }}>Study tools</p>
        <h1 className="font-display text-3xl font-bold">Formula Sheet</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Search equations and matrices across the syllabus. Copy LaTeX for your notes.</p>
      </header>
      <label className="glass flex items-center gap-3 px-4 py-3">
        <Search size={18} aria-hidden />
        <span className="sr-only">Search formulas</span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Search e.g. Bresenham, clipping, rotation" />
      </label>
      {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
      {groups.length === 0 && <p className="glass p-5">No formula matches “{query}”. Try a different term.</p>}
      {groups.map((unit) => (
        <section key={unit.id} data-unit={unit.id} className="space-y-3">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>{unit.title}</h2>
          {unit.formulas.map((formula) => {
            const topic = unit.topics.find((item) => item.id === formula.topicId);
            return (
              <article key={formula.id} className="glass flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{formula.title}</h3>
                  <div className="mt-2 overflow-x-auto"><Tex block>{formula.latex}</Tex></div>
                  {topic && <Link to={`/topic/${topic.id}`} className="mt-2 inline-block text-xs underline" style={{ color: 'var(--muted)' }}>{topic.title}</Link>}
                </div>
                <button type="button" onClick={() => copy(formula)} aria-label={`Copy ${formula.title} LaTeX`} className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border)' }}>
                  {copied === formula.id ? <Check size={15} /> : <Copy size={15} />}{copied === formula.id ? 'Copied' : 'Copy'}
                </button>
              </article>
            );
          })}
        </section>
      ))}
    </article>
  );
}
