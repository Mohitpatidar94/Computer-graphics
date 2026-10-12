import { useEffect, useMemo, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas.js';
import { useStepper } from '../../hooks/useStepper.js';
import { drawArrow, drawGrid, drawPoly, makeView } from '../../lib/drawKit.js';
import { clamp } from '../../lib/drawKit.js';
import { fmt } from '../../lib/algorithms/transform.js';
import AlgoPanel from '../AlgoPanel.jsx';
import AlgoStepper from '../AlgoStepper.jsx';
import MatrixBox from '../MatrixBox.jsx';

const btn = 'rounded-full border px-3 py-1.5 text-sm';
const bd = { borderColor: 'var(--border)' };
const slider = (label, value, min, max, onChange, step = 1) => (
  <label key={label} className="flex min-w-36 flex-1 flex-col gap-1 text-xs">{label}: {value}
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
  </label>
);

const WINDOW_CODE = [
  'sx = viewport_width / window_width',
  'sy = viewport_height / window_height',
  'xv = xvmin + (xw - xwmin) * sx',
  'yv = yvmin + (yw - ywmin) * sy',
  'draw the mapped points inside the viewport',
];

function* viewportSteps(x, y, sx, sy, xwmin, ywmin) {
  yield { line: 0, plot: false, vars: { sx, sy }, note: 'Compute horizontal scale from rectangle widths.' };
  yield { line: 1, plot: false, vars: { sx, sy }, note: 'Compute vertical scale from rectangle heights.' };
  const xv = (x - xwmin) * sx;
  yield { line: 2, plot: false, vars: { xw: x, sx, xv }, note: 'Translate x relative to the left edge, then scale it.' };
  const yv = (y - ywmin) * sy;
  yield { line: 3, plot: false, vars: { yw: y, sy, yv }, note: 'Translate y relative to the bottom edge, then scale it.' };
  yield { line: 4, plot: true, x: xv, y: yv, vars: { xv, yv }, note: 'Draw the mapped point in viewport coordinates.' };
}

export function WindowViewportDemo({ setVars }) {
  const [world, setWorld] = useState({ width: 16, height: 10 });
  const [viewport, setViewport] = useState({ width: 10, height: 6 });
  const [uniform, setUniform] = useState(false);
  const point = { x: 2, y: 1.5 };
  const scaleX = viewport.width / world.width;
  const scaleY = viewport.height / world.height;
  const actualX = uniform ? Math.min(scaleX, scaleY) : scaleX;
  const actualY = uniform ? Math.min(scaleX, scaleY) : scaleY;
  const mapped = [(point.x + world.width / 2) * actualX, (point.y + world.height / 2) * actualY];
  const steps = useMemo(() => [...viewportSteps(point.x, point.y, actualX, actualY, -world.width / 2, -world.height / 2)], [actualX, actualY, world]);
  const playback = useStepper(steps);

  useEffect(() => setVars({ sx: actualX, sy: actualY, distortion: uniform ? 'aspect ratio preserved' : actualX === actualY ? 'none' : 'stretched' }), [actualX, actualY, uniform, setVars]);

  const ref = useCanvas((ctx, w, h, _t, accent, grid, text) => {
    const panelW = w / 2;
    const pad = 28;
    const drawPanel = (x0, width, height, title, color) => {
      const unit = Math.min((panelW - 2 * pad) / width, (h - 58) / height);
      const x = x0 + (panelW - width * unit) / 2;
      const y = (h - height * unit) / 2 + 8;
      ctx.strokeStyle = grid;
      for (let i = 0; i <= width; i += 1) { ctx.beginPath(); ctx.moveTo(x + i * unit, y); ctx.lineTo(x + i * unit, y + height * unit); ctx.stroke(); }
      for (let i = 0; i <= height; i += 1) { ctx.beginPath(); ctx.moveTo(x, y + i * unit); ctx.lineTo(x + width * unit, y + i * unit); ctx.stroke(); }
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width * unit, height * unit);
      const px = x + (width / 2 + (title === 'World window' ? point.x : mapped[0] / actualX - world.width / 2)) * unit;
      const py = y + (height / 2 - (title === 'World window' ? point.y : mapped[1] / actualY - world.height / 2)) * unit;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = text; ctx.font = '12px Inter, sans-serif'; ctx.fillText(title, x0 + 10, 18);
    };
    drawPanel(0, world.width, world.height, 'World window', text);
    drawPanel(panelW, viewport.width, viewport.height, 'Screen viewport', accent);
    ctx.fillStyle = accent; ctx.font = '18px Inter, sans-serif'; ctx.fillText('→', panelW - 10, h / 2);
  }, [world, viewport, mapped, uniform]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex gap-3">{slider('Window width', world.width, 8, 20, (width) => setWorld((v) => ({ ...v, width })))}{slider('Window height', world.height, 6, 14, (height) => setWorld((v) => ({ ...v, height })))}</div>
        <div className="flex gap-3">{slider('Viewport width', viewport.width, 5, 16, (width) => setViewport((v) => ({ ...v, width })))}{slider('Viewport height', viewport.height, 4, 12, (height) => setViewport((v) => ({ ...v, height })))}</div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={uniform} onChange={(e) => setUniform(e.target.checked)} />Preserve aspect ratio (uniform scale; margins may remain)</label>
      <canvas ref={ref} role="img" aria-label={`World window mapped into viewport; sx ${actualX}, sy ${actualY}`} className="w-full rounded-xl" style={{ aspectRatio: '2.2 / 1', background: 'rgba(0,0,0,0.16)' }} />
      <div className="flex flex-wrap items-center gap-5 text-sm"><span>sx = {actualX.toFixed(3)}</span><span>sy = {actualY.toFixed(3)}</span><span>Mapped point = ({mapped[0].toFixed(2)}, {mapped[1].toFixed(2)})</span><span style={{ color: 'var(--muted)' }}>{uniform ? 'Uniform scale' : 'Independent scales'}</span></div>
      <AlgoStepper s={playback} />
      <AlgoPanel code={WINDOW_CODE} stepper={playback} />
    </div>
  );
}

const EFFICIENCY_CODE = [
  'naive matrix product: 3 rows x 3 columns x 3 terms',
  'affine product: calculate 2x2 linear block and 2 offsets',
  'compose the k transforms once',
  'apply the composite matrix to each of n points',
  'compare total multiplication and addition counts',
];

function* efficiencySteps(points, transforms) {
  yield { line: 0, plot: false, vars: { multiplications: 27, additions: 18 }, note: 'A general 3x3 matrix product uses nine 3-term dot products.' };
  yield { line: 1, plot: false, vars: { multiplications: 12, additions: 8, fixedRow: '[0, 0, 1]' }, note: 'Affine structure makes the last row known and skips its arithmetic.' };
  yield { line: 2, plot: false, vars: { transforms, composeMultiplications: Math.max(0, transforms - 1) * 12 }, note: 'Build one reusable composite matrix.' };
  yield { line: 3, plot: false, vars: { points, applyMultiplications: points * 4, applyAdditions: points * 4 }, note: 'Transform each point once with the composite matrix.' };
  yield { line: 4, plot: true, x: points, y: transforms, vars: { separate: points * transforms * 4, composed: Math.max(0, transforms - 1) * 12 + points * 4 }, note: 'Compare multiplication totals; additions follow the same affine pattern.' };
}

export function EfficiencyDemo({ setVars }) {
  const [points, setPoints] = useState(10);
  const [transforms, setTransforms] = useState(3);
  const [shown, setShown] = useState(0);
  const naiveMultiply = 27;
  const naiveAdd = 18;
  const affineMultiply = 12;
  const affineAdd = 8;
  const separate = points * transforms * 4;
  const composed = Math.max(0, transforms - 1) * affineMultiply + points * 4;
  const steps = useMemo(() => [...efficiencySteps(points, transforms)], [points, transforms]);
  const playback = useStepper(steps);

  useEffect(() => setVars({ naive: naiveMultiply, naiveAdds: naiveAdd, fast: affineMultiply, fastAdds: affineAdd, points, transforms }), [points, transforms, setVars]);
  useEffect(() => setShown(playback.idx + 1), [playback.idx]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">{slider('Points', points, 1, 100, setPoints)}{slider('Transforms', transforms, 1, 8, setTransforms)}</div>
      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded-xl border p-4" style={bd}><h4 className="font-semibold">General 3 × 3 product</h4><p className="mt-2 text-sm">9 dot products × 3 terms</p><p className="font-mono text-sm">27 multiplications + 18 additions</p><MatrixBox rows={[[1, 2, 3], [4, 5, 6], [0, 0, 1]]} label="Affine matrix showing its fixed last row" hiRows={[2]} /></section>
        <section className="rounded-xl border p-4" style={bd}><h4 className="font-semibold">Optimized affine product</h4><p className="mt-2 text-sm">2 × 2 linear block plus translation column</p><p className="font-mono text-sm">12 multiplications + 8 additions</p><MatrixBox rows={[[1, 2, 3], [4, 5, 6], [0, 0, 1]]} label="Affine matrix with fixed row highlighted" hiRows={[2]} /></section>
      </div>
      <div className="rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}>
        <p className="font-semibold">Apply {transforms} transforms to {points} points</p>
        <p className="mt-1 text-sm">Separately: {separate} point multiplications.</p>
        <p className="text-sm">Compose once, then reuse: {composed} multiplications ({Math.max(0, transforms - 1) * affineMultiply} to compose + {points * 4} for points).</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>Naive 3×3 products cost {transforms * naiveMultiply} more matrix multiplications; affine products cost {Math.max(0, transforms - 1) * affineMultiply} when composed.</p>
      </div>
      <p className="text-xs" style={{ color: 'var(--muted)' }}>Step {shown} of {steps.length}: compose the matrices once before processing all vertices.</p>
      <AlgoStepper s={playback} />
      <AlgoPanel code={EFFICIENCY_CODE} stepper={playback} />
    </div>
  );
}

const CUBE = [[-1,-1,-1,1],[1,-1,-1,1],[1,1,-1,1],[-1,1,-1,1],[-1,-1,1,1],[1,-1,1,1],[1,1,1,1],[-1,1,1,1]];
const EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
const PROJECT_CODE = [
  'build S, Rx, Ry, Rz and T as 4x4 matrices',
  'M = T × Rz × Ry × Rx × S',
  'for each vertex p = [x,y,z,1]: p_new = M × p',
  'project (x,y,z) to the 2D canvas',
  'draw cube edges and world-axis arrows',
];
const I4 = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
const mul4 = (a, b) => a.map((row) => b[0].map((_, j) => row.reduce((sum, value, k) => sum + value * b[k][j], 0)));

function build3D(params) {
  const rad = Math.PI / 180;
  const cx = Math.cos(params.rx * rad); const sx = Math.sin(params.rx * rad);
  const cy = Math.cos(params.ry * rad); const sy = Math.sin(params.ry * rad);
  const cz = Math.cos(params.rz * rad); const sz = Math.sin(params.rz * rad);
  const S = [[params.sx,0,0,0],[0,params.sy,0,0],[0,0,params.sz,0],[0,0,0,1]];
  const Rx = [[1,0,0,0],[0,cx,-sx,0],[0,sx,cx,0],[0,0,0,1]];
  const Ry = [[cy,0,sy,0],[0,1,0,0],[-sy,0,cy,0],[0,0,0,1]];
  const Rz = [[cz,-sz,0,0],[sz,cz,0,0],[0,0,1,0],[0,0,0,1]];
  const T = [[1,0,0,params.tx],[0,1,0,params.ty],[0,0,1,params.tz],[0,0,0,1]];
  return mul4(T, mul4(Rz, mul4(Ry, mul4(Rx, S))));
}

function apply4(matrix, point) {
  return matrix.map((row) => row.reduce((sum, value, i) => sum + value * point[i], 0));
}

function* projectionSteps(matrix) {
  yield { line: 0, plot: false, vars: { matrices: 'S, Rx, Ry, Rz, T' }, note: 'Create one 4x4 matrix for each transform.' };
  yield { line: 1, plot: false, vars: { composition: 'T × Rz × Ry × Rx × S' }, note: 'For column vectors, the rightmost scale acts first.' };
  for (let i = 0; i < CUBE.length; i += 1) {
    const result = apply4(matrix, CUBE[i]);
    yield { line: 2, plot: true, vertex: i, x: result[0], y: result[1], vars: { vertex: i, x: result[0], y: result[1], z: result[2], w: result[3] }, note: `Transform cube vertex ${i} in homogeneous coordinates.` };
  }
  yield { line: 3, plot: false, final: true, vars: { projection: 'perspective camera' }, note: 'Project the transformed 3D vertices to the canvas.' };
}

export function Transform3DDemo({ setVars }) {
  const [params, setParams] = useState({ tx: 0, ty: 0, tz: 0, sx: 1, sy: 1, sz: 1, rx: 25, ry: -30, rz: 0 });
  const matrix = useMemo(() => build3D(params), [params]);
  const steps = useMemo(() => [...projectionSteps(matrix)], [matrix]);
  const playback = useStepper(steps);
  const set = (key, value) => setParams((p) => ({ ...p, [key]: value }));
  const ref = useCanvas((ctx, w, h, _t, accent, grid, text) => {
    const origin = [w / 2, h / 2];
    const project = (point) => {
      const [x, y, z] = point;
      const depth = Math.max(1.2, 5 - z * 0.22);
      const factor = Math.min(w, h) * 0.34 / depth;
      return [origin[0] + x * factor, origin[1] - y * factor];
    };
    ctx.strokeStyle = grid; ctx.lineWidth = 1;
    for (let x = origin[0] % 24; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = origin[1] % 24; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    const points = CUBE.map((point) => project(apply4(matrix, point)));
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
    EDGES.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(...points[a]); ctx.lineTo(...points[b]); ctx.stroke(); });
    const axisLength = Math.min(w, h) * 0.25;
    const axes = [[1,0,0,'#FF6464','X'],[0,1,0,'#4ADE80','Y'],[0,0,1,'#60A5FA','Z']];
    axes.forEach(([x,y,z,color,label]) => {
      const end = project(apply4(matrix, [x * axisLength / 40, y * axisLength / 40, z * axisLength / 40, 1]));
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(...origin); ctx.lineTo(...end); ctx.stroke();
      ctx.fillText(label, end[0] + 4, end[1] - 4);
    });
    ctx.fillStyle = text; ctx.font = '12px Inter, sans-serif'; ctx.fillText('Drag to rotate · touch and drag supported', 10, h - 10);
  }, [matrix]);

  const drag = useMemo(() => ({ current: null }), []);
  const onPointerDown = (e) => { drag.current = [e.clientX, e.clientY]; e.currentTarget.setPointerCapture(e.pointerId); };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const [x, y] = drag.current;
    setParams((p) => ({ ...p, ry: clamp(p.ry + (e.clientX - x) * 0.6, -180, 180), rx: clamp(p.rx + (e.clientY - y) * 0.6, -180, 180) }));
    drag.current = [e.clientX, e.clientY];
  };
  const onPointerUp = (e) => { drag.current = null; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); };
  useEffect(() => {
    const first = apply4(matrix, CUBE[0]);
    setVars({ rx: params.rx, ry: params.ry, rz: params.rz, x: fmt(first[0]), y: fmt(first[1]), z: fmt(first[2]) });
  }, [matrix, params, setVars]);

  return (
    <div className="space-y-4">
      <canvas ref={ref} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} role="img" aria-label="Draggable 3D cube with X, Y and Z axes" className="w-full touch-none rounded-xl" style={{ aspectRatio: '16 / 9', background: 'rgba(0,0,0,0.16)', cursor: 'grab' }} />
      <div className="grid gap-x-4 gap-y-2 sm:grid-cols-3">{slider('Translate X', params.tx, -3, 3, (v) => set('tx', v), 0.1)}{slider('Translate Y', params.ty, -3, 3, (v) => set('ty', v), 0.1)}{slider('Translate Z', params.tz, -3, 3, (v) => set('tz', v), 0.1)}{slider('Scale X', params.sx, 0.4, 2, (v) => set('sx', v), 0.05)}{slider('Scale Y', params.sy, 0.4, 2, (v) => set('sy', v), 0.05)}{slider('Scale Z', params.sz, 0.4, 2, (v) => set('sz', v), 0.05)}{slider('Rotate X', params.rx, -180, 180, (v) => set('rx', v))}{slider('Rotate Y', params.ry, -180, 180, (v) => set('ry', v))}{slider('Rotate Z', params.rz, -180, 180, (v) => set('rz', v))}</div>
      <div className="overflow-x-auto"><h4 className="mb-2 text-sm font-semibold">Combined 4 × 4 matrix</h4><MatrixBox rows={matrix} label="Combined 4 by 4 transformation matrix" /></div>
      <AlgoStepper s={playback} />
      <AlgoPanel code={PROJECT_CODE} stepper={playback} />
    </div>
  );
}

const FRAME_CODE = [
  'define the point in its local coordinate frame',
  'object motion: p_world = T(d) × p_local',
  'axis motion: p_new = T(-d) × p_world',
  'the physical point stays fixed when only axes move',
];

function* frameSteps(point, shift, mode) {
  yield { line: 0, plot: false, vars: { localPoint: point }, note: 'Start with one point in the local frame.' };
  if (mode === 'object') {
    yield { line: 1, plot: false, vars: { shift, operation: 'add the object translation' }, note: 'Moving the object changes its world coordinates by +d.' };
    yield { line: 3, plot: true, x: point[0] + shift[0], y: point[1] + shift[1], vars: { world: [point[0] + shift[0], point[1] + shift[1]] }, note: 'The point itself has moved in world space.' };
  } else {
    yield { line: 2, plot: false, vars: { shift, operation: 'subtract the moved frame origin' }, note: 'Move the axes by +d; describe the fixed point relative to the new origin.' };
    yield { line: 3, plot: true, x: point[0] - shift[0], y: point[1] - shift[1], vars: { newFrame: [point[0] - shift[0], point[1] - shift[1]] }, note: 'The physical point stays still; only its coordinate values change.' };
  }
}

export function CoordinateChangeDemo({ setVars }) {
  const [mode, setMode] = useState('object');
  const [point, setPoint] = useState({ x: 3, y: 2 });
  const [shift, setShift] = useState({ x: 2, y: 1 });
  const coordinates = mode === 'object'
    ? [point.x + shift.x, point.y + shift.y]
    : [point.x - shift.x, point.y - shift.y];
  const steps = useMemo(() => [...frameSteps([point.x, point.y], [shift.x, shift.y], mode)], [point, shift, mode]);
  const playback = useStepper(steps);
  const setNumber = (setter, key) => (e) => setter((p) => ({ ...p, [key]: Number(e.target.value) || 0 }));

  const ref = useCanvas((ctx, w, h, _t, accent, grid, text) => {
    const panel = w / 2;
    const drawAxes = (offsetX, ox, oy, color, title) => {
      const unit = Math.min(panel / 10, h / 8);
      const X = (x) => offsetX + panel / 2 + (x + ox) * unit;
      const Y = (y) => h / 2 - (y + oy) * unit;
      ctx.strokeStyle = grid; ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i += 1) { ctx.beginPath(); ctx.moveTo(X(i - ox), 0); ctx.lineTo(X(i - ox), h); ctx.stroke(); }
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(offsetX + 8, Y(-4 - oy)); ctx.lineTo(offsetX + panel - 8, Y(4 - oy)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(-5 - ox), 8); ctx.lineTo(X(5 - ox), h - 8); ctx.stroke();
      const px = mode === 'object' ? point.x + shift.x : point.x;
      const py = mode === 'object' ? point.y + shift.y : point.y;
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(X(px - ox), Y(py - oy), 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = text; ctx.font = '12px Inter, sans-serif'; ctx.fillText(title, offsetX + 8, 18);
    };
    drawAxes(0, 0, 0, text, 'World frame');
    drawAxes(panel, mode === 'axes' ? shift.x : 0, mode === 'axes' ? shift.y : 0, accent, 'Object / changed frame');
    ctx.fillStyle = accent; ctx.font = '18px Inter, sans-serif'; ctx.fillText('↔', panel - 12, h / 2);
  }, [point, shift, mode]);

  useEffect(() => setVars({ mode: mode === 'object' ? 'move object' : 'move axes', dx: shift.x, coordinate: coordinates[0] }), [mode, shift.x, coordinates[0], setVars]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose what to move">
        {[['object', 'Move the object'], ['axes', 'Move the axes']].map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={btn} style={{ ...bd, background: mode === value ? 'var(--accent)' : 'transparent', color: mode === value ? '#0B1020' : 'var(--text)' }}>{label}</button>)}
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <label>Point x<input type="number" value={point.x} onChange={setNumber(setPoint, 'x')} className="ml-2 w-20 rounded border bg-transparent px-2 py-1" style={bd} /></label>
        <label>Point y<input type="number" value={point.y} onChange={setNumber(setPoint, 'y')} className="ml-2 w-20 rounded border bg-transparent px-2 py-1" style={bd} /></label>
        <label>Frame shift x<input type="number" value={shift.x} onChange={setNumber(setShift, 'x')} className="ml-2 w-20 rounded border bg-transparent px-2 py-1" style={bd} /></label>
        <label>Frame shift y<input type="number" value={shift.y} onChange={setNumber(setShift, 'y')} className="ml-2 w-20 rounded border bg-transparent px-2 py-1" style={bd} /></label>
      </div>
      <canvas ref={ref} role="img" aria-label={`Coordinate frames; ${mode === 'object' ? 'object moved' : 'axes moved'}`} className="w-full rounded-xl" style={{ aspectRatio: '2 / 1', background: 'rgba(0,0,0,0.16)' }} />
      <div className="glass p-3 text-sm">
        <p>Object-frame point: ({point.x}, {point.y}); offset: ({shift.x}, {shift.y}).</p>
        <p className="mt-1 font-semibold">{mode === 'object' ? `Moved object world point: (${coordinates[0]}, ${coordinates[1]})` : `Fixed world point in moved axes: (${coordinates[0]}, ${coordinates[1]})`}</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{mode === 'object' ? 'Object motion adds d to its world position.' : 'Frame motion subtracts d from the fixed point coordinates.'}</p>
      </div>
      <AlgoStepper s={playback} />
      <AlgoPanel code={FRAME_CODE} stepper={playback} />
    </div>
  );
}
