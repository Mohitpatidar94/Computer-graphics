import { useEffect, useState } from 'react';
import PixelGrid from '../PixelGrid.jsx';
import MatrixView from '../Tex.jsx';
import { useCanvas } from '../../hooks/useCanvas.js';
import { drawSampled } from '../../lib/imageSample.js';

const btn = 'rounded-full border px-3 py-1.5 text-sm';
const bd = { borderColor: 'var(--border)' };

const SMILEY = ['3,2', '4,2', '7,2', '8,2', '2,5', '9,5', '3,6', '8,6', '4,7', '5,7', '6,7', '7,7'];

export function WhatIsDemo() {
  const [on, setOn] = useState(() => new Set());
  const toggle = (x, y) => setOn((s) => { const n = new Set(s); const k = `${x},${y}`; n.has(k) ? n.delete(k) : n.add(k); return n; });
  const lit = [...on].map((k) => { const [x, y] = k.split(',').map(Number); return { x, y }; });
  return (
    <div>
      <p className="mb-2 text-sm">Tap boxes to paint. A computer picture is just boxes with colours.</p>
      <PixelGrid cols={12} rows={9} lit={lit} onCell={toggle} label="Paintable pixel grid" />
      <div className="mt-3 flex gap-2">
        <button className={btn} style={bd} onClick={() => setOn(new Set(SMILEY))}>Draw smiley</button>
        <button className={btn} style={bd} onClick={() => setOn(new Set())}>Clear</button>
        <span className="self-center text-sm">{lit.length} pixels lit</span>
      </div>
    </div>
  );
}

export function ResolutionDemo({ setVars }) {
  const [n, setN] = useState(16);
  const rows = Math.round(n * 0.625);
  useEffect(() => setVars({ cols: n, rows }), [n, rows, setVars]);
  const ref = useCanvas((ctx, w, h) => drawSampled(ctx, 0, 0, w, h, n, rows), [n, rows]);
  return (
    <div>
      <canvas ref={ref} role="img" aria-label={`Image drawn with ${n} by ${rows} pixels`} className="w-full rounded-xl" style={{ aspectRatio: '8 / 5' }} />
      <label className="mt-3 block text-sm">Pixels across: {n}
        <input type="range" min="4" max="128" value={n} onChange={(e) => setN(Number(e.target.value))} className="ml-2 w-56 align-middle" aria-label="Resolution" />
      </label>
      <p className="mt-1 text-sm">Resolution {n} x {rows} = {n * rows} pixels. Slide right for a sharper picture.</p>
    </div>
  );
}

export function CoordDemo({ setVars }) {
  const [flip, setFlip] = useState(false);
  const [sel, setSel] = useState({ x: 3, y: 2 });
  useEffect(() => setVars(sel), [sel, setVars]);
  return (
    <div>
      <PixelGrid cols={16} rows={9} flipY={flip} mark={sel} onCell={(x, y) => setSel({ x, y })} lit={[{ x: sel.x, y: sel.y }]} label="Coordinate grid" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button className={btn} style={bd} aria-pressed={flip} onClick={() => setFlip(!flip)}>{flip ? 'Maths view: y goes UP' : 'Screen view: y goes DOWN'}</button>
        <span className="font-mono text-sm">Selected pixel = ({sel.x}, {sel.y})</span>
      </div>
    </div>
  );
}

export function FrameBufferDemo({ setVars }) {
  const [W, setW] = useState(1024);
  const [H, setH] = useState(768);
  const [bpp, setBpp] = useState(8);
  const [bits, setBits] = useState(() => new Set(['1,1', '2,2', '3,3', '4,2', '5,1']));
  const bytes = (W * H * bpp) / 8;
  useEffect(() => setVars({ W, H, bpp, bytes }), [W, H, bpp, bytes, setVars]);
  const toggle = (x, y) => setBits((s) => { const n = new Set(s); const k = `${x},${y}`; n.has(k) ? n.delete(k) : n.add(k); return n; });
  const lit = [...bits].map((k) => { const [x, y] = k.split(',').map(Number); return { x, y }; });
  const Sel = ({ label, value, set, options }) => (
    <label className="text-sm">{label}
      <select value={value} onChange={(e) => set(Number(e.target.value))} className="ml-2 rounded-md border bg-transparent px-2 py-1" style={bd}>
        {options.map((o) => <option key={o} value={o} style={{ color: '#000' }}>{o}</option>)}
      </select>
    </label>
  );
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm">1 bit per pixel: tap a cell to flip its memory bit.</p>
        <PixelGrid cols={8} rows={6} lit={lit} onCell={toggle} label="1-bit frame buffer" />
        <pre className="mt-2 rounded-lg p-2 font-mono text-xs" style={{ background: 'rgba(0,0,0,0.25)' }}>{Array.from({ length: 6 }, (_, y) => Array.from({ length: 8 }, (_, x) => (bits.has(`${x},${y}`) ? 1 : 0)).join(' ')).join('\n')}</pre>
      </div>
      <div className="space-y-3">
        <Sel label="Width" value={W} set={setW} options={[640, 800, 1024, 1280, 1920]} />
        <Sel label="Height" value={H} set={setH} options={[480, 600, 768, 720, 1080]} />
        <Sel label="Bits per pixel" value={bpp} set={setBpp} options={[1, 8, 16, 24, 32]} />
        <p className="font-mono text-sm">{W} x {H} x {bpp} / 8 = {bytes.toLocaleString()} bytes</p>
        <p className="font-semibold">{bytes >= 1048576 ? `${(bytes / 1048576).toFixed(2)} MB` : `${(bytes / 1024).toFixed(2)} KB`}, {(2 ** bpp).toLocaleString()} colours</p>
      </div>
    </div>
  );
}

export function MathDemo({ setVars }) {
  const [a, setA] = useState(45);
  const [p, setP] = useState({ x: 4, y: 2 });
  const r = (a * Math.PI) / 180; const c = Math.cos(r); const s = Math.sin(r);
  const xr = +(p.x * c - p.y * s).toFixed(2); const yr = +(p.x * s + p.y * c).toFixed(2);
  useEffect(() => setVars({ a, xr, yr }), [a, xr, yr, setVars]);
  const u = 28; const O = 150;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <svg viewBox="0 0 300 300" role="img" aria-label="Point before and after rotation" className="w-full rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <path d={`M0 ${O}H300M${O} 0V300`} stroke="var(--border)" />
          <circle cx={O + p.x * u} cy={O - p.y * u} r="6" fill="#888" /><text x={O + p.x * u + 8} y={O - p.y * u} fill="var(--text)" fontSize="11">before</text>
          <circle cx={O + xr * u} cy={O - yr * u} r="6" fill="var(--accent)" /><text x={O + xr * u + 8} y={O - yr * u} fill="var(--text)" fontSize="11">after</text>
          <path d={`M${O} ${O}L${O + xr * u} ${O - yr * u}`} stroke="var(--accent)" />
        </svg>
        <label className="mt-2 block text-sm">Angle: {a} degrees <input type="range" min="-180" max="180" value={a} onChange={(e) => setA(Number(e.target.value))} aria-label="Angle" className="ml-2 align-middle" /></label>
        <label className="text-sm">x <input type="number" value={p.x} onChange={(e) => setP({ ...p, x: Number(e.target.value) })} className="w-16 rounded border bg-transparent px-1" style={bd} /></label>
        <label className="ml-3 text-sm">y <input type="number" value={p.y} onChange={(e) => setP({ ...p, y: Number(e.target.value) })} className="w-16 rounded border bg-transparent px-1" style={bd} /></label>
      </div>
      <div>
        <p className="text-sm">Rotation matrix times the point:</p>
        <MatrixView rows={[[+c.toFixed(3), +(-s).toFixed(3)], [+s.toFixed(3), +c.toFixed(3)]]} label="Rotation matrix" />
        <MatrixView rows={[[p.x], [p.y]]} label="Point" />
        <p className="text-sm">equals</p>
        <MatrixView rows={[[xr], [yr]]} label="Result" />
        <p className="text-sm">Row 1 x column: ({+c.toFixed(2)} x {p.x}) + ({+(-s).toFixed(2)} x {p.y}) = {xr}</p>
      </div>
    </div>
  );
}
