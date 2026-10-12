import { useCanvas } from '../../hooks/useCanvas.js';
import { drawArrow, drawGrid, drawPoly, makeView } from '../../lib/drawKit.js';
import { SHAPES, applyToPoints, rotate, translate } from '../../lib/algorithms/transform.js';

const RENDERERS = {
  'transform-2d': (ctx, view, accent, text) => {
    drawPoly(ctx, view, SHAPES.triangle, { stroke: text, fill: text, fillAlpha: 0.12, dash: [5, 4] });
    drawPoly(ctx, view, applyToPoints(translate(2, 1), SHAPES.triangle), { stroke: accent, fill: accent, fillAlpha: 0.28 });
  },
  homogeneous: (ctx, view, accent, text) => {
    drawDots(ctx, view, [[1, 1]], { color: text, text, names: ['P(1,1)'] });
    drawArrow(ctx, view, [1, 1], [4, 3], accent);
    drawDots(ctx, view, [[4, 3]], { color: accent, text, names: ["P'(4,3)"] });
  },
  composition: (ctx, view, accent, text, time) => {
    const p = applyToPoints(rotate((time / 30) % 360), SHAPES.triangle);
    drawPoly(ctx, view, SHAPES.triangle, { stroke: text, dash: [5, 4], alpha: 0.6 });
    drawPoly(ctx, view, p, { stroke: accent, fill: accent, fillAlpha: 0.25 });
  },
  'window-viewport': (ctx, view, accent, text) => {
    drawPoly(ctx, view, [[-5, -3], [5, -3], [5, 3], [-5, 3]], { stroke: text, close: true });
    drawPoly(ctx, view, [[-2, -1], [2, -1], [2, 1], [-2, 1]], { stroke: accent, fill: accent, fillAlpha: 0.2 });
  },
  efficiency: (ctx, view, accent, text) => {
    drawPoly(ctx, view, [[-2, -1], [2, -1], [2, 1], [-2, 1]], { stroke: accent, fill: accent, fillAlpha: 0.2 });
    ctx.fillStyle = text;
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText('compose once → reuse', view.X(-4), view.Y(3));
  },
  'transform-3d': (ctx, view, accent, text, time) => {
    const angle = time / 900;
    const points = cube.map(([x, y, z]) => project(x, y, z, angle, angle * 0.7));
    ctx.strokeStyle = accent;
    edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(view.X(points[a][0]), view.Y(points[a][1]));
      ctx.lineTo(view.X(points[b][0]), view.Y(points[b][1]));
      ctx.stroke();
    });
    ctx.fillStyle = text;
    ctx.fillText('3D → 2D projection', view.X(-4), view.Y(3));
  },
  'coordinate-change': (ctx, view, accent, text) => {
    drawArrow(ctx, view, [0, 0], [3, 1], text);
    drawArrow(ctx, view, [0, 0], [1, 3], accent);
    drawDots(ctx, view, [[2, 1]], { color: text, text, names: ['same point'] });
  },
};

const cube = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

function project(x, y, z, ax, ay) {
  const x1 = x * Math.cos(ay) + z * Math.sin(ay);
  const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
  const y1 = y * Math.cos(ax) - z1 * Math.sin(ax);
  return [x1 / (3.4 - z1), y1 / (3.4 - z1)];
}

function drawDots(ctx, view, points, { color, text, names = [] }) {
  points.forEach(([x, y], i) => {
    ctx.beginPath();
    ctx.arc(view.X(x), view.Y(y), 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    if (names[i]) {
      ctx.fillStyle = text;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(names[i], view.X(x) + 7, view.Y(y) - 7);
    }
  });
}

export default function Unit3Hook({ topicId }) {
  const draw = (ctx, width, height, time, accent, border, text) => {
    const view = makeView(width, height, 12, 8);
    drawGrid(ctx, view, border, text);
    RENDERERS[topicId]?.(ctx, view, accent, text, time);
  };
  const ref = useCanvas(draw, [topicId], true);
  const captions = {
    'transform-2d': 'One shape, five ways to move it',
    homogeneous: 'A third coordinate makes translation a matrix',
    composition: 'The order changes the final point',
    'window-viewport': 'Map a world window into a screen viewport',
    efficiency: 'Compose a transform once; reuse it',
    'transform-3d': 'Rotate a 3D object before projecting it',
    'coordinate-change': 'Move the object or move the axes',
  };
  return (
    <div className="space-y-2">
      <canvas ref={ref} role="img" aria-label={captions[topicId]} className="w-full rounded-xl" style={{ aspectRatio: '3 / 1', background: 'rgba(0,0,0,0.16)' }} />
      <p className="text-xs" style={{ color: 'var(--muted)' }}>{captions[topicId]}</p>
    </div>
  );
}
