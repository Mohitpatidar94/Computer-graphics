import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ALL_TOPICS, UNITS } from '../data/topics.js';
import { LESSON_CONTENT } from '../data/lessonIndex.js';

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getQuestions(unitId) {
  const topics = unitId === 'all' ? ALL_TOPICS : ALL_TOPICS.filter((topic) => topic.unit === unitId);
  const pool = topics.flatMap((topic) => (LESSON_CONTENT[topic.id]?.quiz ?? []).map((question) => ({ ...question, topicId: topic.id, topicTitle: topic.title })));
  return shuffle(pool).map((question) => {
    const options = shuffle(question.options.map((text, index) => ({ text, correct: index === question.answer })));
    return { ...question, options: options.map((option) => option.text), answer: options.findIndex((option) => option.correct) };
  });
}

export default function QuizPage() {
  const { unit: routeUnit } = useParams();
  const unitId = routeUnit ?? 'all';
  const isFinal = unitId === 'all';
  const unit = UNITS.find((item) => item.id === unitId);
  const questions = useMemo(() => getQuestions(unitId), [unitId]);
  const duration = Math.min(isFinal ? 1800 : 900, Math.max(300, questions.length * 45));
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [remaining, setRemaining] = useState(duration);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setStarted(false);
    setFinished(false);
    setRemaining(duration);
    setIndex(0);
    setAnswers({});
  }, [unitId, duration]);

  useEffect(() => {
    if (!started || finished) return undefined;
    if (remaining <= 0) {
      setFinished(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [started, finished, remaining]);

  const question = questions[index];
  const score = questions.reduce((total, item, i) => total + (answers[i] === item.answer ? 1 : 0), 0);
  const breakdown = useMemo(() => {
    const byTopic = new Map();
    questions.forEach((item, i) => {
      const row = byTopic.get(item.topicId) ?? { id: item.topicId, title: item.topicTitle, correct: 0, total: 0 };
      row.total += 1;
      if (answers[i] === item.answer) row.correct += 1;
      byTopic.set(item.topicId, row);
    });
    return [...byTopic.values()].sort((a, b) => a.correct / a.total - b.correct / b.total);
  }, [answers, questions]);
  const weakTopics = breakdown.filter((item) => item.correct / item.total < 0.7);
  const time = `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`;
  const begin = () => { setAnswers({}); setIndex(0); setRemaining(duration); setFinished(false); setStarted(true); };

  if (!isFinal && !unit) return <p role="alert">This unit quiz does not exist. Choose a unit from <Link to="/quizzes" className="underline">quiz selection</Link>.</p>;
  if (!questions.length) return <p>No quiz questions are available for this selection.</p>;

  return (
    <article data-unit={unitId === 'all' ? '3' : unitId} className="mx-auto max-w-3xl space-y-5">
      <header>
        <Link to="/quizzes" className="text-sm underline" style={{ color: 'var(--muted)' }}>All quizzes</Link>
        <h1 className="mt-2 font-display text-3xl font-bold">{isFinal ? 'Final Test' : `${unit.title} Quiz`}</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{questions.length} shuffled questions · {Math.ceil(duration / 60)} minute timer · Quiz data comes from each topic lesson.</p>
      </header>

      {!started && !finished && (
        <section className="glass space-y-4 p-5">
          <p>Questions and answer choices will be shuffled when you start. You can move between questions before submitting.</p>
          <button type="button" onClick={begin} className="rounded-full px-5 py-2 font-semibold" style={{ background: 'var(--accent)', color: '#0B1020' }}>Start {isFinal ? 'final test' : 'unit quiz'}</button>
        </section>
      )}

      {started && !finished && question && (
        <section className="glass space-y-5 p-5">
          <div className="flex flex-wrap justify-between gap-3 text-sm">
            <span>Question {index + 1} of {questions.length} · {question.topicTitle}</span>
            <span role="timer" aria-live="off" className="font-mono" style={{ color: remaining < 60 ? '#fb7185' : 'var(--accent)' }}>Time left {time}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}><div className="h-full" style={{ width: `${((index + 1) / questions.length) * 100}%`, background: 'var(--accent)' }} /></div>
          <fieldset>
            <legend className="mb-4 text-lg font-semibold">{question.q}</legend>
            <div className="grid gap-2">
              {question.options.map((option, optionIndex) => (
                <label key={`${optionIndex}-${option}`} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm" style={{ borderColor: answers[index] === optionIndex ? 'var(--accent)' : 'var(--border)' }}>
                  <input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap justify-between gap-2">
            <button type="button" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))} className="rounded-full border px-3 py-1.5 text-sm disabled:opacity-40" style={{ borderColor: 'var(--border)' }}>Previous</button>
            {index < questions.length - 1
              ? <button type="button" onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))} className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--accent)' }}>Next</button>
              : <button type="button" onClick={() => setFinished(true)} className="rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: 'var(--accent)', color: '#0B1020' }}>Submit test</button>}
          </div>
        </section>
      )}

      {finished && (
        <section className="glass space-y-4 p-5" aria-live="polite">
          <h2 className="font-display text-2xl font-bold">Score: {score} / {questions.length}</h2>
          <p>{Math.round((score / questions.length) * 100)}% correct · {Object.keys(answers).length} answered · {remaining === 0 ? 'Time expired.' : 'Test submitted.'}</p>
          <div><h3 className="font-semibold">Weak topics to revise</h3>
            {weakTopics.length
              ? <ul className="mt-2 list-disc pl-5 text-sm">{weakTopics.map((item) => <li key={item.id}><Link to={`/topic/${item.id}`} className="underline">{item.title}</Link> — {item.correct}/{item.total} correct</li>)}</ul>
              : <p className="mt-2 text-sm">No weak topics found in this attempt. Great work.</p>}
          </div>
          <div><h3 className="font-semibold">Topic breakdown</h3><ul className="mt-2 space-y-1 text-sm">{breakdown.map((item) => <li key={item.id}><Link to={`/topic/${item.id}`} className="underline">{item.title}</Link>: {item.correct}/{item.total}</li>)}</ul></div>
          <button type="button" onClick={begin} className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: 'var(--accent)' }}>Shuffle and retry</button>
        </section>
      )}
    </article>
  );
}
