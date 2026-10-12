import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ALL_TOPICS, EXTRA_PAGES } from '../data/topics.js';

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const nav = useNavigate();

  const items = useMemo(() => {
    const all = [
      ...ALL_TOPICS.map((x) => ({ label: x.title, hint: x.unitTitle, to: `/topic/${x.id}` })),
      ...EXTRA_PAGES.map((x) => ({ label: x.title, hint: 'Page', to: x.path })),
    ];
    const s = q.trim().toLowerCase();
    return (s ? all.filter((i) => i.label.toLowerCase().includes(s)) : all).slice(0, 8);
  }, [q]);

  useEffect(() => {
    if (open) { setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 0); }
  }, [open]);
  useEffect(() => setActive(0), [q]);

  if (!open) return null;
  const go = (item) => { if (item) { nav(item.to); onClose(); } };
  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') go(items[active]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24" onClick={onClose}>
      <div role="dialog" aria-label="Search topics" className="glass w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
          <Search size={18} aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search a topic, e.g. Bresenham"
            aria-label="Search topics"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <ul role="listbox">
          {items.length === 0 && <li className="px-4 py-3 text-sm" style={{ color: 'var(--muted)' }}>No topic matches "{q}". Try a shorter word.</li>}
          {items.map((it, i) => (
            <li key={it.to} role="option" aria-selected={i === active}>
              <button
                className="flex w-full flex-col px-4 py-2 text-left"
                style={{ background: i === active ? 'var(--border)' : 'transparent' }}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(it)}
              >
                <span className="text-sm font-medium">{it.label}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
