import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { neighbors } from '../data/topics.js';
import { useApp } from '../hooks/AppContext.jsx';
import LangTabs from './LangTabs.jsx';
import QuizCard from './QuizCard.jsx';
import { Tex } from './Tex.jsx';

const Section = ({ title, children }) => (
  <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-40px' }} className="glass p-5 sm:p-6">
    <h2 className="mb-3 font-display text-lg font-semibold">{title}</h2>
    {children}
  </motion.section>
);

function Example({ ex }) {
  const [vals, setVals] = useState(() => Object.fromEntries(ex.inputs.map((i) => [i.key, i.default])));
  const steps = ex.solve(vals);
  return (
    <div>
      <p className="mb-3">{ex.problem(vals)}</p>
      <div className="mb-3 flex flex-wrap gap-3">
        {ex.inputs.map((i) => (
          <label key={i.key} className="text-sm">{i.label}
            <input type="number" value={vals[i.key]} onChange={(e) => setVals({ ...vals, [i.key]: Number(e.target.value) })} className="ml-2 w-24 rounded-md border bg-transparent px-2 py-1" style={{ borderColor: 'var(--border)' }} />
          </label>
        ))}
        <span className="self-end text-xs" style={{ color: 'var(--muted)' }}>Try with your own numbers</span>
      </div>
      <ol className="list-decimal space-y-1 pl-5">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </div>
  );
}

export default function TopicLayout({ topic, content, Hook, Demo }) {
  const { done, markDone } = useApp();
  const [vars, setVars] = useState({});
  const { prev, next } = neighbors(topic.id);
  const isDone = done.includes(topic.id);
  const ex = content.exam;
  return (
    <article data-unit={topic.unit} className="mx-auto max-w-4xl space-y-5">
      <header className="glass p-5 sm:p-8">
        <p className="text-sm" style={{ color: 'var(--accent)' }}>{topic.unitTitle}</p>
        <h1 className="mt-1 font-display text-2xl font-bold sm:text-4xl">{topic.title}</h1>
        <p className="mt-3 text-lg"><strong>Ek line me:</strong> {topic.ek}</p>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Difficulty: {topic.level}. Time: about {topic.mins} minutes.</p>
      </header>
      <Section title="Visual Hook"><Hook /></Section>
      <Section title="Explanation"><LangTabs hinglish={content.hinglish} english={content.english} /></Section>
      <Section title="Practical Lab"><Demo setVars={setVars} /></Section>
      <Section title="Formula Box">
        <div className="space-y-1">{content.formulas(vars).map((f, i) => <Tex key={i} block>{f}</Tex>)}</div>
      </Section>
      <Section title="Solved Numerical Example"><Example ex={content.example} /></Section>
      <Section title="Exam Corner">
        <h3 className="font-semibold">Write this in the exam</h3>
        <ul className="mb-3 list-disc space-y-1 pl-5">{ex.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
        <h3 className="font-semibold">Key terms</h3>
        <p className="mb-3">{ex.terms.join(', ')}</p>
        <h3 className="font-semibold">Common mistakes</h3>
        <ul className="mb-3 list-disc space-y-1 pl-5">{ex.mistakes.map((p, i) => <li key={i}>{p}</li>)}</ul>
        <h3 className="font-semibold">Likely questions</h3>
        <ul className="list-disc space-y-1 pl-5">{ex.questions.map((p, i) => <li key={i}>{p}</li>)}</ul>
      </Section>
      <Section title="Mini Quiz"><QuizCard questions={content.quiz} onComplete={() => markDone(topic.id)} /></Section>
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => markDone(topic.id)} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: 'var(--accent)' }} aria-pressed={isDone}><CheckCircle2 size={16} />{isDone ? 'Completed' : 'Mark as done'}</button>
      </div>
      <nav className="flex justify-between gap-4 pb-10 text-sm" aria-label="Topic navigation">
        {prev ? <Link className="glass px-4 py-2" to={`/topic/${prev.id}`}>Previous: {prev.title}</Link> : <span />}
        {next ? <Link className="glass px-4 py-2" to={`/topic/${next.id}`}>Next: {next.title}</Link> : <span />}
      </nav>
    </article>
  );
}
