import { useEffect, useMemo, useState } from 'react';
import PixelGrid from '../PixelGrid.jsx';
import AlgoStepper from '../AlgoStepper.jsx';
import AlgoPanel from '../AlgoPanel.jsx';
import { useStepper } from '../../hooks/useStepper.js';
import { circleSteps, CIRCLE_CODE } from '../../lib/algorithms/circle.js';
import { ellipseSteps, ELLIPSE_CODE } from '../../lib/algorithms/ellipse.js';

export const OCT_COLORS = ['#4FD1FF', '#FFB454', '#FF5CAA', '#B6F25C', '#A78BFA', '#F87171', '#34D399', '#FBBF24'];
const COLS = 29;
const ROWS = 25;
const bd = { borderColor: 'var(--border)' };

const Slider = ({ label, value, min, max, set }) => (
  <label className="flex items-center gap-2 text-sm">{label}: {value}
    <input type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))} aria-label={label} />
  </label>
);

export function CircleDemo({ setVars }) {
  const [r, setR] = useState(9);
  const [cx, setCx] = useState(14);
  const [cy, setCy] = useState(12);
  const [sym, setSym] = useState(8);
  const steps = useMemo(() => [...circleSteps(cx, cy, r)], [cx, cy, r]);
  const st = useStepper(steps);
  useEffect(() => setVars({ r, p0: 1 - r }), [r, setVars]);
  const lit = steps.slice(0, st.idx + 1).filter((s) => s.plot).flatMap((s) => s.pts.filter((p) => p.o < sym).map((p) => ({ x: p.x, y: p.y, c: OCT_COLORS[p.o] })));
  const inGrid = lit.filter((p) => p.x >= 0 && p.x < COLS && p.y >= 0 && p.y < ROWS);
  const cur = st.step?.plot ? { x: st.step.x + cx, y: st.step.y + cy } : undefined;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <Slider label="Radius" value={r} min={1} max={11} set={setR} />
        <Slider label="Centre x" value={cx} min={0} max={COLS - 1} set={setCx} />
        <Slider label="Centre y" value={cy} min={0} max={ROWS - 1} set={setCy} />
      </div>
      <PixelGrid cols={COLS} rows={ROWS} lit={inGrid} mark={cur} label="Midpoint circle on pixel grid" />
      <div>
        <Slider label="Symmetry copies shown" value={sym} min={1} max={8} set={setSym} />
        <div className="mt-2 flex flex-wrap gap-2 text-xs">{OCT_COLORS.map((c, i) => <span key={c} className="flex items-center gap-1 rounded-full border px-2 py-0.5" style={{ ...bd, opacity: i < sym ? 1 : 0.35 }}><i className="inline-block h-3 w-3 rounded-sm" style={{ background: c }} />Octant {i + 1}</span>)}</div>
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>Octant 1 is the one actually computed. The others are mirror copies.</p>
      </div>
      <AlgoStepper s={st} />
      <AlgoPanel code={CIRCLE_CODE} stepper={st} />
    </div>
  );
}

export function EllipseDemo({ setVars }) {
  const [rx, setRx] = useState(10);
  const [ry, setRy] = useState(6);
  const [cx, setCx] = useState(14);
  const [cy, setCy] = useState(12);
  const steps = useMemo(() => [...ellipseSteps(cx, cy, rx, ry)], [cx, cy, rx, ry]);
  const st = useStepper(steps);
  const p10 = ry * ry - rx * rx * ry + (rx * rx) / 4;
  useEffect(() => setVars({ rx, ry, p10 }), [rx, ry, p10, setVars]);
  const shown = steps.slice(0, st.idx + 1);
  const color = (q) => (q === 1 ? '#4FD1FF' : '#FFB454');
  const lit = shown.filter((s) => s.plot).flatMap((s) => s.pts.map((p) => ({ x: p.x, y: p.y, c: color(s.region) })));
  const inGrid = lit.filter((p) => p.x >= 0 && p.x < COLS && p.y >= 0 && p.y < ROWS);
  const sw = shown.find((s) => s.switchPoint);
  const mark = sw ? { x: sw.x + cx, y: sw.y + cy } : st.step?.plot ? { x: st.step.x + cx, y: st.step.y + cy } : undefined;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <Slider label="rx" value={rx} min={1} max={13} set={setRx} />
        <Slider label="ry" value={ry} min={1} max={11} set={setRy} />
        <Slider label="Centre x" value={cx} min={0} max={COLS - 1} set={setCx} />
        <Slider label="Centre y" value={cy} min={0} max={ROWS - 1} set={setCy} />
      </div>
      <PixelGrid cols={COLS} rows={ROWS} lit={inGrid} mark={mark} label="Midpoint ellipse on pixel grid" />
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1 rounded-full border px-2 py-0.5" style={bd}><i className="inline-block h-3 w-3 rounded-sm" style={{ background: '#4FD1FF' }} />Region 1 (x steps)</span>
        <span className="flex items-center gap-1 rounded-full border px-2 py-0.5" style={bd}><i className="inline-block h-3 w-3 rounded-sm" style={{ background: '#FFB454' }} />Region 2 (y steps)</span>
        <span className="rounded-full border px-2 py-0.5" style={bd}>{sw ? `Switch point (${sw.x}, ${sw.y}) outlined` : 'Switch point appears when Region 1 ends'}</span>
        <span className="rounded-full border px-2 py-0.5" style={bd}>Each step plots 4 mirror points</span>
      </div>
      <AlgoStepper s={st} />
      <AlgoPanel code={ELLIPSE_CODE} stepper={st} />
    </div>
  );
}
