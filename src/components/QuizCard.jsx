import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';

export default function QuizCard({ questions = [], onComplete = () => {} }) {
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  if (!questions.length) return <p style={{ color: 'var(--muted)' }}>No questions are available yet.</p>;

  const score = questions.reduce((total, question, i) => total + (answers[i] === question.answer ? 1 : 0), 0);
  const allAnswered = questions.every((_, i) => Number.isInteger(answers[i]));
  const finish = () => {
    if (!allAnswered) return;
    setFinished(true);
    onComplete();
  };
  const reset = () => { setAnswers({}); setFinished(false); };

  return (
    <div className="space-y-5">
      {questions.map((question, qi) => (
        <fieldset key={`${qi}-${question.q}`} className="space-y-2">
          <legend className="font-medium">{qi + 1}. {question.q}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options.map((option, oi) => {
              const selected = answers[qi] === oi;
              const revealed = finished;
              const correct = oi === question.answer;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => !finished && setAnswers((current) => ({ ...current, [qi]: oi }))}
                  className="rounded-xl border px-3 py-2 text-left text-sm"
                  style={{
                    borderColor: revealed && correct ? 'var(--accent)' : 'var(--border)',
                    background: selected ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
                  }}
                >
                  {option}
                  {revealed && correct && <Check className="ml-2 inline" size={15} aria-label="Correct answer" />}
                  {revealed && selected && !correct && <X className="ml-2 inline" size={15} aria-label="Incorrect answer" />}
                </button>
              );
            })}
          </div>
          {finished && <p className="text-sm" style={{ color: 'var(--muted)' }}>{question.why}</p>}
        </fieldset>
      ))}
      {finished ? (
        <div className="flex flex-wrap items-center gap-3" role="status">
          <strong>{score} / {questions.length} correct</strong>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border)' }}>
            <RotateCcw size={14} /> Try again
          </button>
        </div>
      ) : (
        <button type="button" onClick={finish} disabled={!allAnswered} className="rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ background: 'var(--accent)', color: '#0B1020' }}>
          Check answers
        </button>
      )}
    </div>
  );
}
