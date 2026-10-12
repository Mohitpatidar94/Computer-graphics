import { useCanvas } from '../../hooks/useCanvas.js';
import { drawSampled } from '../../lib/imageSample.js';
import { bresenhamSteps, collectPixels } from '../../lib/algorithms/line.js';

/** Short auto-playing "aha" animations, one kind per idea. */
export default function Hook({ kind }) {
  const ref = useCanvas((ctx, w, h, t, accent, border, text) => {
    if (kind === 'pixelate') {
      const levels = [4, 8, 16, 32, 64, 128];
      const n = levels[Math.floor(t / 900) % levels.length];
      const s = Math.min(w, h) - 24;
      drawSampled(ctx, (w - s) / 2, 12, s, s, n, n);
      ctx.fillStyle = text; ctx.font = '14px Inter, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`${n} x ${n} pixels`, 12, h - 4);
    } else if (kind === 'coords') {
      const cols = 12; const rows = 6; const cs = Math.min(w / (cols + 1), h / (rows + 1));
      const ox = (w - cs * cols) / 2; const oy = (h - cs * rows) / 2 + 6;
      ctx.strokeStyle = border;
      for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(ox + i * cs, oy); ctx.lineTo(ox + i * cs, oy + rows * cs); ctx.stroke(); }
      for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(ox, oy + j * cs); ctx.lineTo(ox + cols * cs, oy + j * cs); ctx.stroke(); }
      const k = Math.floor(t / 350) % (cols + rows - 1);
      const x = Math.min(k, cols - 1); const y = Math.max(0, k - (cols - 1));
      ctx.fillStyle = accent; ctx.fillRect(ox + x * cs + 2, oy + y * cs + 2, cs - 4, cs - 4);
      ctx.fillStyle = text; ctx.font = '14px "JetBrains Mono", monospace'; ctx.fillText(`(${x}, ${y})  origin (0,0) is top-left, y goes DOWN`, ox, oy - 6);
    } else if (kind === 'buffer') {
      const n = 48; const cols = 12; const cs = Math.min(w / cols, (h - 20) / (n / cols));
      const ptr = Math.floor(t / 120) % n;
      for (let i = 0; i < n; i++) {
        const cx = (i % cols) * cs + (w - cols * cs) / 2; const cy = Math.floor(i / cols) * cs + 6;
        ctx.fillStyle = i === ptr ? accent : `hsl(${(i * 37) % 360} 60% ${i < ptr ? 55 : 28}%)`;
        ctx.fillRect(cx + 1, cy + 1, cs - 2, cs - 2);
      }
      ctx.fillStyle = text; ctx.font = '13px Inter, sans-serif'; ctx.fillText('The display reads each memory cell and lights that pixel', 8, h - 4);
    } else if (kind === 'line') {
      const cols = 20; const rows = 9; const cs = Math.min(w / cols, h / rows);
      const ox = (w - cs * cols) / 2; const oy = (h - cs * rows) / 2;
      const px = collectPixels(bresenhamSteps(1, 1, 18, 7));
      const n = (Math.floor(t / 180) % (px.length + 6)) + 1;
      ctx.strokeStyle = border;
      for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(ox + i * cs, oy); ctx.lineTo(ox + i * cs, oy + rows * cs); ctx.stroke(); }
      for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(ox, oy + j * cs); ctx.lineTo(ox + cols * cs, oy + j * cs); ctx.stroke(); }
      ctx.fillStyle = accent;
      px.slice(0, n).forEach(([x, y]) => ctx.fillRect(ox + x * cs + 1, oy + y * cs + 1, cs - 2, cs - 2));
      ctx.strokeStyle = '#fff'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ox + 1.5 * cs, oy + 1.5 * cs); ctx.lineTo(ox + 18.5 * cs, oy + 7.5 * cs); ctx.stroke(); ctx.setLineDash([]);
    } else if (kind === 'cube') {
      const cx = w / 2; const cy = h / 2; const a = t / 900; const sz = Math.min(w, h) * 0.22;
      const V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x, y, z]) => { const x1 = x * Math.cos(a) + z * Math.sin(a); const z1 = -x * Math.sin(a) + z * Math.cos(a); const y1 = y * Math.cos(a * 0.7) - z1 * Math.sin(a * 0.7); return [cx + x1 * sz, cy + y1 * sz]; });
      ctx.strokeStyle = accent; ctx.lineWidth = 2;
      [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(...V[i]); ctx.lineTo(...V[j]); ctx.stroke(); });
      ctx.lineWidth = 1; ctx.fillStyle = text; ctx.font = '13px Inter, sans-serif'; ctx.fillText('You can turn it and look from every side', 10, h - 8);
    } else if (kind === 'uses') {
      const C = ['#4FD1FF', '#FFB454', '#FF5CAA', '#B6F25C', '#A78BFA', '#F87171', '#34D399', '#FBBF24'];
      const cx = w / 2; const cy = h / 2; const R = Math.min(w, h) * 0.36;
      C.forEach((c, i) => { const a = t / 1500 + (i * Math.PI) / 4; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 10, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = text; ctx.font = '600 16px Poppins, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Graphics is everywhere', cx, cy + 5);
    } else if (kind === 'timeline') {
      const L = ['Vector', 'Raster', 'GPU', 'Real-time']; const k = Math.floor(t / 1100) % L.length;
      L.forEach((l, i) => { const x = 20 + i * ((w - 40) / 4); const bw = (w - 40) / 4 - 10; ctx.fillStyle = i <= k ? accent : border; ctx.fillRect(x, h / 2 - 22, bw, 44); ctx.fillStyle = i <= k ? '#0B1020' : text; ctx.font = '600 14px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(l, x + bw / 2, h / 2 + 5); });
    } else if (kind === 'flow') {
      const L = ['Model', 'Program', 'Graphics', 'Display']; const bw = (w - 40) / 4 - 14; const s = (t / 1400) % 3.999;
      L.forEach((l, i) => { const x = 20 + i * (bw + 14 + 4); ctx.strokeStyle = accent; ctx.strokeRect(x, h / 2 - 20, bw, 40); ctx.fillStyle = text; ctx.font = '13px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(l, x + bw / 2, h / 2 + 5); });
      ctx.fillStyle = '#FFB454'; ctx.beginPath(); ctx.arc(20 + bw / 2 + s * (bw + 18), h / 2 - 32, 7, 0, Math.PI * 2); ctx.fill();
    } else if (kind === 'circle' || kind === 'ellipse') {
      const cx = w / 2; const cy = h / 2; const rx = Math.min(w, h) * (kind === 'circle' ? 0.38 : 0.6); const ry = Math.min(w, h) * 0.38;
      const C = ['#4FD1FF', '#FFB454', '#FF5CAA', '#B6F25C', '#A78BFA', '#F87171', '#34D399', '#FBBF24'];
      ctx.strokeStyle = border; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      const a = ((t / 1800) % 1) * (Math.PI / 4);
      const x = Math.cos(a) * rx; const y = Math.sin(a) * ry;
      const pts = kind === 'circle' ? [[x, y], [y, x], [y, -x], [x, -y], [-x, -y], [-y, -x], [-y, x], [-x, y]] : [[x, y], [-x, y], [-x, -y], [x, -y]];
      pts.forEach(([px, py], i) => { ctx.fillStyle = C[i]; ctx.beginPath(); ctx.arc(cx + px, cy + py, 6, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = text; ctx.font = '13px Inter, sans-serif'; ctx.fillText(kind === 'circle' ? 'One computed point = 8 mirror points' : 'One computed point = 4 mirror points', 10, h - 8);
    } else {
      const cx = w / 2; const cy = h / 2; const r = Math.min(w, h) * 0.38; const a = t / 900;
      ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(8, cy); ctx.lineTo(w - 8, cy); ctx.moveTo(cx, 8); ctx.lineTo(cx, h - 8); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      const px = cx + Math.cos(a) * r; const py = cy - Math.sin(a) * r;
      ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.lineTo(px, py); ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = text; ctx.font = '13px "JetBrains Mono", monospace'; ctx.fillText(`cos = ${Math.cos(a).toFixed(2)}   sin = ${Math.sin(a).toFixed(2)}`, 10, 20);
    }
  }, [kind], true);
  return <canvas ref={ref} role="img" aria-label="Animation" className="h-56 w-full rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }} />;
}
