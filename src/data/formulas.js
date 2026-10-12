import { UNIT3_EXAM_FORMULAS } from './unit3.js';
import { ALL_TOPICS } from './topics.js';
import { LESSON_CONTENT } from './lessonIndex.js';

const f = (id, title, latex, topicId) => ({ id, title, latex, topicId });

const curatedFormulas = [
  // Unit 0: pixels, coordinates and storage
  f('pixel-count', 'Total pixels', '\\text{Pixels} = W \\times H', 'pixel-resolution'),
  f('aspect-ratio', 'Aspect ratio', '\\text{Aspect ratio} = \\dfrac{W}{H}', 'pixel-resolution'),
  f('frame-buffer', 'Frame-buffer memory', '\\text{Memory (bits)} = W \\times H \\times bpp', 'frame-buffer'),
  f('colour-count', 'Number of colours', '\\text{Colours} = 2^{bpp}', 'frame-buffer'),
  f('math-screen-y', 'Maths to screen coordinates', 'y_{screen} = (H - 1) - y_{math}', 'screen-coordinates'),
  f('sine-cosine', 'Point on a circle', 'x = r\\cos\\theta,\\quad y = r\\sin\\theta', 'basic-maths'),
  // Unit I: line, circle, ellipse and aliasing
  f('dda-steps', 'DDA step count and increments', '\\text{steps}=\\max(|\\Delta x|,|\\Delta y|),\\quad x_{inc}=\\dfrac{\\Delta x}{\\text{steps}},\\quad y_{inc}=\\dfrac{\\Delta y}{\\text{steps}}', 'scan-lines'),
  f('bresenham-p0', 'Bresenham initial decision parameter', 'p_0=2\\Delta y-\\Delta x\\quad (0\\le m\\le1)', 'scan-lines'),
  f('bresenham-negative', 'Bresenham update when p < 0', 'p_{k+1}=p_k+2\\Delta y', 'scan-lines'),
  f('bresenham-positive', 'Bresenham update when p ≥ 0', 'p_{k+1}=p_k+2(\\Delta y-\\Delta x)', 'scan-lines'),
  f('circle-equation', 'Circle equation', '(x-x_c)^2+(y-y_c)^2=r^2', 'scan-circles'),
  f('circle-p0', 'Midpoint circle initial parameter', 'p_0=1-r', 'scan-circles'),
  f('circle-symmetry', 'Eight-way circle symmetry', '(\\pm x,\\pm y),\\quad(\\pm y,\\pm x)', 'scan-circles'),
  f('ellipse-equation', 'Ellipse equation', '\\dfrac{(x-x_c)^2}{r_x^2}+\\dfrac{(y-y_c)^2}{r_y^2}=1', 'scan-ellipses'),
  f('ellipse-p1', 'Midpoint ellipse Region 1 parameter', 'p_{1,0}=r_y^2-r_x^2r_y+\\dfrac{r_x^2}{4}', 'scan-ellipses'),
  f('ellipse-switch', 'Ellipse Region 1/2 switch', '2r_y^2x\\ge2r_x^2y', 'scan-ellipses'),
  // Unit II: raster displays, clipping and device calculations
  f('frame-time', 'Frame time', 't_{frame}=\\dfrac{1}{f}', 'raster-scan'),
  f('line-time', 'Approximate scan-line time', 't_{line}\\approx\\dfrac{1}{f\\times N_{lines}}', 'raster-scan'),
  f('cohen-accept', 'Cohen–Sutherland trivial accept', 'code(P_1)\\mathbin{OR}code(P_2)=0', 'cohen-sutherland'),
  f('cohen-reject', 'Cohen–Sutherland trivial reject', 'code(P_1)\\mathbin{AND}code(P_2)\\ne0', 'cohen-sutherland'),
  f('parametric-line', 'Parametric line segment', 'P(t)=P_0+t(P_1-P_0),\\quad 0\\le t\\le1', 'cyrus-beck'),
  f('cyrus-beck', 'Cyrus–Beck intersection parameter', 't=-\\dfrac{N_i\\cdot(P_0-P_i)}{N_i\\cdot(P_1-P_0)}', 'cyrus-beck'),
  f('midpoint', 'Segment midpoint', 'M=\\left(\\dfrac{x_1+x_2}{2},\\dfrac{y_1+y_2}{2}\\right)', 'midpoint-subdivision'),
  f('dots-per-inch', 'Printer dots', '\\text{dots}=(W_{in}\\times dpi)(H_{in}\\times dpi)', 'hardcopy'),
  // Unit III: homogeneous 2D transforms, composition, viewing, 3D matrices
  ...UNIT3_EXAM_FORMULAS.map((formula) => ({ ...formula, unit: '3' })),
];

const lessonFormulas = ALL_TOPICS.flatMap((topic) => {
  const content = LESSON_CONTENT[topic.id];
  return content?.formulas
    ? content.formulas({}).map((latex, index) => ({
      id: `lesson-${topic.id}-${index}`,
      title: `${topic.title} · Formula ${index + 1}`,
      latex,
      topicId: topic.id,
      unit: topic.unit,
    }))
    : [];
});

const unique = new Map();
for (const formula of [...lessonFormulas, ...curatedFormulas]) {
  const key = `${formula.topicId}:${formula.latex}`;
  if (!unique.has(key)) unique.set(key, formula);
}

export const FORMULAS = [...unique.values()];
