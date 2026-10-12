import { describe, it, expect } from 'vitest';
import { circleOctant, circleSteps, symmetry8 } from './circle.js';
import { ellipseQuadrant, ellipseSteps, symmetry4 } from './ellipse.js';

describe('midpoint circle', () => {
  it('r = 10 gives the textbook octant', () => {
    expect(circleOctant(10)).toEqual([[0, 10], [1, 10], [2, 10], [3, 10], [4, 9], [5, 9], [6, 8], [7, 7]]);
  });
  it('p0 = 1 - r', () => {
    expect([...circleSteps(0, 0, 10)][0].vars.p).toBe(-9);
  });
  it('8-way symmetry gives 8 distinct points', () => {
    const s = new Set(symmetry8(50, 50, 3, 7).map((p) => `${p.x},${p.y}`));
    expect(s.size).toBe(8);
  });
});

describe('midpoint ellipse', () => {
  it('rx = 8, ry = 6 matches Hearn and Baker', () => {
    const pts = ellipseQuadrant(8, 6);
    expect(pts.map(([x, y]) => [x, y])).toEqual([[0, 6], [1, 6], [2, 6], [3, 6], [4, 5], [5, 5], [6, 4], [7, 3], [8, 2], [8, 1], [8, 0]]);
    expect(pts.filter((p) => p[2] === 1)).toHaveLength(8);
    expect(pts.filter((p) => p[2] === 2)).toHaveLength(3);
  });
  it('p1 starts at -332 and p2 at -23', () => {
    const steps = [...ellipseSteps(0, 0, 8, 6)];
    expect(steps[0].vars.p).toBe(-332);
    expect(steps.find((s) => s.switchPoint).vars.p).toBe(-23);
  });
  it('4-way symmetry', () => {
    expect(new Set(symmetry4(0, 0, 2, 3).map((p) => `${p.x},${p.y}`)).size).toBe(4);
  });
});
