import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const Ctx = createContext(null);

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can fail (private mode); the app still works in memory */
  }
};

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => read('cg-lang', 'both')); // 'hinglish' | 'english' | 'both'
  const [theme, setTheme] = useState(() => read('cg-theme', 'dark'));
  const [done, setDone] = useState(() => read('cg-done', []));
  const [lastTopicId, setLastTopicId] = useState(() => read('cg-last-topic', null));

  useEffect(() => { write('cg-lang', lang); }, [lang]);
  useEffect(() => {
    write('cg-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => { write('cg-done', done); }, [done]);
  useEffect(() => { write('cg-last-topic', lastTopicId); }, [lastTopicId]);

  const markDone = useCallback((id) => setDone((d) => (d.includes(id) ? d : [...d, id])), []);
  const value = useMemo(
    () => ({ lang, setLang, theme, setTheme, done, markDone, lastTopicId, setLastTopicId }),
    [lang, theme, done, markDone, lastTopicId],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
