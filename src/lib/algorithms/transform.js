/**
 * Pure 2D transformation maths for Unit III (no React).
 * Points are [x, y]. Matrices are arrays of rows. Every builder returns a 3x3
 * homogeneous matrix so later topics can compose them with mul().
 * Rotation angles are in degrees, anticlockwise on a y-up grid.
 */

export const IDENTITY_3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const RAD = Math.PI / 180;

export const translate = (tx, ty) => [[1, 0, tx], [0, 1, ty], [0, 0, 1]];
export const scale = (sx, sy) => [[sx, 0, 0], [0, sy, 0], [0, 0, 1]];
export const rotate = (deg) => {
  const c = Math.cos(deg * RAD);
  const s = Math.sin(deg * RAD);
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
};
/** x' = x + shx*y, y' = y + shy*x */
export const shear = (shx, shy) => [[1, shx, 0], [shy, 1, 0], [0, 0, 1]];

export const REFLECTIONS = {
  x: [[1, 0, 0], [0, -1, 0], [0, 0, 1]],
  y: [[-1, 0, 0], [0, 1, 0], [0, 0, 1]],
  origin: [[-1, 0, 0], [0, -1, 0], [0, 0, 1]],
  diag: [[0, 1, 0], [1, 0, 0], [0, 0, 1]],
};
export const REFLECT_AXES = Object.keys(REFLECTIONS);
export const reflect = (axis) => REFLECTIONS[axis] ?? REFLECTIONS.x;

export const TRANSFORM_KINDS = ['translate', 'scale', 'rotate', 'shear', 'reflect'];
export const DEFAULT_PARAMS = { tx: 3, ty: 2, sx: 1.5, sy: 1.5, deg: 45, shx: 0.5, shy: 0, axis: 'x' };

export const SHAPES = {
  triangle: [[1, 1], [4, 1], [1, 3]],
  house: [[1, 1], [3, 1], [3, 2.5], [2, 3.5], [1, 2.5]],
};
export const vertexName = (i) => String.fromCharCode(65 + i);

/** A x B for any compatible sizes. */
export const mul = (A, B) => A.map((row) => B[0].map((_, j) => row.reduce((s, v, k) => s + v * B[k][j], 0)));
export const lerpMatrix = (A, B, t) => A.map((row, i) => row.map((v, j) => v + (B[i][j] - v) * t));

export const applyToPoint = (M, [x, y]) => [
  M[0][0] * x + M[0][1] * y + M[0][2],
  M[1][0] * x + M[1][1] * y + M[1][2],
];
export const applyToPoints = (M, pts) => pts.map((p) => applyToPoint(M, p));

/**
 * Matrix for one transformation. t in [0, 1] blends from "nothing happened yet"
 * to the full transformation, so labs can animate it smoothly.
 */
export function buildTransform(kind, p, t = 1) {
  switch (kind) {
    case 'scale': return scale(1 + (p.sx - 1) * t, 1 + (p.sy - 1) * t);
    case 'rotate': return rotate(p.deg * t);
    case 'shear': return shear(p.shx * t, p.shy * t);
    case 'reflect': return lerpMatrix(IDENTITY_3, reflect(p.axis), t);
    case 'translate':
    default: return translate(p.tx * t, p.ty * t);
  }
}

/** Split a 3x3 into the 2x2 part A and the move part T, so P' = A*P + T. */
export const affineParts = (M) => ({
  A: [[M[0][0], M[0][1]], [M[1][0], M[1][1]]],
  T: [M[0][2], M[1][2]],
});

/** Round for display; never returns -0. */
export const r2 = (v, d = 2) => {
  const f = 10 ** d;
  const x = Math.round(v * f) / f;
  return x === 0 ? 0 : x;
};
export const fmt = (v, d = 2) => String(r2(v, d));
const wrap = (v) => (v < 0 ? `(${v})` : `${v}`);

export const TRANSFORM_CODE = [
  'build matrix A and vector T for the chosen transformation',
  'for each vertex (x, y) of the shape:',
  '    x_new = a*x + b*y + tx',
  '    y_new = c*x + d*y + ty',
  '    plot the new vertex (x_new, y_new)',
  'join the new vertices in the same order',
];

/** One playback event per meaningful operation (same convention as line.js / circle.js). */
export function* transformSteps(pts, M) {
  const { A, T } = affineParts(M);
  const [[a, b], [c, d]] = A;
  const [tx, ty] = T;
  const ra = r2(a);
  const rb = r2(b);
  const rc = r2(c);
  const rd = r2(d);
  const rtx = r2(tx);
  const rty = r2(ty);
  yield {
    line: 0,
    plot: false,
    vars: { a: ra, b: rb, c: rc, d: rd, tx: rtx, ty: rty },
    note: 'Matrix ready: a, b, c, d come from A and tx, ty come from T.',
  };
  for (let i = 0; i < pts.length; i += 1) {
    const [x, y] = pts[i];
    const name = vertexName(i);
    const rx = r2(x);
    const ry = r2(y);
    const xn = a * x + b * y + tx;
    const yn = c * x + d * y + ty;
    const rxn = r2(xn);
    const ryn = r2(yn);
    yield {
      line: 1,
      plot: false,
      vertex: i,
      vars: { vertex: i + 1, x: rx, y: ry },
      note: `Take vertex ${name} = (${rx}, ${ry}).`,
    };
    yield {
      line: 2,
      plot: false,
      vertex: i,
      vars: { vertex: i + 1, x: rx, y: ry, x_new: rxn },
      note: `x_new = ${wrap(ra)}*${wrap(rx)} + ${wrap(rb)}*${wrap(ry)} + ${wrap(rtx)} = ${rxn}`,
    };
    yield {
      line: 3,
      plot: false,
      vertex: i,
      to: [xn, yn],
      vars: { vertex: i + 1, x: rx, y: ry, x_new: rxn, y_new: ryn },
      note: `y_new = ${wrap(rc)}*${wrap(rx)} + ${wrap(rd)}*${wrap(ry)} + ${wrap(rty)} = ${ryn}`,
    };
    yield {
      line: 4,
      plot: true,
      vertex: i,
      x: xn,
      y: yn,
      vars: { vertex: i + 1, x_new: rxn, y_new: ryn },
      note: `Plot ${name}' at (${rxn}, ${ryn}).`,
    };
  }
  yield {
    line: 5,
    plot: false,
    final: true,
    vars: { vertices: pts.length },
    note: `Join ${pts.map((_, i) => `${vertexName(i)}'`).join(', ')} in the same order. Done.`,
  };
}

/** Plot events only, as [x, y] pairs (handy for tests). */
export const collectVertices = (steps) => steps.filter((s) => s.plot).map((s) => [s.x, s.y]);
