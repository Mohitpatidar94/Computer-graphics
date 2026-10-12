import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { UNITS, ALL_TOPICS } from '../data/topics.js';
import { useApp } from '../hooks/AppContext.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function Home() {
  const { done, lastTopicId } = useApp();
  const resume = ALL_TOPICS.find((topic) => topic.id === lastTopicId);
  const next = ALL_TOPICS.find((t) => !done.includes(t.id)) || ALL_TOPICS[0];
  const destination = resume || next;
  return (
    <div className="mx-auto max-w-4xl" data-unit="1">
      <section className="glass overflow-hidden p-5 sm:p-8">
        <HeroCanvas />
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">Computer Graphics, samajh aa jaye dekhte hi.</h1>
        <p className="mt-3 max-w-xl" style={{ color: 'var(--muted)' }}>
          Every topic starts with a moving picture, then Hinglish, then simple English, then a live lab you can play with. Built for the university exam, from zero.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link to={`/topic/${destination.id}`} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-transform hover:scale-105 active:scale-95" style={{ background: 'var(--accent)', color: '#0B1020' }}>
            {resume ? 'Continue where you left off' : done.length ? 'Continue learning' : 'Start from Unit 0'} <ArrowRight size={18} />
          </Link>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Press Ctrl+K to jump to any topic</span>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}><span>Learning progress</span><span>{done.length} / {ALL_TOPICS.length} topics</span></div>
          <ProgressBar value={done.length} max={ALL_TOPICS.length} label="Overall progress" />
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Units">
        {UNITS.map((u, i) => {
          const d = u.topics.filter((t) => done.includes(t.id)).length;
          return (
            <motion.div key={u.id} data-unit={u.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={`/topic/${u.topics[0].id}`} className="glass block h-full p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
                <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--accent)' }}>{u.title}</h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{u.tag}</p>
                <p className="mt-3 text-sm">{u.topics.length} topics, {d} done</p>
                <div className="mt-3"><ProgressBar value={d} max={u.topics.length} label={`${u.title} progress`} /></div>
              </Link>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
