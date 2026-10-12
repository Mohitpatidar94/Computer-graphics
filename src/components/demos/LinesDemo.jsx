import { useEffect, useMemo, useState } from 'react';
import PixelGrid from '../PixelGrid.jsx';
import AlgoStepper from '../AlgoStepper.jsx';
import AlgoPanel from '../AlgoPanel.jsx';
import { useStepper } from '../../hooks/useStepper.js';
import { ddaSteps, bresenhamSteps, collectPixels, DDA_CODE, BRESENHAM_CODE } from '../../lib/algorithms/line.js';

const COLS = 24;
const ROWS = 14;
const clamp = (v, hi) => Math.max(0, Math.min(hi, Math.round(Number(v) || 0)));
const bd = { borderColor: 'var(--border)' };

export default function LinesDemo({ setVars }) {
  const [p, setP] = useState({ x1: 2, y1: 2, x2: 19, y2: 9 });
  const [mode, setMode] = useState('bresenham'); // dda | bresenham | compare
  const [pick, setPick] = useState(0);
  const { x1, y1, x2, y2 } = p;

  const single = mode === 'dda' ? ddaSteps : bresenhamSteps;
  const steps = useMemo(() => [...single(x1, y1, x2, y2)], [single, x1, y1, x2, y2]);
  const st = useStepper(steps);
  const lit = steps.slice(0, st.idx + 1).filter((s) => s.plot).map((s) => ({ x: s.x, y: s.y }));
  const mark = lit.at(-1);

  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const p0 = 2 * Math.min(dx, dy) - Math.max(dx, dy);
  useEffect(() => setVars({ dx, dy, p0, steps: Math.max(dx, dy) }), [dx, dy, p0, setVars]);

  const A = useMemo(() => collectPixels(ddaSteps(x1, y1, x2, y2)), [x1, y1, x2, y2]);
  const B = useMemo(() => collectPixels(bresenhamSteps(x1, y1, x2, y2)), [x1, y1, x2, y2]);
  const setA = new Set(A.map(String));
  const diff = B.filter((q) => !setA.has(String(q))).length;
  const toLit = (arr) => arr.map(([x, y]) => ({ x, y }));
  const ideal = [[x1, y1, x2, y2]];

  const onCell = (x, y) => {
    setP(pick === 0 ? { ...p, x1: x, y1: y } : { ...p, x2: x, y2: y });
    setPick(1 - pick);
  };
  const field = (k, hi) => (
    <label className="text-sm">{k}
      <input type="number" value={p[k]} min="0" max={hi} onChange={(e) => setP({ ...p, [k]: clamp(e.target.value, hi) })} className="ml-1 w-14 rounded-md border bg-transparent px-1 py-0.5" style={bd} aria-label={k} />
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Algorithm">
        {[['dda', 'DDA'], ['bresenham', 'Bresenham'], ['compare', 'Compare both']].map(([k, l]) => (
          <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)} className="rounded-full border px-3 py-1.5 text-sm" style={{ ...bd, background: mode === k ? 'var(--accent)' : 'transparent', color: mode === k ? '#0B1020' : 'var(--text)' }}>{l}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">{field('x1', COLS - 1)}{field('y1', ROWS - 1)}{field('x2', COLS - 1)}{field('y2', ROWS - 1)}</div>
      <p className="text-xs" style={{ color: 'var(--muted)' }}>Tap the grid to set the {pick === 0 ? 'start' : 'end'} point. Taps alternate between start and end. White dashed line = the ideal line.</p>

      {mode !== 'compare' ? (
        <>
          <PixelGrid cols={COLS} rows={ROWS} lit={lit} ideal={ideal} mark={mark} onCell={onCell} label={`${mode} line on pixel grid`} />
          <AlgoStepper s={st} />
          <AlgoPanel code={mode === 'dda' ? DDA_CODE : BRESENHAM_CODE} stepper={st} />
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div><h4 className="mb-1 text-sm font-semibold">DDA ({A.length} pixels)</h4><PixelGrid cols={COLS} rows={ROWS} lit={toLit(A)} ideal={ideal} onCell={onCell} label="DDA result" /></div>
            <div><h4 className="mb-1 text-sm font-semibold">Bresenham ({B.length} pixels)</h4><PixelGrid cols={COLS} rows={ROWS} lit={toLit(B)} ideal={ideal} onCell={onCell} label="Bresenham result" /></div>
          </div>
          <p className="text-sm">{diff === 0 ? 'Both lit exactly the same pixels here.' : `${diff} pixel(s) differ.`} Both show jaggies on slanted lines because pixels are square and the line is perfectly thin. DDA uses {Math.max(dx, dy)} floating-point additions plus rounding. Bresenham uses integer additions only.</p>
        </>
      )}
    </div>
  );
}
