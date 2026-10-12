import { describe, it, expect } from 'vitest';
import { ddaSteps, bresenhamSteps, collectPixels } from './line.js';

describe('DDA', () => {
  it('draws (2,3) to (9,8) with 8 pixels', () => {
    const px = collectPixels(ddaSteps(2, 3, 9, 8));
    expect(px).toHaveLength(8);
    expect(px[0]).toEqual([2, 3]);
    expect(px.at(-1)).toEqual([9, 8]);
  });
  it('handles a single point', () => {
    expect(collectPixels(ddaSteps(4, 4, 4, 4))).toEqual([[4, 4]]);
  });
});

describe('Bresenham', () => {
  it('textbook example (20,10) to (30,18): p0 = 6 and 11 pixels', () => {
    const steps = [...bresenhamSteps(20, 10, 30, 18)];
    const first = steps.find((s) => s.line === 2);
    expect(first.vars.p).toBe(6);
    const px = steps.filter((s) => s.plot).map((s) => [s.x, s.y]);
    expect(px).toHaveLength(11);
    expect(px.slice(0, 4)).toEqual([[20, 10], [21, 11], [22, 12], [23, 12]]);
    expect(px.at(-1)).toEqual([30, 18]);
  });
  it('works in all octants, reaches both endpoints', () => {
    const pts = [[0, 0, 7, 3], [0, 0, 3, 7], [7, 3, 0, 0], [0, 7, 3, 0], [5, 5, 0, 9], [-4, 2, 3, -6]];
    for (const [a, b, c, d] of pts) {
      const px = collectPixels(bresenhamSteps(a, b, c, d));
      expect(px[0]).toEqual([a, b]);
      expect(px.at(-1)).toEqual([c, d]);
      expect(px).toHaveLength(Math.max(Math.abs(c - a), Math.abs(d - b)) + 1);
    }
  });
});
