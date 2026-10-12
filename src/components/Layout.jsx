import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { UNITS, EXTRA_PAGES, ALL_TOPICS } from '../data/topics.js';
import { useApp } from '../hooks/AppContext.jsx';
import CommandPalette from './CommandPalette.jsx';
import ProgressBar from './ProgressBar.jsx';

const LANGS = [['hinglish', 'Hinglish'], ['english', 'Easy English'], ['both', 'Both']];

function Sidebar({ onNavigate }) {
  const { done } = useApp();
  return (
    <nav aria-label="Topics" className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <ProgressBar value={done.length} max={ALL_TOPICS.length} label="Overall progress" />
      {UNITS.map((u) => (
        <section key={u.id} data-unit={u.id}>
          <h2 className="mb-1 text-xs font-semibold" style={{ color: 'var(--accent)' }}>{u.title}</h2>
          <ul>
            {u.topics.map((tp) => (
              <li key={tp.id}>
                <NavLink
                  to={`/topic/${tp.id}`}
                  onClick={onNavigate}
                  className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm"
                  style={({ isActive }) => ({ background: isActive ? 'var(--border)' : 'transparent', color: isActive ? 'var(--text)' : 'var(--muted)' })}
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: 'var(--accent)' }} aria-label={done.includes(tp.id) ? 'Completed' : 'Not completed'}>
                    {done.includes(tp.id) && <Check size={11} />}
                  </span>
                  <span>{tp.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section>
        <h2 className="mb-1 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Study tools</h2>
        {EXTRA_PAGES.map((p) => (
          <NavLink key={p.path} to={p.path} onClick={onNavigate} className="block rounded-lg px-2 py-1.5 text-sm" style={{ color: 'var(--muted)' }}>{p.title}</NavLink>
        ))}
      </section>
    </nav>
  );
}

export default function Layout() {
  const { lang, setLang, theme, setTheme } = useApp();
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-30 flex items-center gap-3 rounded-none border-x-0 border-t-0 px-3 py-2">
        <button className="lg:hidden" aria-label="Open topic menu" onClick={() => setDrawer(true)}><Menu /></button>
        <NavLink to="/" className="font-display text-sm font-semibold sm:text-base">Computer Graphics and Multimedia</NavLink>
        <div className="ml-auto flex items-center gap-2">
          <div role="group" aria-label="Language" className="flex overflow-hidden rounded-full border text-xs" style={{ borderColor: 'var(--border)' }}>
            {LANGS.map(([k, label]) => (
              <button key={k} aria-pressed={lang === k} onClick={() => setLang(k)} className="px-2.5 py-1.5 transition-colors" style={{ background: lang === k ? 'var(--accent)' : 'transparent', color: lang === k ? '#0B1020' : 'var(--text)' }}>{label}</button>
            ))}
          </div>
          <button aria-label="Search topics (Ctrl+K)" onClick={() => setPalette(true)} className="rounded-full p-2"><Search size={18} /></button>
          <button aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full p-2">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-[49px] hidden h-[calc(100vh-49px)] w-72 shrink-0 border-r lg:block" style={{ borderColor: 'var(--border)' }}>
          <Sidebar />
        </aside>
        <AnimatePresence>
          {drawer && (
            <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
              <motion.div className="glass absolute left-0 top-0 h-full w-72 rounded-none" initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }} transition={{ type: 'tween', duration: 0.2 }}>
                <button className="absolute right-3 top-3" aria-label="Close menu" onClick={() => setDrawer(false)}><X /></button>
                <div className="pt-8"><Sidebar onNavigate={() => setDrawer(false)} /></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="min-w-0 flex-1 p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}
