/**
 * Line scan conversion as STEP GENERATORS.
 * Every yielded step: { line, x, y, plot, vars, note }
 *  - line: index into the pseudo-code array (for highlighting)
 *  - plot: true when a pixel is lit on this step
 *  - vars: plain object shown in the live variable table
 * The pixel grid, variable table and pseudo-code all read from the same steps.
 */

export const DDA_CODE = [
  'dx = x2 - x1;  dy = y2 - y1',
  'steps = max(|dx|, |dy|)',
  'xinc = dx / steps;  yinc = dy / steps',
  'x = x1;  y = y1',
  'repeat steps + 1 times:',
  '    plot( round(x), round(y) )',
  '    x = x + xinc;  y = y + yinc',
];

export const BRESENHAM_CODE = [
  'dx = |x2 - x1|;  dy = |y2 - y1|',
  'if dy > dx: swap roles of x and y (steep line)',
  'p = 2*dy - dx',
  'x = x1;  y = y1',
  'repeat dx + 1 times:',
  '    plot(x, y)',
  '    if p >= 0: step minor axis;  p = p + 2*(dy - dx)',
  '    else:      p = p + 2*dy',
  '    step major axis',
];

const roundHalfUp = (v) => Math.floor(v + 0.5);

export function* ddaSteps(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  yield { line: 0, plot: false, vars: { dx, dy }, note: 'Find dx and dy.' };
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  yield { line: 1, plot: false, vars: { dx, dy, steps }, note: 'Number of steps = larger of |dx|, |dy|.' };
  const xinc = steps === 0 ? 0 : dx / steps;
  const yinc = steps === 0 ? 0 : dy / steps;
  yield { line: 2, plot: false, vars: { dx, dy, steps, xinc, yinc }, note: 'Increment per step.' };
  let x = x1;
  let y = y1;
  for (let k = 0; k <= steps; k++) {
    const px = roundHalfUp(x);
    const py = roundHalfUp(y);
    yield { line: 5, plot: true, x: px, y: py, vars: { k, x: +x.toFixed(3), y: +y.toFixed(3), plotted: `(${px}, ${py})` }, note: 'Round and light the pixel.' };
    x += xinc;
    y += yinc;
    yield { line: 6, plot: false, vars: { k: k + 1, x: +x.toFixed(3), y: +y.toFixed(3) }, note: 'Add the increments.' };
  }
}

export function* bresenhamSteps(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x2 >= x1 ? 1 : -1;
  const sy = y2 >= y1 ? 1 : -1;
  const steep = dy > dx;
  const major = steep ? dy : dx; // runs along the longer axis
  const minor = steep ? dx : dy;
  yield { line: 0, plot: false, vars: { dx, dy }, note: 'Absolute differences.' };
  yield { line: 1, plot: false, vars: { dx, dy, steep: steep ? 'yes' : 'no' }, note: steep ? 'Steep line: y is the major axis.' : 'Gentle line: x is the major axis.' };
  let p = 2 * minor - major;
  yield { line: 2, plot: false, vars: { p }, note: 'Initial decision parameter p0 = 2*minor - major.' };
  let x = x1;
  let y = y1;
  yield { line: 3, plot: false, vars: { x, y, p }, note: 'Start at the first endpoint.' };
  for (let k = 0; k <= major; k++) {
    yield { line: 5, plot: true, x, y, vars: { k, x, y, p }, note: 'Light the pixel.' };
    if (k === major) break;
    if (p >= 0) {
      if (steep) x += sx; else y += sy;
      p += 2 * (minor - major);
      yield { line: 6, plot: false, vars: { k, x, y, p }, note: 'p >= 0: move diagonally (minor axis steps too).' };
    } else {
      p += 2 * minor;
      yield { line: 7, plot: false, vars: { k, x, y, p }, note: 'p < 0: stay on the same minor value.' };
    }
    if (steep) y += sy; else x += sx;
    yield { line: 8, plot: false, vars: { k: k + 1, x, y, p }, note: 'Step along the major axis.' };
  }
}

/** Collect only the lit pixels, for tests and compare mode. */
export const collectPixels = (gen) => [...gen].filter((s) => s.plot).map((s) => [s.x, s.y]);
