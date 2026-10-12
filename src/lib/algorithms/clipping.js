/** Line clipping as step generators. Coordinates are maths-style (y up). Window: {xmin, ymin, xmax, ymax}. */
const f = (v) => +v.toFixed(2);
const pt = (p) => `(${f(p[0])}, ${f(p[1])})`;

/** Region code bits: T=8, B=4, R=2, L=1 (written TBRL). */
export const regionCode = (x, y, w) => (y > w.ymax ? 8 : 0) | (y < w.ymin ? 4 : 0) | (x > w.xmax ? 2 : 0) | (x < w.xmin ? 1 : 0);
export const bits = (c) => c.toString(2).padStart(4, '0');

export const CS_CODE = [
  'code1 = region(P1);  code2 = region(P2)',
  'if (code1 OR code2) == 0000: ACCEPT',
  'if (code1 AND code2) != 0000: REJECT',
  'pick an outside endpoint; find the window edge it crosses',
  'move it to the intersection; recompute its code',
  'repeat from the accept/reject tests',
];

export function* csSteps(x1, y1, x2, y2, w) {
  let a = [x1, y1];
  let b = [x2, y2];
  let c1 = regionCode(a[0], a[1], w);
  let c2 = regionCode(b[0], b[1], w);
  const snap = (line, note, extra = {}) => ({
    line, note, a: [...a], b: [...b], c1, c2,
    vars: { P1: pt(a), P2: pt(b), code1: bits(c1), code2: bits(c2), 'code1 OR code2': bits(c1 | c2), 'code1 AND code2': bits(c1 & c2) },
    ...extra,
  });
  yield snap(0, 'Find the 4-bit region code (T B R L) of both endpoints.');
  for (let guard = 0; guard < 8; guard++) {
    if (!(c1 | c2)) { yield snap(1, 'Both codes are 0000: the whole line is inside. Accept.', { status: 'accept' }); return; }
    if (c1 & c2) { yield snap(2, 'The codes share a 1 bit: the whole line is on the outside of one edge. Reject.', { status: 'reject' }); return; }
    const movingA = c1 !== 0;
    const out = movingA ? c1 : c2;
    const [px, py] = movingA ? a : b;
    const [qx, qy] = movingA ? b : a;
    let x; let y; let edge;
    if (out & 8) { y = w.ymax; x = px + ((qx - px) * (w.ymax - py)) / (qy - py); edge = 'top'; }
    else if (out & 4) { y = w.ymin; x = px + ((qx - px) * (w.ymin - py)) / (qy - py); edge = 'bottom'; }
    else if (out & 2) { x = w.xmax; y = py + ((qy - py) * (w.xmax - px)) / (qx - px); edge = 'right'; }
    else { x = w.xmin; y = py + ((qy - py) * (w.xmin - px)) / (qx - px); edge = 'left'; }
    yield snap(3, `${movingA ? 'P1' : 'P2'} is outside. It crosses the ${edge} edge at ${pt([x, y])}.`, { cut: [x, y], edge });
    if (movingA) { a = [x, y]; c1 = regionCode(x, y, w); } else { b = [x, y]; c2 = regionCode(x, y, w); }
    yield snap(4, `Moved ${movingA ? 'P1' : 'P2'} to the edge. New code ${bits(movingA ? c1 : c2)}.`);
  }
}

export const clipCS = (x1, y1, x2, y2, w) => {
  const s = [...csSteps(x1, y1, x2, y2, w)].at(-1);
  return s.status === 'accept' ? [s.a, s.b] : null;
};

/* ---------- Cyrus-Beck (convex window, vertices counter-clockwise) ---------- */
export const CB_CODE = [
  'D = P1 - P0;  tE = 0;  tL = 1',
  'for each edge i (outward normal Ni, point Pi):',
  '    num = Ni . (P0 - Pi);   den = Ni . D',
  '    den == 0: parallel; if num > 0 then REJECT',
  '    t = -num / den',
  '    den < 0 (entering): tE = max(tE, t)',
  '    den > 0 (leaving):  tL = min(tL, t)',
  'if tE > tL: REJECT, else draw P(tE) to P(tL)',
];
export const outwardNormals = (poly) => poly.map((p, i) => { const q = poly[(i + 1) % poly.length]; return [q[1] - p[1], -(q[0] - p[0])]; });

export function* cbSteps(p0, p1, poly) {
  const N = outwardNormals(poly);
  const D = [p1[0] - p0[0], p1[1] - p0[1]];
  let tE = 0;
  let tL = 1;
  const at = (t) => [p0[0] + t * D[0], p0[1] + t * D[1]];
  yield { line: 0, tE, tL, vars: { D: pt(D), tE, tL }, note: 'Set D = P1 - P0, tE = 0 (entering), tL = 1 (leaving).' };
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i];
    const num = N[i][0] * (p0[0] - P[0]) + N[i][1] * (p0[1] - P[1]);
    const den = N[i][0] * D[0] + N[i][1] * D[1];
    const base = { edge: i, n: N[i], num, den };
    if (den === 0) {
      if (num > 0) { yield { ...base, line: 3, kind: 'parallel', tE, tL, status: 'reject', vars: { edge: i, num, den, tE, tL }, note: 'Parallel to the edge and outside it. Reject.' }; return; }
      yield { ...base, line: 3, kind: 'parallel', tE, tL, vars: { edge: i, num, den, tE, tL }, note: 'Parallel to the edge and inside it. Skip this edge.' };
      continue;
    }
    const t = -num / den;
    if (den < 0) { tE = Math.max(tE, t); yield { ...base, line: 5, kind: 'enter', t, tE, tL, vars: { edge: i, num, den, t: f(t), tE: f(tE), tL: f(tL) }, note: 'den < 0: the line enters here. tE = max(tE, t).' }; }
    else { tL = Math.min(tL, t); yield { ...base, line: 6, kind: 'leave', t, tE, tL, vars: { edge: i, num, den, t: f(t), tE: f(tE), tL: f(tL) }, note: 'den > 0: the line leaves here. tL = min(tL, t).' }; }
  }
  if (tE > tL) yield { line: 7, tE, tL, status: 'reject', vars: { tE: f(tE), tL: f(tL) }, note: 'tE > tL: no part of the line is inside. Reject.' };
  else yield { line: 7, tE, tL, status: 'accept', seg: [at(tE), at(tL)], vars: { tE: f(tE), tL: f(tL), 'P(tE)': pt(at(tE)), 'P(tL)': pt(at(tL)) }, note: 'Draw from P(tE) to P(tL).' };
}

/* ---------- Midpoint subdivision ---------- */
export const MS_CODE = [
  'segment AB: find code(A) and code(B)',
  'if both 0000: ACCEPT the segment',
  'if code(A) AND code(B) != 0000: REJECT',
  'if the segment is shorter than eps: stop (test its midpoint)',
  'M = (A + B) / 2;  repeat for AM and MB',
];

export function* msSteps(a0, b0, w, eps = 1) {
  let id = 0;
  function* rec(a, b, depth, parent) {
    const my = id++;
    const ca = regionCode(a[0], a[1], w);
    const cb = regionCode(b[0], b[1], w);
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const base = { id: my, parent, depth, a, b, ca, cb, m };
    const vars = { segment: `${pt(a)} to ${pt(b)}`, 'code(A)': bits(ca), 'code(B)': bits(cb), 'A AND B': bits(ca & cb) };
    if (!(ca | cb)) { yield { ...base, line: 1, decision: 'accept', vars, note: 'Both codes 0000: accept.' }; return; }
    if (ca & cb) { yield { ...base, line: 2, decision: 'reject', vars, note: 'Codes share a 1 bit: reject.' }; return; }
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < eps) {
      const inside = regionCode(m[0], m[1], w) === 0;
      yield { ...base, line: 3, decision: inside ? 'accept' : 'reject', tiny: true, vars, note: `Shorter than ${eps}: midpoint is ${inside ? 'inside, keep' : 'outside, drop'}.` };
      return;
    }
    yield { ...base, line: 4, decision: 'split', vars: { ...vars, M: pt(m) }, note: `Not decided: split at M = ${pt(m)}.` };
    yield* rec(a, m, depth + 1, my);
    yield* rec(m, b, depth + 1, my);
  }
  yield* rec(a0, b0, 0, null);
}
