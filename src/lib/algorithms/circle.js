/** Midpoint circle as a step generator (centre at cx, cy). Also exports 8-way symmetry. */
export const CIRCLE_CODE = [
  'x = 0;  y = r;  p = 1 - r',
  'while x <= y:',
  '    plot 8 symmetric points of (x, y)',
  '    x = x + 1',
  '    if p < 0:  p = p + 2x + 1',
  '    else:      y = y - 1;  p = p + 2x - 2y + 1',
];

/** The 8 symmetric points. `o` (0..7) is the octant index used for colouring. */
export function symmetry8(cx, cy, x, y) {
  return [
    { x: cx + x, y: cy + y, o: 0 }, { x: cx + y, y: cy + x, o: 1 },
    { x: cx + y, y: cy - x, o: 2 }, { x: cx + x, y: cy - y, o: 3 },
    { x: cx - x, y: cy - y, o: 4 }, { x: cx - y, y: cy - x, o: 5 },
    { x: cx - y, y: cy + x, o: 6 }, { x: cx - x, y: cy + y, o: 7 },
  ];
}

export function* circleSteps(cx, cy, r) {
  let x = 0;
  let y = r;
  let p = 1 - r;
  yield { line: 0, plot: false, vars: { x, y, p }, note: 'Start at the top of the circle. p0 = 1 - r.' };
  while (x <= y) {
    yield { line: 2, plot: true, x, y, cx, cy, pts: symmetry8(cx, cy, x, y), vars: { x, y, p }, note: `Plot (${x}, ${y}) and its 7 mirror images.` };
    x += 1;
    if (p < 0) {
      p += 2 * x + 1;
      yield { line: 4, plot: false, vars: { x, y, p }, note: 'p < 0: midpoint is inside, keep y.' };
    } else {
      y -= 1;
      p += 2 * x - 2 * y + 1;
      yield { line: 5, plot: false, vars: { x, y, p }, note: 'p >= 0: midpoint is outside, decrease y.' };
    }
  }
}

/** Octant-1 points only, as [x, y], for tests. */
export const circleOctant = (r) => [...circleSteps(0, 0, r)].filter((s) => s.plot).map((s) => [s.x, s.y]);
