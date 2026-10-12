import {
  applyToPoint, buildTransform, fmt, mul, rotate, scale, translate,
} from '../lib/algorithms/transform.js';

const exam = (points, terms, mistakes, questions) => ({ points, terms, mistakes, questions });

export const UNIT3 = {
  'transform-2d': {
    hinglish: [
      'Graph paper par bana ghar ko doosri jagah le jao, bada karo ya ghumao: har kone ka naya address nikalta hai. Ise 2D transformation (2D badlav) kehte hain.',
      'Translation (khiskaana) jagah badalta hai; scaling (aakar badalna) size; rotation (ghumana) angle; shearing (tirchha karna) shape.',
      'Reflection (aaina pratibimb) x-axis, y-axis, origin ya diagonal ke paar copy banata hai. Matrix har vertex par wahi niyam lagati hai.',
    ],
    english: [
      'A 2D transformation changes points in a flat picture.',
      'Translation moves a shape. Scaling changes its size.',
      'Rotation turns it. Shear slants it. Reflection flips it.',
      'Apply the same matrix rule to every vertex.',
    ],
    formulas: (v) => [
      '\\begin{bmatrix}x\\prime\\\\y\\prime\\\\1\\end{bmatrix}=\\begin{bmatrix}a&b&t_x\\\\c&d&t_y\\\\0&0&1\\end{bmatrix}\\begin{bmatrix}x\\\\y\\\\1\\end{bmatrix}',
      `\\text{Selected vertex: } (${v.x ?? 1},${v.y ?? 1}) \\longmapsto (${v.xNew ?? 1},${v.yNew ?? 1})`,
      `\\text{Operation: } ${v.kind ?? 'translate'}\\qquad \\text{vertices: } ${v.count ?? 3}`,
    ],
    example: {
      inputs: [{ key: 'tx', label: 'tx', default: 3 }, { key: 'ty', label: 'ty', default: 2 }],
      problem: (v) => `Translate triangle A(1,1), B(4,1), C(1,3) by (${v.tx}, ${v.ty}).`,
      solve: (v) => [
        `T = [[1,0,${v.tx}],[0,1,${v.ty}],[0,0,1]].`,
        `A' = (1+${v.tx}, 1+${v.ty}) = (${1 + v.tx}, ${1 + v.ty}).`,
        `B' = (4+${v.tx}, 1+${v.ty}) = (${4 + v.tx}, ${1 + v.ty}); C' = (${1 + v.tx}, ${3 + v.ty}).`,
      ],
    },
    exam: exam(
      ['Represent a point as a column vector; apply one matrix to every vertex.', 'Translation adds tx, ty; scaling multiplies coordinates; rotation uses sine and cosine.', 'Shear changes one coordinate using the other; reflection changes signs or swaps coordinates.', 'In homogeneous coordinates, affine transforms use a 3 x 3 matrix.'],
      ['Translation', 'Scaling', 'Rotation', 'Shear', 'Reflection', 'Homogeneous coordinates'],
      ['Applying a translation as a 2 x 2 multiplication.', 'Mixing degrees with radians in sine/cosine.', 'Scaling about the origin when the question specifies a fixed point.'],
      ['2 marks: Define a 2D transformation.', '5 marks: Write the matrices for translation, rotation and scaling.', '10 marks: Transform a triangle using rotation and translation, showing every vertex.'],
    ),
    quiz: [
      { q: 'Which operation changes only the position?', options: ['Translation', 'Scaling', 'Shearing'], answer: 0, why: 'Translation moves each point by the same offset.' },
      { q: 'For anticlockwise rotation by θ, x′ is:', options: ['x cosθ − y sinθ', 'x cosθ + y sinθ', 'x + tx'], answer: 0, why: 'The first row of the rotation matrix gives x′.' },
      { q: 'A 3 x 3 homogeneous affine matrix has last row:', options: ['[0, 0, 1]', '[1, 0, 0]', '[0, 1, 1]'], answer: 0, why: 'This keeps homogeneous w equal to one.' },
    ],
  },
  homogeneous: {
    hinglish: [
      'Kisi point ko (x,y) wale do-number address se (x,y,1) banao. Teesra number homogeneous coordinate (samaan roop coordinate) hai.',
      '2x2 matrix x,y ko ghumaa ya scale kar sakti hai, par usme alag se tx,ty jodne ki jagah nahi. Isliye translation ko multiply nahi kar sakte.',
      '3x3 matrix ki aakhri column mein tx,ty rakh do. Ab translation, rotation aur scaling sab ek hi matrix guna se ho jaate hain.',
    ],
    english: [
      'Write a 2D point as the column (x, y, 1).',
      'A 2 x 2 matrix cannot add a fixed translation offset.',
      'A 3 x 3 matrix stores that offset in its last column.',
      'Now translation and other affine transforms use one matrix multiply.',
    ],
    formulas: (v) => [
      '\\begin{bmatrix}x\\prime\\\\y\\prime\\\\1\\end{bmatrix}=\\begin{bmatrix}1&0&t_x\\\\0&1&t_y\\\\0&0&1\\end{bmatrix}\\begin{bmatrix}x\\\\y\\\\1\\end{bmatrix}',
      `\\text{2x2 result: } (${v.twoX ?? 1},${v.twoY ?? 2});\\quad \\text{3x3 result: } (${v.newX ?? 4},${v.newY ?? 6},1)`,
      `\\text{Translation cannot be a 2x2 linear map: } M(0,0)=(0,0)\\ne(${v.tx ?? 3},${v.ty ?? 4})`,
    ],
    example: {
      inputs: [{ key: 'x', label: 'x', default: 2 }, { key: 'y', label: 'y', default: 1 }],
      problem: (v) => `Use homogeneous coordinates to translate P(${v.x}, ${v.y}) by (3, 4).`,
      solve: (v) => [
        `P = [${v.x}, ${v.y}, 1]ᵀ and T = [[1,0,3],[0,1,4],[0,0,1]].`,
        `x′ = ${v.x} + 3 = ${v.x + 3}; y′ = ${v.y} + 4 = ${v.y + 4}.`,
        `Therefore P′ = (${v.x + 3}, ${v.y + 4}).`,
      ],
    },
    exam: exam(
      ['Represent Cartesian point (x,y) as homogeneous point (x,y,1).', 'A 2 x 2 linear transform fixes the origin, so it cannot perform non-zero translation.', 'Translation matrix is [[1,0,tx],[0,1,ty],[0,0,1]].', 'Homogeneous matrices make affine operations composable by multiplication.'],
      ['Homogeneous coordinate', 'Affine transformation', 'Column vector', 'Translation matrix'],
      ['Using row-vector formulas with column-vector matrices.', 'Putting translation in a 2 x 2 matrix.', 'Forgetting that the homogeneous coordinate remains 1 for affine transforms.'],
      ['2 marks: What is a homogeneous coordinate?', '5 marks: Explain why a 2 x 2 matrix cannot translate a point.', '10 marks: Derive 3 x 3 matrices for translation, rotation and scaling.'],
    ),
    quiz: [
      { q: 'The homogeneous form of point (x,y) is:', options: ['(x,y,1)', '(x,1,y)', '(1,x,y)'], answer: 0, why: 'The third coordinate w is one for ordinary affine points.' },
      { q: 'A linear 2 x 2 map sends the origin to:', options: ['The origin', 'The translation vector', 'Any point'], answer: 0, why: 'M times the zero vector is always zero.' },
      { q: 'In a 3 x 3 translation matrix, tx is at:', options: ['Row 1, column 3', 'Row 3, column 1', 'Row 2, column 2'], answer: 0, why: 'It multiplies the homogeneous coordinate in the first output row.' },
    ],
  },
  composition: {
    hinglish: [
      'Pehle kapde par rang karo phir silai, ya pehle silai phir rang: natija alag ho sakta hai. Transformations ka order bhi aise hi maayne rakhta hai.',
      'Column-vector niyam mein M = T × R ka matlab pehle R, phir T. Matrix multiplication ulta order se padhte hain.',
      'Origin ke bajay point P ke gird ghumane ke liye pehle −P se origin lao, phir rotate karo, phir +P wapas le jao.',
    ],
    english: [
      'Changing the order of transformations can change the result.',
      'With column vectors, M = T × R applies R first, then T.',
      'To rotate around a fixed point, move it to the origin, rotate, then move it back.',
      'The same move-to-origin method works for scaling about a fixed point.',
    ],
    formulas: (v) => [
      `M = ${v.order ?? 'T × R'}\\quad (\\text{rightmost operation happens first})`,
      `T(P)R T(-P):\\quad P=(${v.px ?? 2},${v.py ?? 1}),\\ P'=(${v.outX ?? 2},${v.outY ?? 1})`,
      `\\text{Reordered result: } (${v.swapX ?? 2},${v.swapY ?? 1})`,
    ],
    example: {
      inputs: [{ key: 'x', label: 'x', default: 1 }, { key: 'y', label: 'y', default: 0 }],
      problem: (v) => `Apply 90° anticlockwise rotation, then translation (2,0), to P(${v.x}, ${v.y}).`,
      solve: (v) => {
        const [x, y] = applyToPoint(mul(translate(2, 0), rotate(90)), [v.x, v.y]);
        const [sx, sy] = applyToPoint(mul(rotate(90), translate(2, 0)), [v.x, v.y]);
        return [`M = T(2,0) × R(90°); rightmost R is applied first.`, `R(${v.x},${v.y}) = (${-v.y},${v.x}), then T gives (${fmt(x)}, ${fmt(y)}).`, `If the order is reversed, the result is (${fmt(sx)}, ${fmt(sy)}), so order matters.`];
      },
    },
    exam: exam(
      ['Composite transformation matrix is the product of individual matrices.', 'For column vectors, the rightmost matrix acts first; matrix multiplication is not commutative.', 'Rotation about fixed P: T(P) R(θ) T(−P).', 'Scaling about fixed P: T(P) S T(−P).'],
      ['Composition', 'Non-commutative', 'Pivot point', 'Composite matrix'],
      ['Applying matrices left-to-right to column vectors.', 'Assuming TR = RT.', 'Leaving out the inverse translation when transforming about a pivot.'],
      ['2 marks: Does translation commute with rotation?', '5 marks: Derive rotation about an arbitrary point.', '10 marks: Compose scaling and rotation about a fixed point, showing order and results.'],
    ),
    quiz: [
      { q: 'For column vectors, in M = T × R, which happens first?', options: ['R', 'T', 'Both at once'], answer: 0, why: 'The rightmost matrix multiplies the point first.' },
      { q: 'To rotate around P, first apply:', options: ['T(−P)', 'T(P)', 'Scale by zero'], answer: 0, why: 'Move the pivot to the origin before rotating.' },
      { q: 'In general, R × T equals T × R:', options: ['False', 'True', 'Only for every pivot'], answer: 0, why: 'Matrix multiplication is not commutative.' },
    ],
  },
  'window-viewport': {
    hinglish: [
      'Bade nakshé ke ek chune hue tukde ko chhote phone screen mein fit karo. World window (duniya ka chuna hua hissa) ko viewport (screen ka dikhne wala dabba) mein map karna yahi hai.',
      'Pehle x aur y ki doori naapte hain. Dono taraf ka scale sx, sy nikalta hai; phir har point ko uske naye pixel address par bhejte hain.',
      'sx aur sy alag hon to gol vastu ande jaisi khinch jaati hai. Aspect ratio (lambai-chaudai ka anupat) bachane ke liye dono ko ek jaisa rakho.',
    ],
    english: [
      'A world window is the part of the world that we want to show.',
      'A viewport is the rectangle on the display where it appears.',
      'Scale x and y separately to fill the viewport.',
      'Different scales can stretch shapes. Equal scales preserve the aspect ratio.',
    ],
    formulas: (v) => [
      's_x=\\dfrac{x_{vmax}-x_{vmin}}{x_{wmax}-x_{wmin}},\\quad s_y=\\dfrac{y_{vmax}-y_{vmin}}{y_{wmax}-y_{wmin}}',
      'x_v=x_{vmin}+(x_w-x_{wmin})s_x,\\quad y_v=y_{vmin}+(y_w-y_{wmin})s_y',
      `\\text{Live scales: }s_x=${v.sx ?? 1},\\quad s_y=${v.sy ?? 1},\\quad \\text{distortion}=${v.distortion ?? 'none'}`,
    ],
    example: {
      inputs: [{ key: 'x', label: 'World x', default: 30 }, { key: 'y', label: 'World y', default: 20 }],
      problem: (v) => `A window (10,10) to (50,40) maps to viewport (0,0) to (800,600). Map point (${v.x},${v.y}).`,
      solve: (v) => {
        const sx = 800 / 40; const sy = 600 / 30;
        return [`sx = (800−0)/(50−10) = ${sx}; sy = (600−0)/(40−10) = ${sy}.`, `xv = 0 + (${v.x}−10) × ${sx} = ${(v.x - 10) * sx}.`, `yv = 0 + (${v.y}−10) × ${sy} = ${(v.y - 10) * sy}.`];
      },
    },
    exam: exam(
      ['Window defines the world-coordinate rectangle selected for display.', 'Viewport defines the display-coordinate rectangle receiving the image.', 'Compute sx and sy from width and height ratios, then translate and scale each point.', 'Unequal sx and sy distort shape; uniform scaling preserves aspect ratio but may leave margins.'],
      ['World window', 'Viewport', 'Window-to-viewport mapping', 'Aspect ratio'],
      ['Using viewport width over window height.', 'Forgetting to subtract the window minimum before scaling.', 'Assuming sx = sy when the rectangle aspect ratios differ.'],
      ['2 marks: Define window and viewport.', '5 marks: Derive the window-to-viewport equations.', '10 marks: Map a rectangle between given window and viewport bounds and discuss distortion.'],
    ),
    quiz: [
      { q: 'The world window is:', options: ['The selected world-coordinate region', 'The physical monitor bezel', 'A clipping code'], answer: 0, why: 'It specifies the region of the scene to display.' },
      { q: 'The x scale factor is:', options: ['Viewport width / window width', 'Window height / viewport width', 'Always 1'], answer: 0, why: 'Horizontal extents determine sx.' },
      { q: 'Unequal sx and sy usually:', options: ['Distort shapes', 'Preserve circles', 'Remove translation'], answer: 0, why: 'Horizontal and vertical distances are scaled differently.' },
    ],
  },
  efficiency: {
    hinglish: [
      'Har baar dost ko poora pata likhne ke bajay pehle ek chhota shortcut note bana lo. Composite matrix (joda hua matrix) bana kar har point par sirf ek baar lagana aisa hi hai.',
      'Affine 3x3 matrix ki aakhri row hamesha [0,0,1] hoti hai. Ye pakke zero-one guna aur bekaar jod bachaati hai.',
      'Bahut se points hon to pehle transforms jodo, phir har point par ek composite matrix lagao. Ginti karke dekho kitne operations bachte hain.',
    ],
    english: [
      'Combine transforms into one composite matrix first.',
      'Then apply that matrix once to each point.',
      'An affine matrix always has the last row [0, 0, 1].',
      'Using this fixed row avoids unnecessary multiplications and additions.',
    ],
    formulas: (v) => [
      '\\begin{bmatrix}a&b&t_x\\\\c&d&t_y\\\\0&0&1\\end{bmatrix}\\begin{bmatrix}e&f&u_x\\\\g&h&u_y\\\\0&0&1\\end{bmatrix}=\\begin{bmatrix}ae+bg&af+bh&au_x+bu_y+t_x\\\\ce+dg&cf+dh&cu_x+du_y+t_y\\\\0&0&1\\end{bmatrix}',
      `\\text{Naive: } ${v.naive ?? 27} multiplications + ${v.naiveAdds ?? 18} additions;\\quad \\text{optimized: } ${v.fast ?? 12} + ${v.fastAdds ?? 8}`,
      `\\text{For }${v.points ?? 10}\\text{ points and }${v.transforms ?? 3}\\text{ transforms: compose once, reuse }M.`,
    ],
    example: {
      inputs: [{ key: 'n', label: 'Points', default: 10 }, { key: 'k', label: 'Transforms', default: 3 }],
      problem: (v) => `Compare applying ${v.k} affine transforms separately to ${v.n} points with composing first. Count 4 multiplications and 4 additions per transformed point; count 12 multiplications and 8 additions to compose each affine matrix pair.`,
      solve: (v) => {
        const separate = v.n * v.k * 4; const combined = Math.max(0, v.k - 1) * 12 + v.n * 4;
        return [`Separate: ${v.n} × ${v.k} × 4 = ${separate} multiplications for the points.`, `Compose once: (${v.k}−1) × 12 + ${v.n} × 4 = ${combined} multiplications.`, `Savings = ${separate - combined} multiplications, before counting the corresponding additions.`];
      },
    },
    exam: exam(
      ['An unrestricted 3 x 3 product uses 27 multiplications and 18 additions.', 'Affine matrices have bottom row [0,0,1], allowing a specialized product (12 multiplications, 8 additions).', 'Compose k fixed transforms once, then transform n points once instead of applying k transforms to every point.', 'Precomputation is especially useful when many vertices share the same composite transform.'],
      ['Operation count', 'Affine matrix', 'Composite transform', 'Precomputation'],
      ['Counting constant zero/one products as useful arithmetic.', 'Composing separately for every point.', 'Changing multiplication order for column vectors.'],
      ['2 marks: State the fixed last row of a 2D affine matrix.', '5 marks: Compare general and affine 3 x 3 matrix multiplication costs.', '10 marks: Compare operation counts for n points transformed by k matrices.'],
    ),
    quiz: [
      { q: 'The fixed last row of a 2D affine matrix is:', options: ['[0, 0, 1]', '[1, 1, 0]', '[0, 1, 0]'], answer: 0, why: 'This preserves the homogeneous coordinate.' },
      { q: 'A naive 3 x 3 matrix product uses:', options: ['27 multiplications and 18 additions', '9 multiplications and 9 additions', '12 multiplications and 8 additions'], answer: 0, why: 'Nine dot products each have three products and two additions.' },
      { q: 'Compose transforms first when:', options: ['Many points share the same transforms', 'There is only one point and no matrix', 'You want to reverse the point order'], answer: 0, why: 'Pay the composition cost once and reuse the result.' },
    ],
  },
  'transform-3d': {
    hinglish: [
      'Rubik cube ko haath me ghumao: har kone ka x, y, z address badalta hai. 3D transformation (teen aayami badlav) in teeno directions ko sambhalta hai.',
      'Homogeneous 3D point (x,y,z,1) hota hai. Isliye translation, scale aur X/Y/Z ghoomna 4x4 matrix mein fit hote hain.',
      'Canvas par dikhane ke liye 3D point ko camera projection (camera se 2D screen tak ka naksha) se guzaro. Cube ko kheenchkar bhi ghuma sakte ho.',
    ],
    english: [
      'A 3D point has x, y and z coordinates.',
      'A homogeneous 3D point is (x, y, z, 1).',
      'Translation, scale and rotation use 4 x 4 matrices.',
      'Project the transformed 3D points onto a 2D canvas to draw the cube.',
    ],
    formulas: (v) => [
      '\\mathbf{p}\\prime=T_zT_yT_xR_zR_yR_xS\\mathbf{p}',
      `\\text{Angles: }(${v.rx ?? 0}^\\circ,${v.ry ?? 0}^\\circ,${v.rz ?? 0}^\\circ),\\quad\\text{point after transform: }(${v.x ?? 1},${v.y ?? 1},${v.z ?? 1})`,
      'R_x=\\begin{bmatrix}1&0&0&0\\\\0&c&-s&0\\\\0&s&c&0\\\\0&0&0&1\\end{bmatrix}',
      'R_y=\\begin{bmatrix}c&0&s&0\\\\0&1&0&0\\\\-s&0&c&0\\\\0&0&0&1\\end{bmatrix}',
      'R_z=\\begin{bmatrix}c&-s&0&0\\\\s&c&0&0\\\\0&0&1&0\\\\0&0&0&1\\end{bmatrix}',
    ],
    example: {
      inputs: [{ key: 'x', label: 'Point x', default: 1 }, { key: 'y', label: 'Point y', default: 0 }],
      problem: (v) => `Rotate point (${v.x},${v.y},0) by 90° about the z-axis, then translate by (0,0,2).`,
      solve: (v) => [`Rz(90°) = [[0,−1,0],[1,0,0],[0,0,1]] on the xyz coordinates.`, `After rotation: (${fmt(-v.y)}, ${fmt(v.x)}, 0).`, `After translation: (${fmt(-v.y)}, ${fmt(v.x)}, 2).`],
    },
    exam: exam(
      ['Represent a 3D point as [x,y,z,1]ᵀ and affine transformations by 4 x 4 matrices.', 'X, Y and Z rotations use sine/cosine in the corresponding coordinate plane.', 'For column vectors, compose the desired matrices in reverse order of application.', 'Project transformed 3D points onto a 2D viewport for display.'],
      ['4 x 4 matrix', '3D homogeneous coordinates', 'Axis rotation', 'Projection'],
      ['Using 2D 3 x 3 matrices for 3D points.', 'Mixing the sign convention for sine terms across rotation axes.', 'Applying the camera projection before the world transformation.'],
      ['2 marks: Why are 4 x 4 matrices used for 3D affine transforms?', '5 marks: Write the 3D rotation matrices about X, Y and Z.', '10 marks: Transform and project a cube using a composed 4 x 4 matrix.'],
    ),
    quiz: [
      { q: 'A homogeneous 3D point is:', options: ['(x,y,z,1)', '(x,y,1)', '(x,y,z) only'], answer: 0, why: 'The fourth coordinate enables translation in matrix form.' },
      { q: 'Rotation about Z changes which coordinates?', options: ['x and y', 'y and z', 'x and z'], answer: 0, why: 'The point rotates in the xy-plane.' },
      { q: 'A 3D affine transform uses a:', options: ['4 x 4 matrix', '2 x 2 matrix', '3 x 3 matrix only'], answer: 0, why: 'Four homogeneous coordinates represent the transformed point.' },
    ],
  },
  'coordinate-change': {
    hinglish: [
      'Camera ke saamne kursi ko ghumao ya camera ko kursi ke gird ghumao: nazar mein dono ulte kadam jaise lagte hain. Coordinate frame (apna naapne ka axis-set) badalne par point ke numbers ulte badalte hain.',
      'Object ko +d se le jao to uske naye world coordinates badhte hain. Axes ko +d le jao to wahi point naye frame mein −d se dikhai deta hai.',
      'Frame ki rotation badlo to coordinates par inverse rotation lagti hai. Isliye object-motion aur frame-motion ko ek samajhkar sign mat bhoolo.',
    ],
    english: [
      'A point can be described in different coordinate frames.',
      'Moving an object by +d changes its world position by +d.',
      'Moving the coordinate axes by +d changes the point coordinates by −d.',
      'Changing a frame uses the inverse transform on coordinates.',
    ],
    formulas: (v) => [
      `\\mathbf{p}_{world}=T\\mathbf{p}_{object};\\quad\\mathbf{p}_{object}=T^{-1}\\mathbf{p}_{world}`,
      `\\text{Mode: }${v.mode ?? 'move object'}\\quad\\text{offset: }${v.dx ?? 2}\\quad\\text{same point coordinates: }${v.coordinate ?? 4}`,
      'T^{-1}(d)=T(-d),\\quad R^{-1}(\\theta)=R(-\\theta)',
    ],
    example: {
      inputs: [{ key: 'x', label: 'World x', default: 8 }, { key: 'd', label: 'Axis shift d', default: 3 }],
      problem: (v) => `A point is at world x=${v.x}. Move the coordinate axes by +${v.d}. What is its coordinate in the new frame?`,
      solve: (v) => [`New frame origin is at x=${v.d}.`, `Subtract the frame offset: x′ = ${v.x} − ${v.d} = ${v.x - v.d}.`, `The physical point did not move; only its coordinate description changed.`],
    },
    exam: exam(
      ['A coordinate frame defines the origin and basis used to describe a point.', 'Object-to-world conversion applies the frame transform; world-to-object applies its inverse.', 'Translating the object by +d adds d to world coordinates.', 'Translating axes by +d subtracts d from coordinates; rotations similarly use the inverse angle.'],
      ['Coordinate frame', 'Object coordinates', 'World coordinates', 'Inverse transformation'],
      ['Moving the axes and moving the object with the same sign.', 'Treating a change of coordinates as physical motion.', 'Forgetting to invert the frame transformation.'],
      ['2 marks: What is a coordinate frame?', '5 marks: Explain object motion versus coordinate-system motion.', '10 marks: Derive the inverse coordinate transform for a translated and rotated frame.'],
    ),
    quiz: [
      { q: 'If axes shift by +d, coordinates of a fixed point:', options: ['Decrease by d', 'Increase by d', 'Stay equal for every point'], answer: 0, why: 'The origin moved toward the fixed point, so its relative coordinate shrinks.' },
      { q: 'World-to-object coordinates use:', options: ['The inverse frame transform', 'The same object-to-world transform', 'No transformation'], answer: 0, why: 'Undo the transform that placed the object frame in the world.' },
      { q: 'Changing a coordinate frame necessarily moves the physical point:', options: ['No', 'Yes', 'Only on the x-axis'], answer: 0, why: 'It changes the description, not the physical point.' },
    ],
  },
};

export const UNIT3_IDS = Object.keys(UNIT3);

export const UNIT3_EXAM_FORMULAS = [
  { id: 'translation', title: '2D translation', latex: 'T(t_x,t_y)=\\begin{bmatrix}1&0&t_x\\\\0&1&t_y\\\\0&0&1\\end{bmatrix}', topicId: 'transform-2d' },
  { id: 'scaling', title: '2D scaling', latex: 'S(s_x,s_y)=\\begin{bmatrix}s_x&0&0\\\\0&s_y&0\\\\0&0&1\\end{bmatrix}', topicId: 'transform-2d' },
  { id: 'rotation', title: '2D anticlockwise rotation', latex: 'R(\\theta)=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta&0\\\\\\sin\\theta&\\cos\\theta&0\\\\0&0&1\\end{bmatrix}', topicId: 'transform-2d' },
  { id: 'shear', title: '2D shear', latex: 'H(sh_x,sh_y)=\\begin{bmatrix}1&sh_x&0\\\\sh_y&1&0\\\\0&0&1\\end{bmatrix}', topicId: 'transform-2d' },
  { id: 'reflection', title: 'Reflection about x-axis', latex: 'R_x=\\begin{bmatrix}1&0&0\\\\0&-1&0\\\\0&0&1\\end{bmatrix}', topicId: 'transform-2d' },
  { id: 'rotation-pivot', title: 'Rotation about a fixed point', latex: 'M=T(x_p,y_p)R(\\theta)T(-x_p,-y_p)', topicId: 'composition' },
  { id: 'viewport', title: 'Window-to-viewport mapping', latex: 'x_v=x_{vmin}+(x_w-x_{wmin})s_x,\\quad y_v=y_{vmin}+(y_w-y_{wmin})s_y', topicId: 'window-viewport' },
  { id: '3d-rotation-x', title: '3D rotation about x-axis', latex: 'R_x=\\begin{bmatrix}1&0&0&0\\\\0&c&-s&0\\\\0&s&c&0\\\\0&0&0&1\\end{bmatrix}', topicId: 'transform-3d' },
  { id: '3d-rotation-y', title: '3D rotation about y-axis', latex: 'R_y=\\begin{bmatrix}c&0&s&0\\\\0&1&0&0\\\\-s&0&c&0\\\\0&0&0&1\\end{bmatrix}', topicId: 'transform-3d' },
  { id: '3d-rotation-z', title: '3D rotation about z-axis', latex: 'R_z=\\begin{bmatrix}c&-s&0&0\\\\s&c&0&0\\\\0&0&1&0\\\\0&0&0&1\\end{bmatrix}', topicId: 'transform-3d' },
  { id: '3d-translation', title: '3D translation', latex: 'T=\\begin{bmatrix}1&0&0&t_x\\\\0&1&0&t_y\\\\0&0&1&t_z\\\\0&0&0&1\\end{bmatrix}', topicId: 'transform-3d' },
  { id: '3d-scaling', title: '3D scaling', latex: 'S=\\begin{bmatrix}s_x&0&0&0\\\\0&s_y&0&0\\\\0&0&s_z&0\\\\0&0&0&1\\end{bmatrix}', topicId: 'transform-3d' },
  { id: 'coordinate-inverse', title: 'World to object coordinates', latex: '\\mathbf{p}_{object}=T^{-1}\\mathbf{p}_{world}', topicId: 'coordinate-change' },
];

export function transformExample(point, kind, params) {
  return applyToPoint(buildTransform(kind, params), point);
}

export function aboutPoint(point, pivot, matrix) {
  return applyToPoint(mul(translate(pivot[0], pivot[1]), mul(matrix, translate(-pivot[0], -pivot[1]))), point);
}

export function scaleAbout(point, pivot, sx, sy) {
  return aboutPoint(point, pivot, scale(sx, sy));
}
