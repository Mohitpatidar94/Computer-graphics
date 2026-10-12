import { useCallback, useEffect, useState } from 'react';

/** Drives playback over a precomputed array of generator steps. */
export function useStepper(steps) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // ms per step
  const last = Math.max(steps.length - 1, 0);

  useEffect(() => { setIdx(0); setPlaying(false); }, [steps]);
  useEffect(() => {
    if (!playing) return undefined;
    if (idx >= last) { setPlaying(false); return undefined; }
    const id = setTimeout(() => setIdx((i) => Math.min(i + 1, last)), speed);
    return () => clearTimeout(id);
  }, [playing, idx, last, speed]);

  return {
    idx, playing, speed, setSpeed, last,
    step: steps[idx],
    play: () => { if (idx >= last) setIdx(0); setPlaying(true); },
    pause: () => setPlaying(false),
    next: useCallback(() => { setPlaying(false); setIdx((i) => Math.min(i + 1, last)); }, [last]),
    back: useCallback(() => { setPlaying(false); setIdx((i) => Math.max(i - 1, 0)); }, []),
    reset: () => { setPlaying(false); setIdx(0); },
  };
}
