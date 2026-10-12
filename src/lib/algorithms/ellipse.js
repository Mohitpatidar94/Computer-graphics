/** Midpoint ellipse (Hearn and Baker form). Region 1: slope magnitude < 1. Region 2: slope magnitude >= 1. */
export const ELLIPSE_CODE = [
  'x = 0;  y = ry;  plot first point',
  'p1 = ry^2 - rx^2*ry + rx^2/4',
  'while 2ry^2*x < 2rx^2*y:   (Region 1)',
  '    x++;  if p1 < 0: p1 += 2ry^2*x + ry^2',
  '    else: y--;  p1 += 2ry^2*x - 2rx^2*y + ry^2',
  'p2 = ry^2(x+1/2)^2 + rx^2(y-1)^2 - rx^2 ry^2',
  'while y > 0:   (Region 2)',
  '    y--;  if p2 > 0: p2 += rx^2 - 2rx^2*y',
  '    else: x++;  p2 += 2ry^2*x - 2rx^2*y + rx^2',
];

export const symmetry4 = (cx, cy, x, y) => [
  { x: cx + x, y: cy + y, q: 0 }, { x: cx - x, y: cy + y, q: 1 },
  { x: cx - x, y: cy - y, q: 2 }, { x: cx + x, y: cy - y, q: 3 },
];

export function* ellipseSteps(cx, cy, rx, ry) {
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  let x = 0;
  let y = ry;
  let dx = 2 * ry2 * x;
  let dy = 2 * rx2 * y;
  let p = ry2 - rx2 * ry + rx2 / 4;
  const mk = (line, region, plot, note) => ({ line, region, plot, x, y, pts: plot ? symmetry4(cx, cy, x, y) : undefined, vars: { region, x, y, p, '2ry²x': dx, '2rx²y': dy }, note });
  yield mk(1, 1, false, 'Region 1 start: p1 = ry² - rx²·ry + rx²/4.');
  yield mk(0, 1, true, 'Plot the first point (0, ry).');
  while (dx < dy) {
    x += 1; dx += 2 * ry2;
    if (p < 0) { p += dx + ry2; } else { y -= 1; dy -= 2 * rx2; p += dx - dy + ry2; }
    yield mk(p < 0 ? 3 : 4, 1, true, 'Region 1: step x, maybe step y down.');
  }
  p = ry2 * (x + 0.5) ** 2 + rx2 * (y - 1) ** 2 - rx2 * ry2;
  yield { ...mk(5, 2, false, 'Slope reached -1: switch to Region 2.'), switchPoint: true };
  while (y > 0) {
    y -= 1; dy -= 2 * rx2;
    if (p > 0) { p += rx2 - dy; } else { x += 1; dx += 2 * ry2; p += dx - dy + rx2; }
    yield mk(p > 0 ? 7 : 8, 2, true, 'Region 2: step y down, maybe step x.');
  }
}

export const ellipseQuadrant = (rx, ry) => [...ellipseSteps(0, 0, rx, ry)].filter((s) => s.plot).map((s) => [s.x, s.y, s.region]);
