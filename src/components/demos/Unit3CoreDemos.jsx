import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCanvas } from '../../hooks/useCanvas.js';
import { useStepper } from '../../hooks/useStepper.js';
import { drawGrid, drawPoly, makeView } from '../../lib/drawKit.js';
import {
  DEFAULT_PARAMS, IDENTITY_3, REFLECT_AXES, SHAPES, TRANSFORM_CODE,
  applyToPoint, applyToPoints, buildTransform, fmt, mul, reflect, rotate, scale,
  transformSteps, translate,
} from '../../lib/algorithms/transform.js';
import AlgoPanel from '../AlgoPanel.jsx';
import AlgoStepper from '../AlgoStepper.jsx';
import MatrixBox from '../MatrixBox.jsx';

const button = 'rounded-full border px-3 py-1.5 text-sm';
const border = { borderColor: 'var(--border)' };
const slider = ({ label, value, min, max, step = 1, onChange }) => (
  <label key={label} className="flex min-w-36 flex-1 flex-col gap-1 text-xs">
    <span>{label}: {fmt(value)}</span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
  </label>
);

function MatrixCanvas({ points, ghost = [], ideal = [] , label }) {
  const ref = useCanvas((ctx, w, h, _t, accent, grid, text) => {
    const view = makeView(w, h, 14, 10);
    drawGrid(ctx, view, grid, text);
    if (ghost.length) drawPoly(ctx, view, ghost, { stroke: text, dash: [6, 4], alpha: 0.48 });
    if (ideal.length) drawPoly(ctx, view, ideal, { stroke: '#FFFFFF', dash: [3, 4], alpha: 0.3 });
    if (points.length) drawPoly(ctx, view, points, { stroke: accent, fill: accent, fillAlpha: 0.22 });
  }, [points, ghost, ideal]);
  return <canvas ref={ref} role="img" aria-label={label} className="w-full rounded-xl" style={{ aspectRatio: '7 / 4', background: 'rgba(0,0,0,0.16)' }} />;
}

const TRANSFORM_LABELS = {
  translate: 'Translate', scale: 'Scale', rotate: 'Rotate', shear: 'Shear', reflect: 'Reflect',
};

export function Transform2DDemo({ setVars }) {
  const [kind, setKind] = useState('translate');
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const set = (key, value) => setParams((p) => ({ ...p, [key]: value }));
  const matrix = useMemo(() => buildTransform(kind, params), [kind, params]);
  const result = useMemo(() => applyToPoints(matrix, SHAPES.triangle), [matrix]);
  const steps = useMemo(() => [...transformSteps(SHAPES.triangle, matrix)], [matrix]);
  const playback = useStepper(steps);
  const step = playback.step;

  useEffect(() => {
    const [x, y] = applyToPoint(matrix, SHAPES.triangle[0]);
    setVars({ kind, x: SHAPES.triangle[0][0], y: SHAPES.triangle[0][1], xNew: fmt(x), yNew: fmt(y), count: SHAPES.triangle.length });
  }, [kind, matrix, setVars]);

  const controls = kind === 'translate'
    ? [slider({ label: 'Translate x', value: params.tx, min: -5, max: 5, step: 0.5, onChange: (v) => set('tx', v) }), slider({ label: 'Translate y', value: params.ty, min: -5, max: 5, step: 0.5, onChange: (v) => set('ty', v) })]
    : kind === 'scale'
      ? [slider({ label: 'Scale x', value: params.sx, min: 0.25, max: 2.5, step: 0.05, onChange: (v) => set('sx', v) }), slider({ label: 'Scale y', value: params.sy, min: 0.25, max: 2.5, step: 0.05, onChange: (v) => set('sy', v) })]
      : kind === 'rotate'
        ? [slider({ label: 'Angle (degrees)', value: params.deg, min: -180, max: 180, onChange: (v) => set('deg', v) })]
        : kind === 'shear'
          ? [slider({ label: 'Shear x', value: params.shx, min: -1, max: 1, step: 0.05, onChange: (v) => set('shx', v) }), slider({ label: 'Shear y', value: params.shy, min: -1, max: 1, step: 0.05, onChange: (v) => set('shy', v) })]
          : [<label key="axis" className="text-sm">Reflection axis
            <select value={params.axis} onChange={(e) => set('axis', e.target.value)} className="ml-2 rounded border bg-transparent p-1" style={border}>{REFLECT_AXES.map((axis) => <option key={axis} value={axis}>{axis}</option>)}</select>
          </label>];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Transformation type">
        {Object.entries(TRANSFORM_LABELS).map(([value, label]) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className={button} style={{ ...border, background: kind === value ? 'var(--accent)' : 'transparent', color: kind === value ? '#0B1020' : 'var(--text)' }}>{label}</button>)}
      </div>
      <div className="flex flex-wrap gap-4">{controls}</div>
      <MatrixCanvas points={result} ghost={SHAPES.triangle} label={`${kind} transformation, original shape ghosted`} />
      <div className="grid gap-4 md:grid-cols-2">
        <div><h4 className="mb-2 text-sm font-semibold">Homogeneous matrix</h4><MatrixBox rows={matrix} label={`${kind} matrix`} /></div>
        <div className="overflow-x-auto"><h4 className="mb-2 text-sm font-semibold">Vertex coordinates</h4><table className="text-sm"><thead><tr><th className="px-2 text-left">Vertex</th><th className="px-2">Before</th><th className="px-2">After</th></tr></thead><tbody>{SHAPES.triangle.map((p, i) => <tr key={i}><th className="px-2 text-left">{String.fromCharCode(65 + i)}</th><td className="px-2">({fmt(p[0])}, {fmt(p[1])})</td><td className="px-2">({fmt(result[i][0])}, {fmt(result[i][1])})</td></tr>)}</tbody></table></div>
      </div>
      <AlgoStepper s={playback} />
      <AlgoPanel code={TRANSFORM_CODE} stepper={playback} />
      <p className="text-xs" style={{ color: 'var(--muted)' }}>Current step: {step?.note}</p>
    </div>
  );
}

const HOMOGENEOUS_CODE = [
  'write P as the column vector [x, y, 1]',
  'multiply each row of the 3x3 matrix by P',
  'x_new = row_1 dot P; y_new = row_2 dot P',
  'w_new = row_3 dot P; divide x and y by w',
];

function* homogeneousSteps(x, y, tx, ty) {
  const point = [x, y, 1];
  const matrix = [[1, 0, tx], [0, 1, ty], [0, 0, 1]];
  yield { line: 0, plot: false, vars: { x, y, w: 1 }, note: 'Add the homogeneous coordinate w = 1.' };
  for (let row = 0; row < 3; row += 1) {
    const products = matrix[row].map((value, i) => value * point[i]);
    yield { line: 1, plot: false, vars: { row: row + 1, products, sum: products.reduce((a, b) => a + b, 0) }, note: `Multiply row ${row + 1} by the point column.` };
  }
  const [xNew, yNew, w] = matrix.map((row) => row.reduce((sum, value, i) => sum + value * point[i], 0));
  yield { line: 2, plot: false, vars: { xNew, yNew, w }, note: 'The first two row products give translated x and y.' };
  yield { line: 3, plot: true, x: xNew / w, y: yNew / w, vars: { xNew, yNew, w, result: [xNew / w, yNew / w] }, note: 'Normalize by w; affine translation keeps w = 1.' };
}

export function HomogeneousDemo({ setVars }) {
  const [point, setPoint] = useState({ x: 1, y: 2 });
  const [offset, setOffset] = useState({ tx: 3, ty: 4 });
  const [progress, setProgress] = useState(0);
  const matrix = useMemo(() => [[1, 0, offset.tx], [0, 1, offset.ty], [0, 0, 1]], [offset]);
  const result = [point.x + offset.tx, point.y + offset.ty, 1];
  const steps = useMemo(() => [...homogeneousSteps(point.x, point.y, offset.tx, offset.ty)], [point, offset]);
  const playback = useStepper(steps);

  useEffect(() => setVars({ twoX: point.x, twoY: point.y, newX: result[0], newY: result[1], tx: offset.tx, ty: offset.ty }), [point, offset, setVars]);
  useEffect(() => setProgress(Math.min(steps.length, playback.idx + 1)), [steps.length, playback.idx]);

  const numeric = (label, key, value, setter) => <label className="text-sm">{label}<input type="number" value={value} onChange={(e) => setter((p) => ({ ...p, [key]: Number(e.target.value) || 0 }))} className="ml-2 w-20 rounded border bg-transparent px-2 py-1" style={border} /></label>;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">{numeric('Point x', 'x', point.x, setPoint)}{numeric('Point y', 'y', point.y, setPoint)}{numeric('Translate tx', 'tx', offset.tx, setOffset)}{numeric('Translate ty', 'ty', offset.ty, setOffset)}</div>
      <div className="grid gap-4 rounded-xl border p-3 md:grid-cols-2" style={border}>
        <div><h4 className="mb-2 text-sm font-semibold">2 x 2 cannot add a translation offset</h4><MatrixBox rows={[[1, 0], [0, 1]]} label="2 by 2 identity matrix" /><p className="mt-2 text-sm">At origin, I × (0,0) = (0,0), not ({offset.tx},{offset.ty}).</p></div>
        <div><h4 className="mb-2 text-sm font-semibold">3 x 3 includes the offset column</h4><MatrixBox rows={matrix} label="Homogeneous translation matrix" hiCols={[2]} /><p className="mt-2 text-sm">({point.x},{point.y},1) → ({result[0]},{result[1]},1)</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-3"><span className="text-sm">Step rows: {progress} / {steps.length}</span><button type="button" onClick={() => playback.next()} className={button} style={border}>Multiply next row</button><MatrixBox rows={matrix} label="Matrix with current row highlighted" hiRows={playback.step?.line === 1 ? [Math.min((playback.step.vars?.row ?? 1) - 1, 2)] : []} /></div>
      <div className="flex items-center gap-3"><span className="text-sm">2D linear result: ({point.x}, {point.y})</span><span aria-hidden>→</span><strong>Homogeneous result: ({result[0]}, {result[1]}, 1)</strong></div>
      <AlgoStepper s={playback} />
      <AlgoPanel code={HOMOGENEOUS_CODE} stepper={playback} />
    </div>
  );
}

const COMPOSITION_CODE = [
  'choose the order of transformation matrices',
  'start with the identity matrix M = I',
  'for each card from first to last: M = T_card × M',
  'apply the final M to every vertex',
  'for a pivot P: M = T(P) × R × T(-P)',
];

const cardSpecs = [
  { id: 'rotate', title: 'Rotate about pivot', matrix: (p) => mul(translate(p.px, p.py), mul(rotate(p.deg), translate(-p.px, -p.py))) },
  { id: 'scale', title: 'Scale about pivot', matrix: (p) => mul(translate(p.px, p.py), mul(scale(p.sx, p.sy), translate(-p.px, -p.py))) },
  { id: 'translate', title: 'Translate', matrix: (p) => translate(p.tx, p.ty) },
];

function* compositionSteps(points, cards, finalMatrix) {
  let current = IDENTITY_3;
  yield { line: 1, plot: false, vars: { matrix: 'Identity' }, note: 'Begin with the identity matrix.' };
  for (let i = 0; i < cards.length; i += 1) {
    current = mul(cards[i].matrix, current);
    yield { line: 2, plot: false, vars: { card: cards[i].title, order: i + 1, matrix: current }, note: `Apply ${cards[i].title}; new matrix is placed on the left.` };
  }
  for (let i = 0; i < points.length; i += 1) {
    const result = applyToPoint(finalMatrix, points[i]);
    yield { line: 3, plot: true, x: result[0], y: result[1], vertex: i, vars: { vertex: String.fromCharCode(65 + i), before: points[i], after: result }, note: `Transform vertex ${String.fromCharCode(65 + i)} with the composite matrix.` };
  }
  yield { line: 4, plot: false, final: true, vars: { rule: 'T(P) × R × T(-P)' }, note: 'The rightmost matrix runs first: move to origin, rotate, move back.' };
}

export function CompositionDemo({ setVars }) {
  const [cards, setCards] = useState(cardSpecs);
  const [params, setParams] = useState({ px: 1, py: 1, deg: 90, sx: 2, sy: 1.5, tx: 2, ty: 1 });
  const set = (key, value) => setParams((p) => ({ ...p, [key]: value }));
  const ordered = useMemo(() => cards.map((card) => ({ ...card, matrix: card.matrix(params) })), [cards, params]);
  const matrix = useMemo(() => ordered.reduce((acc, card) => mul(card.matrix, acc), IDENTITY_3), [ordered]);
  const result = useMemo(() => applyToPoints(matrix, SHAPES.triangle), [matrix]);
  const steps = useMemo(() => [...compositionSteps(SHAPES.triangle, ordered, matrix)], [ordered, matrix]);
  const playback = useStepper(steps);
  const move = (index, delta) => setCards((current) => {
    const target = index + delta;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
  useEffect(() => {
    const reversed = [...ordered].reverse().reduce((acc, card) => mul(card.matrix, acc), IDENTITY_3);
    const reversePoint = applyToPoint(reversed, SHAPES.triangle[0]);
    setVars({ order: cards.map((card) => card.id).join(' × '), px: params.px, py: params.py, outX: fmt(result[0][0]), outY: fmt(result[0][1]), swapX: fmt(reversePoint[0]), swapY: fmt(reversePoint[1]) });
  }, [cards, matrix, ordered, params, result, setVars]);

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--muted)' }}>Reorder the cards. Composition is accumulated so each card acts on the result of the previous card.</p>
      <ol className="space-y-2" aria-label="Transformation order">
        {cards.map((card, i) => (
          <li key={card.id} className="flex items-center gap-3 rounded-xl border p-2" style={border}>
            <span className="flex-1 font-medium">{i + 1}. {card.title}</span>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${card.title} earlier`} className={button} style={border}><ArrowUp size={16} /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === cards.length - 1} aria-label={`Move ${card.title} later`} className={button} style={border}><ArrowDown size={16} /></button>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-4">
        {slider({ label: 'Pivot x', value: params.px, min: -2, max: 4, step: 0.5, onChange: (v) => set('px', v) })}
        {slider({ label: 'Pivot y', value: params.py, min: -2, max: 4, step: 0.5, onChange: (v) => set('py', v) })}
        {slider({ label: 'Rotation', value: params.deg, min: -180, max: 180, onChange: (v) => set('deg', v) })}
        {slider({ label: 'Scale x', value: params.sx, min: 0.5, max: 2.5, step: 0.1, onChange: (v) => set('sx', v) })}
      </div>
      <MatrixCanvas points={result} ghost={SHAPES.triangle} label="Composed transformation result and original ghost" />
      <div><h4 className="mb-2 text-sm font-semibold">Composite matrix (column vectors)</h4><MatrixBox rows={matrix} label="Composite 3 by 3 matrix" /></div>
      <AlgoStepper s={playback} />
      <AlgoPanel code={COMPOSITION_CODE} stepper={playback} />
    </div>
  );
}
