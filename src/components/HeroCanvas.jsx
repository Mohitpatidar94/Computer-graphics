import { useEffect, useRef } from 'react';
import { bresenhamSteps, collectPixels } from '../lib/algorithms/line.js';

/** Hero: a Bresenham line sweeps around a pixel grid, lit by the real algorithm. */
const COLS = 28;
const ROWS = 16;

export default function HeroCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = (time) => {
      const cs = Math.min(w / COLS, h / ROWS);
      const ox = (w - cs * COLS) / 2;
      const oy = (h - cs * ROWS) / 2;
      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue('--accent').trim() || '#4FD1FF';
      const gridCol = style.getPropertyValue('--border').trim();
      ctx.clearRect(0, 0, w, h);

      const cx = COLS / 2;
      const cy = ROWS / 2;
      const a = reduce ? 0.6 : time / 2200;
      const r = 6.5;
      const x2 = Math.round(cx + Math.cos(a) * r * 1.7);
      const y2 = Math.round(cy + Math.sin(a) * r);
      const px = collectPixels(bresenhamSteps(Math.round(cx), Math.round(cy), x2, y2));

      ctx.strokeStyle = gridCol;
      ctx.lineWidth = 1;
      for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(ox + i * cs, oy); ctx.lineTo(ox + i * cs, oy + ROWS * cs); ctx.stroke(); }
      for (let j = 0; j <= ROWS; j++) { ctx.beginPath(); ctx.moveTo(ox, oy + j * cs); ctx.lineTo(ox + COLS * cs, oy + j * cs); ctx.stroke(); }

      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 10;
      px.forEach(([x, y], i) => {
        ctx.globalAlpha = 1 - (i / px.length) * 0.55;
        ctx.fillRect(ox + x * cs + 1, oy + y * cs + 1, cs - 2, cs - 2);
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} role="img" aria-label="A line being drawn pixel by pixel on a grid" className="h-64 w-full sm:h-80" />;
}
