import { Link } from 'react-router-dom';
import { UNITS } from '../data/topics.js';

export default function QuizHubPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-5">
      <header><p className="text-sm" style={{ color: 'var(--accent)' }}>Practice</p><h1 className="font-display text-3xl font-bold">Unit-wise Quizzes</h1><p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Questions are drawn from each lesson’s existing quiz data and shuffled for every attempt.</p></header>
      <div className="grid gap-4 sm:grid-cols-2">
        {UNITS.map((unit) => <Link key={unit.id} to={`/quiz/${unit.id}`} data-unit={unit.id} className="glass block p-5 transition-transform hover:-translate-y-1"><h2 className="font-display font-semibold" style={{ color: 'var(--accent)' }}>{unit.title}</h2><p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{unit.tag}</p><p className="mt-3 text-sm">{unit.topics.length} topics · randomized quiz and timer</p></Link>)}
      </div>
      <Link to="/test" className="block rounded-xl p-5 font-semibold" style={{ background: 'var(--accent)', color: '#0B1020' }}>Start the Final Test →</Link>
    </article>
  );
}
