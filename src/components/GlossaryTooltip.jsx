import { useState } from 'react';
import { glossaryDefinition } from '../data/glossary.js';

export default function GlossaryTooltip({ term, children }) {
  const [open, setOpen] = useState(false);
  const entry = glossaryDefinition(term);
  const id = `glossary-${term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={open && entry ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="cursor-help border-b border-dotted text-left"
        style={{ borderColor: 'var(--accent)', color: 'inherit' }}
      >
        {children ?? term}
      </button>
      {open && (
        <span id={id} role="tooltip" className="absolute bottom-full left-0 z-40 mb-2 w-64 rounded-xl border p-3 text-left text-xs shadow-lg" style={{ borderColor: 'var(--border)', background: 'var(--bg-2)', color: 'var(--text)' }}>
          {entry ? <><strong className="block" style={{ color: 'var(--accent)' }}>{entry.term}</strong><span className="mt-1 block">{entry.hinglish}</span><span className="mt-1 block" style={{ color: 'var(--muted)' }}>{entry.english}</span></> : <span>{term}</span>}
        </span>
      )}
    </span>
  );
}
