import { bresenhamSteps } from '../lib/algorithms/line.js';

export const UNIT1_SCAN = {
  'scan-lines': {
    hinglish: [
      'Scan Conversion (seedhi line ko pixels me badalna) ka matlab: graph paper par pencil ki line ke upar aane wale boxes rang do.',
      'DDA (Digital Differential Analyzer) har step me x aur y thoda thoda badhata hai aur round karta hai. Simple hai, par decimal maths aur round karna padta hai.',
      'Bresenham sirf integers use karta hai. Ek decision parameter p batata hai agla pixel seedha jaye ya tirchha. Isliye tez hai.',
      'Dono ki line thodi seedhi-seedhi (staircase) dikhti hai. Isse Aliasing ya "jaggies" (zig-zag kinare) kehte hain.',
    ],
    english: [
      'Scan conversion turns a perfect line into lit pixels.',
      'DDA adds a small step to x and y each time. Then it rounds the result.',
      'Bresenham uses only whole numbers. A decision parameter picks the next pixel.',
      'Both methods make a staircase look on slanted lines. This is called aliasing.',
      'Bresenham is faster because it avoids floating-point math and rounding.',
    ],
    formulas: (v) => [
      'm = \\dfrac{\\Delta y}{\\Delta x},\\quad \\text{steps} = \\max(|\\Delta x|, |\\Delta y|),\\quad x_{inc} = \\dfrac{\\Delta x}{steps},\\ y_{inc} = \\dfrac{\\Delta y}{steps}',
      'p_0 = 2\\Delta y - \\Delta x,\\quad p_{k+1} = \\begin{cases} p_k + 2\\Delta y & p_k < 0 \\\\ p_k + 2(\\Delta y - \\Delta x) & p_k \\ge 0 \\end{cases}',
      v.dx !== undefined ? `\\text{Now: } \\Delta x = ${v.dx},\\ \\Delta y = ${v.dy},\\ p_0 = ${v.p0},\\ \\text{steps} = ${v.steps}` : '\\text{Move the endpoints to see live values}',
    ],
    example: {
      inputs: [{ key: 'x1', label: 'x1', default: 20 }, { key: 'y1', label: 'y1', default: 10 }, { key: 'x2', label: 'x2', default: 30 }, { key: 'y2', label: 'y2', default: 18 }],
      problem: (v) => `Use Bresenham to draw the line from (${v.x1}, ${v.y1}) to (${v.x2}, ${v.y2}).`,
      solve: (v) => {
        const steps = [...bresenhamSteps(v.x1, v.y1, v.x2, v.y2)];
        const dx = Math.abs(v.x2 - v.x1); const dy = Math.abs(v.y2 - v.y1);
        const steep = dy > dx;
        const p0 = steps.find((s) => s.line === 2).vars.p;
        const out = [`dx = ${dx}, dy = ${dy}. ${steep ? 'Steep line (dy > dx): swap the roles of x and y.' : 'Gentle line (dx >= dy).'}`, `p0 = 2 x ${steep ? dx : dy} - ${steep ? dy : dx} = ${p0}.`];
        const plots = steps.filter((s) => s.plot);
        out.push(`Pixels plotted (${plots.length}): ${plots.slice(0, 12).map((s) => `(${s.x},${s.y})`).join(' ')}${plots.length > 12 ? ' ...' : ''}`);
        out.push('Rule: if p < 0 only the major axis steps and p += 2*minor. If p >= 0 both axes step and p += 2*(minor - major).');
        return out;
      },
    },
    exam: {
      points: ['DDA: steps = max(|dx|,|dy|); xinc = dx/steps; yinc = dy/steps; round each point.', 'Bresenham: p0 = 2dy - dx; p < 0 gives p + 2dy, else p + 2(dy - dx) and y steps.', 'Bresenham uses integer addition only, so it is faster than DDA.', 'DDA suffers from round-off error that can drift on long lines.', 'Staircase effect on slanted lines is aliasing; anti-aliasing reduces it.'],
      terms: ['Scan conversion', 'Rasterization', 'DDA', 'Decision parameter', 'Aliasing', 'Octant'],
      mistakes: ['Applying the slope < 1 rules to a steep line. Swap x and y first.', 'Forgetting to plot the starting pixel.', 'Mixing up the two update formulas for p.'],
      questions: ['2 marks: What is scan conversion?', '5 marks: Compare DDA and Bresenham.', '10 marks: Derive Bresenham for slope 0 < m < 1 and draw (20,10) to (30,18).'],
    },
    quiz: [
      { q: 'DDA computes steps as:', options: ['max(|dx|, |dy|)', 'dx + dy', 'dx x dy'], answer: 0, why: 'The longer axis decides how many unit steps are needed.' },
      { q: 'Bresenham mainly avoids:', options: ['Integer addition', 'Floating-point rounding', 'Plotting pixels'], answer: 1, why: 'It uses integers only.' },
      { q: 'For (20,10) to (30,18), p0 is:', options: ['6', '-2', '16'], answer: 0, why: '2dy - dx = 16 - 10 = 6.' },
      { q: 'The staircase look of a slanted line is called:', options: ['Aliasing', 'Clipping', 'Shearing'], answer: 0, why: 'Aliasing (jaggies) comes from limited pixel resolution.' },
    ],
  },
};
