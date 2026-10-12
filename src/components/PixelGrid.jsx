import { useCanvas } from '../hooks/useCanvas.js';

/** lit: [{x,y,c?}], ideal: [[x1,y1,x2,y2]] drawn through pixel centres, mark: {x,y} ring. flipY = maths-style y-up. */
export default function PixelGrid({ cols, rows, lit = [], ideal = [], mark, flipY = false, onCell, label = 'Pixel grid' }) {
  const geom = (w, h) => { const cs = Math.min(w / cols, h / rows); return { cs, ox: (w - cs * cols) / 2, oy: (h - cs * rows) / 2 }; };
  const ry = (y) => (flipY ? rows - 1 - y : y);
  const ref = useCanvas((ctx, w, h, t, accent, border, text) => {
    const { cs, ox, oy } = geom(w, h);
    lit.forEach((p) => { ctx.fillStyle = p.c || accent; ctx.fillRect(ox + p.x * cs + 1, oy + ry(p.y) * cs + 1, cs - 2, cs - 2); });
    ctx.strokeStyle = border; ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(ox + i * cs, oy); ctx.lineTo(ox + i * cs, oy + rows * cs); ctx.stroke(); }
    for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(ox, oy + j * cs); ctx.lineTo(ox + cols * cs, oy + j * cs); ctx.stroke(); }
    ctx.fillStyle = text; ctx.globalAlpha = 0.6; ctx.font = `${Math.max(9, Math.min(12, cs * 0.45))}px "JetBrains Mono", monospace`; ctx.textAlign = 'center';
    const every = cs >= 24 ? 1 : cs >= 14 ? 2 : 5;
    for (let i = 0; i < cols; i += every) ctx.fillText(i, ox + (i + 0.5) * cs, oy - 3);
    ctx.textAlign = 'right';
    for (let j = 0; j < rows; j += every) ctx.fillText(j, ox - 3, oy + (ry(j) + 0.65) * cs);
    ctx.globalAlpha = 1;
    ideal.forEach(([x1, y1, x2, y2]) => {
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath();
      ctx.moveTo(ox + (x1 + 0.5) * cs, oy + (ry(y1) + 0.5) * cs); ctx.lineTo(ox + (x2 + 0.5) * cs, oy + (ry(y2) + 0.5) * cs); ctx.stroke(); ctx.setLineDash([]);
    });
    if (mark) { ctx.strokeStyle = '#FFB454'; ctx.lineWidth = 3; ctx.strokeRect(ox + mark.x * cs + 1, oy + ry(mark.y) * cs + 1, cs - 2, cs - 2); }
  }, [cols, rows, lit, ideal, mark, flipY]);

  const click = (e) => {
    if (!onCell) return;
    const r = e.currentTarget.getBoundingClientRect();
    const { cs, ox, oy } = geom(r.width, r.height);
    const x = Math.floor((e.clientX - r.left - ox) / cs);
    const y = Math.floor((e.clientY - r.top - oy) / cs);
    if (x >= 0 && x < cols && y >= 0 && y < rows) onCell(x, flipY ? rows - 1 - y : y);
  };
  return <canvas ref={ref} role="img" aria-label={label} onPointerDown={click} className="w-full touch-none rounded-xl" style={{ aspectRatio: `${cols + 1} / ${rows + 1}`, background: 'rgba(0,0,0,0.2)', cursor: onCell ? 'crosshair' : 'default' }} />;
}
