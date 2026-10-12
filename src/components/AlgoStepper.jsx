import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

export default function AlgoStepper({ s }) {
  const btn = 'rounded-full border p-2 transition-transform hover:scale-110 active:scale-90';
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Playback controls">
      <button className={btn} style={{ borderColor: 'var(--border)' }} aria-label="Step back" onClick={s.back}><SkipBack size={16} /></button>
      {s.playing
        ? <button className={btn} style={{ borderColor: 'var(--border)' }} aria-label="Pause" onClick={s.pause}><Pause size={16} /></button>
        : <button className={btn} style={{ borderColor: 'var(--border)' }} aria-label="Play" onClick={s.play}><Play size={16} /></button>}
      <button className={btn} style={{ borderColor: 'var(--border)' }} aria-label="Step forward" onClick={s.next}><SkipForward size={16} /></button>
      <button className={btn} style={{ borderColor: 'var(--border)' }} aria-label="Reset" onClick={s.reset}><RotateCcw size={16} /></button>
      <label className="ml-2 flex items-center gap-2 text-xs">Speed
        <input type="range" min="100" max="1200" step="100" value={1300 - s.speed} onChange={(e) => s.setSpeed(1300 - Number(e.target.value))} aria-label="Speed" />
      </label>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>Step {s.idx + 1} of {s.last + 1}</span>
    </div>
  );
}
