import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { USES, EVENTS, CLASSIFY, FLOW, OVERVIEW_ROWS } from '../../data/unit1-intro.js';

const bd = { borderColor: 'var(--border)' };
const pill = (on) => ({ ...bd, background: on ? 'var(--accent)' : 'transparent', color: on ? '#0B1020' : 'var(--text)' });

const House = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M-40 10 L0 -40 L40 10 Z" fill="#FF5CAA" /><rect x="-30" y="10" width="60" height="40" fill="#4FD1FF" /><rect x="-8" y="26" width="16" height="24" fill="#0B1020" /></g>
);

export function InteractiveDemo({ setVars }) {
  const [pos, setPos] = useState({ x: 150, y: 110 });
  const [size, setSize] = useState(60);
  const [rot, setRot] = useState(0);
  const [drag, setDrag] = useState(false);
  const [view, setView] = useState('text');
  const data = [['Jan', 12], ['Feb', 18], ['Mar', 9], ['Apr', 25], ['May', 16]];
  useEffect(() => setVars({ fps: 30 }), [setVars]);
  const move = (e) => {
    if (!drag) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: Math.max(30, Math.min(270, ((e.clientX - r.left) / r.width) * 300)), y: Math.max(30, Math.min(190, ((e.clientY - r.top) / r.height) * 220)) });
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div><h4 className="mb-1 text-sm font-semibold">Static picture</h4>
          <svg viewBox="0 0 300 220" role="img" aria-label="Static picture of a house" className="w-full rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}><g transform="translate(150 110)"><House /></g></svg>
          <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>You can only look at it.</p></div>
        <div><h4 className="mb-1 text-sm font-semibold">Interactive object (drag it)</h4>
          <svg viewBox="0 0 300 220" role="img" aria-label="Draggable house" className="w-full touch-none rounded-xl" style={{ background: 'rgba(0,0,0,0.2)', cursor: 'grab' }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); move(e); }} onPointerMove={move} onPointerUp={() => setDrag(false)}>
            <g transform={`translate(${pos.x} ${pos.y}) rotate(${rot})`}><House s={size / 60} /></g></svg>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <label>Size {size}<input type="range" min="30" max="100" value={size} onChange={(e) => setSize(+e.target.value)} className="ml-2 align-middle" aria-label="Size" /></label>
            <label>Rotate {rot}°<input type="range" min="-180" max="180" value={rot} onChange={(e) => setRot(+e.target.value)} className="ml-2 align-middle" aria-label="Rotation" /></label>
          </div></div>
      </div>
      <div>
        <div className="mb-2 flex gap-2" role="group" aria-label="Text or graphics"><button className="rounded-full border px-3 py-1 text-sm" style={pill(view === 'text')} onClick={() => setView('text')}>As text</button><button className="rounded-full border px-3 py-1 text-sm" style={pill(view === 'graph')} onClick={() => setView('graph')}>As graphics</button></div>
        {view === 'text' ? <p className="font-mono text-sm">{data.map(([m, v]) => `${m}: ${v}`).join(',  ')}</p> : (
          <svg viewBox="0 0 300 120" role="img" aria-label="Bar chart of monthly values" className="w-full max-w-md">{data.map(([m, v], i) => <g key={m}><rect x={20 + i * 55} y={110 - v * 4} width="40" height={v * 4} fill={v === 25 ? '#FF5CAA' : '#4FD1FF'} /><text x={40 + i * 55} y="118" fontSize="10" textAnchor="middle" fill="var(--text)">{m}</text></g>)}</svg>)}
        <p className="mt-1 text-sm">Which month is highest? In graphics you see it at once. In text you must read every number.</p>
      </div>
    </div>
  );
}

function Mini({ kind, on }) {
  const T = (d = 1.6) => (on ? { repeat: Infinity, duration: d, ease: 'easeInOut' } : { duration: 0.2 });
  const a = (rest, to) => (on ? to : rest);
  return (
    <svg viewBox="0 0 100 60" className="h-16 w-full" aria-hidden>
      {kind === 'games' && <motion.rect y="36" width="14" height="14" fill="#B6F25C" animate={{ x: a(10, [10, 76, 10]), y: a(36, [36, 14, 36]) }} transition={T(1.2)} />}
      {kind === 'cad' && <motion.rect x="35" y="15" width="30" height="30" fill="none" stroke="#4FD1FF" strokeWidth="3" style={{ transformOrigin: '50px 30px' }} animate={{ rotate: a(0, 360) }} transition={on ? { repeat: Infinity, duration: 3, ease: 'linear' } : { duration: 0.2 }} />}
      {kind === 'medical' && <><circle cx="50" cy="30" r="22" fill="none" stroke="#FF5CAA" strokeWidth="3" /><motion.line x1="22" x2="78" stroke="#4FD1FF" strokeWidth="2" animate={{ y1: a(30, [10, 50, 10]), y2: a(30, [10, 50, 10]) }} transition={T(1.8)} /></>}
      {kind === 'movies' && [0, 1, 2].map((i) => <motion.rect key={i} x={12 + i * 30} y="15" width="24" height="30" fill="#FFB454" animate={{ opacity: a(1, [1, 0.15, 1]) }} transition={{ ...T(1.2), delay: on ? i * 0.3 : 0 }} />)}
      {kind === 'sim' && <><circle cx="50" cy="30" r="5" fill="#FFB454" /><motion.circle r="5" fill="#4FD1FF" animate={{ cx: a(80, [80, 50, 20, 50, 80]), cy: a(30, [30, 10, 30, 50, 30]) }} transition={T(2)} /></>}
      {kind === 'gui' && <motion.rect x="20" y="10" width="60" height="40" rx="4" fill="#A78BFA" style={{ transformOrigin: '50px 30px' }} animate={{ scale: a(1, [0.3, 1, 0.3]) }} transition={T(1.6)} />}
      {kind === 'maps' && <><motion.path d="M10 50 L35 25 L60 40 L90 10" fill="none" stroke="#4FD1FF" strokeWidth="3" animate={{ pathLength: a(1, [0, 1, 1]) }} transition={T(2)} /><circle cx="90" cy="10" r="4" fill="#FF5CAA" /></>}
      {kind === 'vr' && [0, 1].map((i) => <motion.rect key={i} x={14 + i * 44} y="18" width="34" height="24" rx="6" fill="#34D399" style={{ transformOrigin: `${31 + i * 44}px 30px` }} animate={{ scale: a(1, [1, 1.2, 1]) }} transition={T(1.4)} />)}
    </svg>
  );
}

export function UsesDemo() {
  const [active, setActive] = useState(null);
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {USES.map((u) => (
        <button key={u.id} onMouseEnter={() => setActive(u.id)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(u.id)} onBlur={() => setActive(null)} onClick={() => setActive(active === u.id ? null : u.id)} aria-pressed={active === u.id} className="rounded-xl border p-3 text-left transition-transform hover:-translate-y-0.5" style={bd}>
          <Mini kind={u.kind} on={active === u.id} />
          <span className="block text-sm font-semibold">{u.title}</span>
          <span className="block text-xs" style={{ color: 'var(--muted)' }}>{u.text}</span>
        </button>
      ))}
    </div>
  );
}

export function TimelineDemo({ setVars }) {
  const [tab, setTab] = useState('timeline');
  const [sel, setSel] = useState(0);
  const [hz, setHz] = useState(30); const [us] = useState(20);
  useEffect(() => setVars({ max: Math.floor(1e6 / hz / us) }), [hz, us, setVars]);
  const ev = EVENTS[sel];
  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="group" aria-label="View">{[['timeline', 'Timeline'], ['classify', 'Classification']].map(([k, l]) => <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k} className="rounded-full border px-3 py-1 text-sm" style={pill(tab === k)}>{l}</button>)}</div>
      {tab === 'timeline' ? (
        <>
          <ol className="flex gap-2 overflow-x-auto pb-2">{EVENTS.map((e, i) => <li key={e.era}><button onClick={() => setSel(i)} aria-current={sel === i} className="min-w-[6.5rem] rounded-xl border px-3 py-2 text-left text-xs" style={{ ...bd, background: sel === i ? 'var(--border)' : 'transparent', borderColor: sel === i ? 'var(--accent)' : 'var(--border)' }}><b className="block">{e.era}</b>{e.track}</button></li>)}</ol>
          <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-4" style={bd}><h4 className="font-display font-semibold">{ev.era}: {ev.title}</h4><p className="mt-1 text-sm">{ev.text}</p></motion.div>
          <div><label className="text-sm">Vector display refresh: {hz} Hz <input type="range" min="20" max="60" value={hz} onChange={(e) => setHz(+e.target.value)} className="ml-2 align-middle" aria-label="Refresh rate" /></label>
            <p className="text-sm">At {us} µs per line, it can redraw about {Math.floor(1e6 / hz / us)} lines per refresh. More lines than that and the picture flickers. A raster display does not have this limit.</p></div>
        </>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">{CLASSIFY.map((c) => <div key={c.by} className="rounded-xl border p-3" style={bd}><h4 className="font-semibold" style={{ color: 'var(--accent)' }}>{c.by}</h4><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{c.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div>
      )}
    </div>
  );
}

const CY = 70;
const C = (k) => FLOW.boxes[k].x + 65;
export function FrameworkDemo() {
  const [mode, setMode] = useState('output');
  const [run, setRun] = useState(true);
  const [s, setS] = useState(0);
  const raf = useRef();
  const keys = FLOW[mode];
  const pts = keys.map((k) => [C(k), k === 'input' ? 260 : CY]);
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!run || reduce) return undefined;
    let last = performance.now();
    const tick = (n) => { setS((v) => (v + ((n - last) / 1000) * 110) % total); last = n; raf.current = requestAnimationFrame(tick); };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [run, total]);
  useEffect(() => setS(0), [mode]);
  let d = s; let i = 0;
  while (i < lens.length - 1 && d > lens[i]) { d -= lens[i]; i += 1; }
  const f = lens[i] ? Math.min(1, d / lens[i]) : 0;
  const pos = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
  const activeKey = keys[f > 0.5 ? i + 1 : i];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2"><button className="rounded-full border px-3 py-1 text-sm" style={pill(mode === 'output')} aria-pressed={mode === 'output'} onClick={() => setMode('output')}>Output: model to picture</button><button className="rounded-full border px-3 py-1 text-sm" style={pill(mode === 'input')} aria-pressed={mode === 'input'} onClick={() => setMode('input')}>Input: user action loop</button><button className="rounded-full border px-3 py-1 text-sm" style={bd} onClick={() => setRun(!run)}>{run ? 'Pause' : 'Play'}</button></div>
      <svg viewBox="0 0 680 310" role="img" aria-label="Block diagram of an interactive graphics system" className="w-full rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
        {Object.entries(FLOW.boxes).map(([k, b]) => { const y = k === 'input' ? 230 : 40; const on = k === activeKey; return (
          <g key={k}><rect x={b.x} y={y} width="130" height="60" rx="10" fill={on ? 'var(--accent)' : 'rgba(255,255,255,0.05)'} stroke="var(--accent)" /><text x={b.x + 65} y={y + 35} textAnchor="middle" fontSize="13" fontWeight="600" fill={on ? '#0B1020' : 'var(--text)'}>{b.label}</text></g>); })}
        <circle cx={pos[0]} cy={pos[1]} r="8" fill="#FFB454" />
      </svg>
      <p className="text-sm"><b>{FLOW.boxes[activeKey].label}:</b> {FLOW.boxes[activeKey].note}</p>
    </div>
  );
}

export function OverviewDemo() {
  const [k, setK] = useState('line');
  const r = OVERVIEW_ROWS[k];
  const rows = [['Start', r.start], ['Decision parameter', r.param], ['Symmetry', r.symmetry], ['Stops', r.stop], ['Cost', r.cost]];
  return (
    <div>
      <div className="mb-3 flex gap-2" role="group" aria-label="Shape">{Object.entries(OVERVIEW_ROWS).map(([id, v]) => <button key={id} className="rounded-full border px-3 py-1 text-sm" style={pill(k === id)} aria-pressed={k === id} onClick={() => setK(id)}>{id[0].toUpperCase() + id.slice(1)}</button>)}</div>
      <h4 className="mb-2 font-display font-semibold">{r.name}</h4>
      <table className="w-full text-sm"><tbody>{rows.map(([a, b]) => <tr key={a} className="border-t" style={bd}><th className="w-40 py-1.5 pr-3 text-left font-medium" style={{ color: 'var(--muted)' }}>{a}</th><td>{b}</td></tr>)}</tbody></table>
    </div>
  );
}
