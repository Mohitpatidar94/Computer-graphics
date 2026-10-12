import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getTopic, neighbors } from '../data/topics.js';
import { REGISTRY } from '../components/demos/registry.jsx';
import TopicLayout from '../components/TopicLayout.jsx';
import { useApp } from '../hooks/AppContext.jsx';

export default function TopicPage() {
  const { id } = useParams();
  const topic = getTopic(id);
  const { setLastTopicId } = useApp();
  useEffect(() => { if (topic) setLastTopicId(topic.id); }, [topic, setLastTopicId]);
  if (!topic) return <Navigate to="/" replace />;
  const entry = REGISTRY[id];
  if (entry) return <TopicLayout key={id} topic={topic} content={entry.content} Hook={entry.Hook} Demo={entry.Demo} />;
  const { prev, next } = neighbors(id);
  const phase = { 1: 2, 2: 3, 3: 4 }[topic.unit];
  return (
    <article data-unit={topic.unit} className="mx-auto max-w-3xl">
      <p className="text-sm" style={{ color: 'var(--accent)' }}>{topic.unitTitle}</p>
      <h1 className="font-display text-3xl font-bold">{topic.title}</h1>
      <p className="mt-2">Ek line me: {topic.ek}</p>
      <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>The full lesson for this topic is built in Phase {phase}.</p>
      <nav className="mt-8 flex justify-between" aria-label="Topic navigation">
        {prev ? <Link to={`/topic/${prev.id}`}>Previous: {prev.title}</Link> : <span />}
        {next ? <Link to={`/topic/${next.id}`}>Next: {next.title}</Link> : <span />}
      </nav>
    </article>
  );
}
