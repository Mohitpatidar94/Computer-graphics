import { describe, it, expect } from 'vitest';
import { regionCode, bits, csSteps, clipCS, cbSteps, msSteps } from './clipping.js';
import { videoSteps } from './raster.js';

const W = { xmin: 0, ymin: 0, xmax: 10, ymax: 10 };
const SQUARE = [[0, 0], [10, 0], [10, 10], [0, 10]];

describe('Cohen-Sutherland', () => {
  it('region codes in TBRL order', () => {
    expect(bits(regionCode(-1, -1, W))).toBe('0101');
    expect(bits(regionCode(12, 12, W))).toBe('1010');
    expect(regionCode(5, 5, W)).toBe(0);
  });
  it('accepts, rejects and clips', () => {
    expect(clipCS(2, 2, 8, 8, W)).toEqual([[2, 2], [8, 8]]);
    expect(clipCS(-5, 12, -1, 20, W)).toBeNull();
    expect(clipCS(-4, 2, 12, 8, W)).toEqual([[0, 3.5], [10, 7.25]]);
    const diag = clipCS(-2, -2, 12, 12, W);
    expect(diag[0][0]).toBeCloseTo(0); expect(diag[1][1]).toBeCloseTo(10);
  });
  it('emits the same result as steps end', () => {
    expect([...csSteps(-4, 2, 12, 8, W)].at(-1).status).toBe('accept');
  });
});

describe('Cyrus-Beck', () => {
  it('horizontal line through the square gives tE .25, tL .75', () => {
    const last = [...cbSteps([-5, 5], [15, 5], SQUARE)].at(-1);
    expect(last.tE).toBeCloseTo(0.25); expect(last.tL).toBeCloseTo(0.75);
    expect(last.seg).toEqual([[0, 5], [10, 5]]);
  });
  it('matches Cohen-Sutherland on the diagonal example', () => {
    const last = [...cbSteps([-4, 2], [12, 8], SQUARE)].at(-1);
    expect(last.tE).toBeCloseTo(0.25); expect(last.tL).toBeCloseTo(0.875);
    expect(last.seg[0][1]).toBeCloseTo(3.5); expect(last.seg[1][1]).toBeCloseTo(7.25);
  });
  it('rejects a line outside', () => {
    expect([...cbSteps([-5, 12], [15, 12], SQUARE)].at(-1).status).toBe('reject');
  });
});

describe('Midpoint subdivision', () => {
  it('finds the visible part within eps', () => {
    const acc = [...msSteps([-5, 5], [15, 5], W)].filter((s) => s.decision === 'accept');
    const xs = acc.flatMap((s) => [s.a[0], s.b[0]]);
    expect(Math.min(...xs)).toBeGreaterThan(-1); expect(Math.min(...xs)).toBeLessThan(1);
    expect(Math.max(...xs)).toBeGreaterThan(9); expect(Math.max(...xs)).toBeLessThan(11);
  });
  it('rejects at once when both ends share a side', () => {
    const s = [...msSteps([-5, 2], [-1, 8], W)];
    expect(s).toHaveLength(1); expect(s[0].decision).toBe('reject');
  });
});

describe('video controller', () => {
  it('visits every pixel in raster order', () => {
    const fb = Array.from({ length: 12 }, (_, i) => i);
    const px = [...videoSteps(4, 3, fb)].filter((s) => s.plot);
    expect(px).toHaveLength(12);
    expect(px.map((s) => s.address)).toEqual(fb);
    expect(px[5]).toMatchObject({ x: 1, y: 1, value: 5 });
  });
});
