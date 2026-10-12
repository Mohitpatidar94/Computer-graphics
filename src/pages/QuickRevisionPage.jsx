import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { ALL_TOPICS, UNITS } from '../data/topics.js';
import { LESSON_CONTENT } from '../data/lessonIndex.js';

const STORAGE_KEY = 'cg-revised-units';

function readRevised() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function saveRevised(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Keep the current session usable if browser storage is disabled.
  }
}

function MiniDiagram({ unit }) {
  const accent = `var(--accent)`;
  return (
    <svg viewBox="0 0 120 42" role="img" aria-label={`Unit ${unit} visual revision`} className="h-10 w-28">
      <path d="M5 34H115M8 36V5" stroke="var(--border)" strokeWidth="2" />
      <path d={unit === '3' ? 'M20 28L42 8L67 24L91 9' : unit === '2' ? 'M17 10L49 10L49 32L17 32ZM49 21H101' : 'M15 30L96 8M26 30L59 9L91 30Z'} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="96" cy="8" r="3" fill={accent} />
    </svg>
  );
}

export default function QuickRevisionPage() {
  const [revised, setRevised] = useState(readRevised);
  const [open, setOpen] = useState(() => new Set(['0']));
  const toggleRevised = (id) => {
    const next = revised.includes(id) ? revised.filter((entry) => entry !== id) : [...revised, id];
    setRevised(next);
    saveRevised(next);
  };
  const toggleOpen = (id) => setOpen((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const reset = () => { setRevised([]); saveRevised([]); };

  return (
    <article className="mx-auto max-w-4xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm" style={{ color: 'var(--accent)' }}>Exam-night mode</p>
          <h1 className="font-display text-3xl font-bold">Quick Revision</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Scan the key points, open a unit when ready, and track each revision locally.</p>
        </div>
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border)' }}><RotateCcw size={14} /> Reset marks</button>
      </header>
      {UNITS.map((unit) => {
        const isOpen = open.has(unit.id);
        const isRevised = revised.includes(unit.id);
        const topics = ALL_TOPICS.filter((topic) => topic.unit === unit.id);
        return (
          <section key={unit.id} data-unit={unit.id} className="glass overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <MiniDiagram unit={unit.id} />
              <button type="button" aria-expanded={isOpen} onClick={() => toggleOpen(unit.id)} className="min-w-0 flex-1 text-left">
                <span className="block font-display font-semibold" style={{ color: 'var(--accent)' }}>{unit.title}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{unit.tag} · {topics.length} topics</span>
              </button>
              <button type="button" onClick={() => toggleRevised(unit.id)} aria-pressed={isRevised} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--accent)' }}>
                {isRevised && <Check size={14} />}{isRevised ? 'Revised' : 'Mark revised'}
              </button>
            </div>
            {isOpen && <div className="space-y-4 border-t p-4" style={{ borderColor: 'var(--border)' }}>
              {topics.map((topic) => {
                const content = LESSON_CONTENT[topic.id];
                return (
                  <article key={topic.id} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="font-semibold">{topic.title}</h3>
                    {content?.exam?.points?.length
                      ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{content.exam.points.slice(0, 5).map((point, i) => <li key={i}>{point}</li>)}</ul>
                      : <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Exam key points have not been added for this topic yet.</p>}
                    {content?.exam?.questions?.length > 0 && <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>Likely: {content.exam.questions.slice(0, 2).join(' · ')}</p>}
                  </article>
                );
              })}
            </div>}
          </section>
        );
      })}
    </article>
  );
}
