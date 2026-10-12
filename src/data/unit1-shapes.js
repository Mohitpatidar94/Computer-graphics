import { circleSteps } from '../lib/algorithms/circle.js';
import { ellipseSteps, ellipseQuadrant } from '../lib/algorithms/ellipse.js';

export const UNIT1_SHAPES = {
  'scan-circles': {
    hinglish: [
      'Circle ko pixels me banana hai. Pura circle nikalne ki jagah sirf 1/8 hissa nikalte hain, baaki symmetry (shishe jaisi copy) se mil jata hai.',
      'Midpoint Circle Algorithm (beech ke point wala tareeka) har step me dekhta hai: agla pixel seedha jaye ya ek step neeche. Decision parameter p batata hai.',
      'p < 0 matlab midpoint circle ke andar hai, y wahi rahega. p >= 0 matlab bahar hai, y ek kam ho jayega.',
      'Ek point (x, y) mila to 8 points milte hain: (±x, ±y) aur (±y, ±x). Isse 8-way symmetry kehte hain.',
    ],
    english: [
      'We draw only one eighth of the circle.',
      'The other seven parts are mirror copies of it.',
      'At each step the algorithm picks between two pixels.',
      'A decision parameter p tells which pixel is closer to the true circle.',
      'If p is negative, y stays. If p is zero or positive, y goes down by one.',
      'Each computed point gives eight points. This is 8-way symmetry.',
    ],
    formulas: (v) => [
      'p_0 = 1 - r',
      'p_{k+1} = \\begin{cases} p_k + 2x_{k+1} + 1 & p_k < 0 \\\\ p_k + 2x_{k+1} - 2y_{k+1} + 1 & p_k \\ge 0 \\end{cases}',
      '(x, y) \\Rightarrow (\\pm x, \\pm y),\\ (\\pm y, \\pm x)',
      v.r !== undefined ? `\\text{Now: } r = ${v.r},\\ p_0 = ${v.p0}` : '\\text{Move the radius slider}',
    ],
    example: {
      inputs: [{ key: 'r', label: 'Radius', default: 10 }],
      problem: (v) => `Draw a circle of radius ${v.r} centred at the origin using the midpoint algorithm. Find the first octant.`,
      solve: (v) => {
        const plots = [...circleSteps(0, 0, Math.max(1, v.r))].filter((s) => s.plot);
        return [`p0 = 1 - r = ${1 - v.r}. Start at (0, ${v.r}).`, `Octant points with p before each decision: ${plots.map((s) => `(${s.x},${s.y}) p=${s.vars.p}`).join('; ')}.`, `The octant ends when x > y. Reflect each point 8 ways to get the full circle.`];
      },
    },
    exam: {
      points: ['Start point (0, r); initial p0 = 1 - r.', 'If p < 0: next point (x+1, y), p += 2x + 1 (using the new x).', 'If p >= 0: next point (x+1, y-1), p += 2x - 2y + 1 (new x, new y).', 'Stop when x >= y (one octant is done).', 'Draw the other 7 octants by 8-way symmetry; add the centre (xc, yc) to every point.'],
      terms: ['Midpoint circle', 'Decision parameter', '8-way symmetry', 'Octant', 'Circle equation x² + y² = r²'],
      mistakes: ['Forgetting to add the centre offset (xc, yc).', 'Stopping at x = y without plotting that point.', 'Using the old x or y in the p update.'],
      questions: ['2 marks: What is 8-way symmetry?', '5 marks: Plot a circle of radius 10 with the midpoint algorithm.', '10 marks: Derive the decision parameter of the midpoint circle algorithm.'],
    },
    quiz: [
      { q: 'Initial decision parameter p0 for radius r is:', options: ['1 - r', 'r - 1', '2r'], answer: 0, why: 'p0 = 1 - r (integer form).' },
      { q: 'When p < 0 the next pixel is:', options: ['(x+1, y)', '(x+1, y-1)', '(x, y-1)'], answer: 0, why: 'Midpoint is inside the circle, so y stays.' },
      { q: 'How many points does one computed (x, y) give?', options: ['4', '8', '2'], answer: 1, why: 'Eight-way symmetry.' },
      { q: 'We compute only one octant because:', options: ['Circle is symmetric', 'Memory is small', 'Pixels are square'], answer: 0, why: 'Mirror copies give the rest.' },
    ],
  },
  'scan-ellipses': {
    hinglish: [
      'Ellipse (anda jaisa gol, lamba aur chaudai alag) me radius do hain: rx (aada) aur ry (khada).',
      'Circle me 8-way symmetry thi, ellipse me sirf 4-way symmetry hoti hai: (±x, ±y). Isliye ek quadrant (1/4 hissa) nikalte hain.',
      'Quadrant ko do regions me todte hain. Region 1 me curve flat hai (slope < 1), x har step badhta hai. Region 2 me curve khadi hai (slope >= 1), y har step ghatta hai.',
      'Jis jagah 2ry²x >= 2rx²y ho jaye, wahin region badal jata hai. Dono regions ke alag decision parameters p1 aur p2 hote hain.',
    ],
    english: [
      'An ellipse has two radii: rx across and ry up.',
      'It has only 4-way symmetry, not 8-way.',
      'We draw one quadrant and mirror it.',
      'The quadrant is split into Region 1 and Region 2.',
      'In Region 1 the curve is flat, so x steps by one each time.',
      'In Region 2 the curve is steep, so y steps down by one each time.',
      'We switch when 2ry²x becomes at least 2rx²y.',
    ],
    formulas: (v) => [
      'p1_0 = r_y^2 - r_x^2 r_y + \\tfrac{1}{4} r_x^2',
      '\\text{Region 1: } p1 < 0 \\Rightarrow p1 + 2r_y^2 x + r_y^2;\\ \\text{else } p1 + 2r_y^2 x - 2r_x^2 y + r_y^2',
      'p2_0 = r_y^2\\left(x_0 + \\tfrac12\\right)^2 + r_x^2 (y_0 - 1)^2 - r_x^2 r_y^2',
      '\\text{Region 2: } p2 > 0 \\Rightarrow p2 + r_x^2 - 2r_x^2 y;\\ \\text{else } p2 + 2r_y^2 x - 2r_x^2 y + r_x^2',
      v.rx !== undefined ? `\\text{Now: } r_x = ${v.rx},\\ r_y = ${v.ry},\\ p1_0 = ${v.p10}` : '\\text{Move the sliders}',
    ],
    example: {
      inputs: [{ key: 'rx', label: 'rx', default: 8 }, { key: 'ry', label: 'ry', default: 6 }],
      problem: (v) => `Draw an ellipse with rx = ${v.rx}, ry = ${v.ry} centred at the origin. Find the first quadrant.`,
      solve: (v) => {
        const rx = Math.max(1, v.rx); const ry = Math.max(1, v.ry);
        const steps = [...ellipseSteps(0, 0, rx, ry)];
        const sw = steps.find((s) => s.switchPoint);
        const q = ellipseQuadrant(rx, ry);
        const r1 = q.filter((p) => p[2] === 1).map((p) => `(${p[0]},${p[1]})`).join(' ');
        const r2 = q.filter((p) => p[2] === 2).map((p) => `(${p[0]},${p[1]})`).join(' ');
        return [`p1_0 = ry² - rx²·ry + rx²/4 = ${steps[0].vars.p}.`, `Region 1 points: ${r1}.`, `Switch at (${sw.x}, ${sw.y}) because 2ry²x = ${sw.vars['2ry²x']} >= 2rx²y = ${sw.vars['2rx²y']}. p2_0 = ${sw.vars.p}.`, `Region 2 points: ${r2 || '(none)'}.`, 'Reflect with 4-way symmetry and add the centre.'];
      },
    },
    exam: {
      points: ['Ellipse equation: x²/rx² + y²/ry² = 1; only 4-way symmetry.', 'Region 1 (slope magnitude < 1): sample at unit x steps; start (0, ry).', 'Region 1 ends when 2ry²x >= 2rx²y.', 'Region 2 samples at unit y steps down to y = 0.', 'p1_0 = ry² - rx²ry + rx²/4 and p2_0 uses the last Region 1 point.'],
      terms: ['Midpoint ellipse', 'Region 1', 'Region 2', '4-way symmetry', 'Semi-axes rx, ry'],
      mistakes: ['Using 8-way symmetry for an ellipse.', 'Forgetting to update both 2ry²x and 2rx²y.', 'Starting Region 2 from (0, ry) instead of the last Region 1 point.'],
      questions: ['2 marks: Why is only 4-way symmetry possible?', '5 marks: Explain the two regions of the midpoint ellipse algorithm.', '10 marks: Plot the ellipse rx = 8, ry = 6 with the midpoint algorithm.'],
    },
    quiz: [
      { q: 'Ellipse symmetry is:', options: ['2-way', '4-way', '8-way'], answer: 1, why: 'Swapping x and y changes an ellipse, so 8-way fails.' },
      { q: 'Region 1 ends when:', options: ['2ry²x >= 2rx²y', 'x = y', 'p = 0'], answer: 0, why: 'This is where slope magnitude reaches 1.' },
      { q: 'In Region 2, each step moves:', options: ['x by 1', 'y down by 1', 'both by 1'], answer: 1, why: 'The curve is steep, so y is the sampling axis.' },
      { q: 'For rx = 8, ry = 6, the first point is:', options: ['(0, 6)', '(8, 0)', '(6, 8)'], answer: 0, why: 'Start at (0, ry).' },
    ],
  },
};
