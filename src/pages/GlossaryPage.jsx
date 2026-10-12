import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import GlossaryTooltip from '../components/GlossaryTooltip.jsx';
import { GLOSSARY } from '../data/glossary.js';
import { UNITS } from '../data/topics.js';

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('');
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return GLOSSARY.filter((entry) => {
      const starts = !letter || entry.term[0].toUpperCase() === letter;
      const matches = !needle || `${entry.term} ${entry.hinglish} ${entry.english}`.toLowerCase().includes(needle);
      return starts && matches;
    });
  }, [letter, query]);
  const letters = [...new Set(GLOSSARY.map((entry) => entry.term[0].toUpperCase()))].sort();

  return (
    <article className="mx-auto max-w-4xl space-y-5">
      <header>
        <p className="text-sm" style={{ color: 'var(--accent)' }}>Study tools</p>
        <h1 className="font-display text-3xl font-bold">Glossary</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Short Hinglish and English meanings for syllabus terms. Focus or tap a term for a reusable quick definition.</p>
      </header>
      <label className="glass flex items-center gap-3 px-4 py-3">
        <Search size={18} aria-hidden />
        <span className="sr-only">Search glossary</span>
        <input value={query} onChange={(e) => { setQuery(e.target.value); setLetter(''); }} className="w-full bg-transparent outline-none" placeholder="Search a term or meaning" />
      </label>
      <nav aria-label="Filter glossary by letter" className="flex flex-wrap gap-1">
        <button type="button" aria-pressed={!letter} onClick={() => setLetter('')} className="rounded border px-2 py-1 text-sm" style={{ borderColor: 'var(--border)' }}>A–Z</button>
        {letters.map((value) => <button key={value} type="button" aria-pressed={letter === value} onClick={() => { setLetter(value); setQuery(''); }} className="rounded border px-2 py-1 text-sm" style={{ borderColor: letter === value ? 'var(--accent)' : 'var(--border)' }}>{value}</button>)}
      </nav>
      {filtered.length === 0 && <p className="glass p-4">No glossary terms match that search.</p>}
      <div className="space-y-3">
        {filtered.map((entry) => {
          const unit = UNITS.find((item) => item.id === entry.unit);
          return (
            <article key={entry.term.toLowerCase()} data-unit={entry.unit} className="glass grid gap-2 p-4 sm:grid-cols-[minmax(10rem,1fr)_2fr]">
              <h2 className="font-semibold"><GlossaryTooltip term={entry.term}>{entry.term}</GlossaryTooltip></h2>
              <div className="space-y-1 text-sm">
                <p><strong>Hinglish:</strong> {entry.hinglish}</p>
                <p style={{ color: 'var(--muted)' }}><strong>English:</strong> {entry.english}</p>
                <Link to={`/topic/${entry.topicId}`} className="inline-block text-xs underline">{unit?.title ?? 'Related topic'}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </article>
  );
}
