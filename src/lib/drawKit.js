/** Small canvas helpers shared by the Unit III labs. Pure drawing code, no React. */

export const snap = (v, step = 0.5) => Math.round(v / step) * step;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** A view of a wx x wy world window, centred on the origin, y pointing up. */
export function makeView(w, h, wx, wy) {
  const u = Math.min(w / wx, h / wy);
  return { u, w, h, wx, wy, X: (x) => w / 2 + x * u, Y: (y) => h / 2 - y * u };
}

/** Pointer event -> [worldX, worldY, pixelsPerUnit] for a canvas showing a wx x wy window. */
export function toWorld(e, wx, wy) {
  const r = e.currentTarget.getBoundingClientRect();
  const u = Math.min(r.width / wx, r.height / wy);
  return [(e.clientX - r.left - r.width / 2) / u, (r.height / 2 - (e.clientY - r.top)) / u, u];
}

const seg = (ctx, x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

export function drawGrid(ctx, v, border, text) {
  const hx = Math.floor(v.wx / 2);
  const hy = Math.floor(v.wy / 2);
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = border;
  for (let i = -hx; i <= hx; i += 1) seg(ctx, v.X(i), v.Y(-hy), v.X(i), v.Y(hy));
  for (let j = -hy; j <= hy; j += 1) seg(ctx, v.X(-hx), v.Y(j), v.X(hx), v.Y(j));
  ctx.strokeStyle = text;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1.5;
  seg(ctx, v.X(-hx), v.Y(0), v.X(hx), v.Y(0));
  seg(ctx, v.X(0), v.Y(-hy), v.X(0), v.Y(hy));
  ctx.fillStyle = text;
  ctx.globalAlpha = 0.65;
  ctx.font = '10px JetBrains Mono, monospace';
  for (let i = -hx; i <= hx; i += 2) if (i !== 0) ctx.fillText(String(i), v.X(i) - 4, v.Y(0) + 12);
  for (let j = -hy; j <= hy; j += 2) if (j !== 0) ctx.fillText(String(j), v.X(0) + 5, v.Y(j) + 3);
  ctx.fillText('x', v.X(hx) - 10, v.Y(0) - 6);
  ctx.fillText('y', v.X(0) + 6, v.Y(hy) + 10);
  ctx.restore();
}

/** Polygon / polyline through world points. */
export function drawPoly(ctx, v, pts, o = {}) {
  if (!pts.length) return;
  const { stroke = '#fff', fill = null, fillAlpha = 0.3, width = 2, dash = [], alpha = 1, close = true } = o;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.setLineDash(dash);
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(v.X(x), v.Y(y)) : ctx.moveTo(v.X(x), v.Y(y))));
  if (close && pts.length > 2) ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.globalAlpha = alpha * fillAlpha;
    ctx.fill();
    ctx.globalAlpha = alpha;
  }
  ctx.strokeStyle = stroke;
  ctx.stroke();
  ctx.restore();
}

/** Vertex dots with optional names; `ring` is the index of a dot to circle. */
export function drawDots(ctx, v, pts, { color, text, names = [], r = 5, ring = -1 } = {}) {
  ctx.save();
  ctx.font = '600 12px Inter, sans-serif';
  pts.forEach(([x, y], i) => {
    ctx.beginPath();
    ctx.arc(v.X(x), v.Y(y), r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = text;
    ctx.stroke();
    if (i === ring) {
      ctx.beginPath();
      ctx.arc(v.X(x), v.Y(y), r + 5, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    if (names[i]) {
      ctx.fillStyle = text;
      ctx.fillText(names[i], v.X(x) + 8, v.Y(y) - 8);
    }
  });
  ctx.restore();
}

export function drawArrow(ctx, v, from, to, color, width = 2) {
  const x1 = v.X(from[0]);
  const y1 = v.Y(from[1]);
  const x2 = v.X(to[0]);
  const y2 = v.Y(to[1]);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash([]);
  seg(ctx, x1, y1, x2, y2);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(ang - 0.4), y2 - 10 * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(ang + 0.4), y2 - 10 * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
