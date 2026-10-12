import { fmt } from '../lib/algorithms/transform.js';

const show = (v) => (typeof v === 'number' ? fmt(v) : String(v));

/** Live matrix / vector with optional highlighted rows, columns or single cells. */
export default function MatrixBox({ rows, label, hiRows = [], hiCols = [], hiCells = [] }) {
  const cols = rows[0].length;
  const aria = `${label}: ${rows.map((r) => r.map(show).join(', ')).join('; ')}`;
  return (
    <div
      role="img"
      aria-label={aria}
      className="inline-grid font-mono text-sm"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(2.6rem, auto))`,
        borderLeft: '2px solid var(--text)',
        borderRight: '2px solid var(--text)',
        borderRadius: 6,
        padding: '2px 4px',
      }}
    >
      {rows.map((r, i) => r.map((v, j) => {
        const on = hiRows.includes(i) || hiCols.includes(j) || hiCells.some(([a, b]) => a === i && b === j);
        return (
          <span
            key={`${i}-${j}`}
            className="px-1.5 py-0.5 text-center"
            style={{ borderRadius: 4, background: on ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : 'transparent' }}
          >
            {show(v)}
          </span>
        );
      }))}
    </div>
  );
}
