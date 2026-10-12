import { describe, expect, it } from 'vitest';
import {
  IDENTITY_3, REFLECT_AXES, SHAPES, TRANSFORM_CODE, TRANSFORM_KINDS,
  applyToPoint, applyToPoints, buildTransform, collectVertices, fmt, mul, reflect, rotate, scale, shear,
  transformSteps, translate,
} from './transform.js';

const close = (p, q) => {
  expect(p[0]).toBeCloseTo(q[0], 9);
  expect(p[1]).toBeCloseTo(q[1], 9);
};

describe('2D transformation matrices', () => {
  it('translates', () => close(applyToPoint(translate(2, 3), [1, 1]), [3, 4]));
  it('scales about the origin', () => close(applyToPoint(scale(2, 3), [4, 5]), [8, 15]));
  it('rotates 90 degrees anticlockwise', () => close(applyToPoint(rotate(90), [1, 0]), [0, 1]));
  it('shears in x', () => close(applyToPoint(shear(1, 0), [1, 2]), [3, 2]));
  it('reflects', () => {
    close(applyToPoint(reflect('x'), [2, 3]), [2, -3]);
    close(applyToPoint(reflect('y'), [2, 3]), [-2, 3]);
    close(applyToPoint(reflect('origin'), [2, 3]), [-2, -3]);
    close(applyToPoint(reflect('diag'), [2, 5]), [5, 2]);
  });
  it('mul applies the right matrix first', () => {
    close(applyToPoint(mul(translate(5, 0), rotate(90)), [1, 0]), [5, 1]);
  });
});

describe('buildTransform', () => {
  const p = { tx: 3, ty: 2, sx: 2, sy: 3, deg: 60, shx: 1, shy: 0.5, axis: 'diag' };
  it('is the identity at t = 0 for every kind', () => {
    TRANSFORM_KINDS.forEach((k) => {
      const M = buildTransform(k, p, 0);
      M.forEach((row, i) => row.forEach((v, j) => expect(v).toBeCloseTo(IDENTITY_3[i][j], 9)));
    });
  });
  it('matches the plain builders at t = 1', () => {
    expect(buildTransform('translate', p, 1)).toEqual(translate(3, 2));
    expect(buildTransform('scale', p, 1)).toEqual(scale(2, 3));
    expect(buildTransform('shear', p, 1)).toEqual(shear(1, 0.5));
    expect(buildTransform('reflect', p, 1)).toEqual(reflect('diag'));
  });
  it('knows every reflection axis', () => expect(REFLECT_AXES).toEqual(['x', 'y', 'origin', 'diag']));
});

describe('transformSteps', () => {
  const pts = SHAPES.triangle;
  const M = buildTransform('rotate', { deg: 90 }, 1);
  const steps = [...transformSteps(pts, M)];
  it('yields 4 steps per vertex plus start and finish', () => expect(steps.length).toBe(2 + 4 * pts.length));
  it('plots exactly the transformed vertices', () => {
    const got = collectVertices(steps);
    const want = applyToPoints(M, pts);
    got.forEach((g, i) => close(g, want[i]));
  });
  it('keeps line indexes inside the pseudo-code', () => {
    steps.forEach((s) => {
      expect(s.line).toBeGreaterThanOrEqual(0);
      expect(s.line).toBeLessThan(TRANSFORM_CODE.length);
    });
  });
  it('ends with a final step', () => expect(steps.at(-1).final).toBe(true));
});

describe('fmt', () => {
  it('never prints -0 and trims to 2 decimals', () => {
    expect(fmt(-0)).toBe('0');
    expect(fmt(Math.cos(Math.PI / 2))).toBe('0');
    expect(fmt(1.23456)).toBe('1.23');
  });
});