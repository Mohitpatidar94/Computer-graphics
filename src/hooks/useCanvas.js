import { useEffect, useRef } from 'react';

/** Canvas that resizes with its box (HiDPI aware). draw(ctx, w, h, time, accent). */
export function useCanvas(draw, deps = [], animate = false) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    const paint = (t) => {
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cs = getComputedStyle(document.documentElement);
      draw(ctx, w, h, reduce ? 1500 : t, cs.getPropertyValue('--accent').trim(), cs.getPropertyValue('--border').trim(), cs.getPropertyValue('--text').trim());
      if (animate && !reduce) raf = requestAnimationFrame(paint);
    };
    raf = requestAnimationFrame(paint);
    const ro = new ResizeObserver(() => paint(performance.now()));
    ro.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
