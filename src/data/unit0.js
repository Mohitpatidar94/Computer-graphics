// Unit 0 content. Pure data, plus small functions for live formulas and solved examples.
const mb = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(2)} MB` : `${(b / 1024).toFixed(2)} KB`);

export const UNIT0 = {
  'what-is-cg': {
    hinglish: [
      'Computer Graphics (computer se tasveer banane ki kala) ka matlab hai: numbers ko picture me badalna.',
      'Jaise graph paper par aap boxes rang kar ek chitra banate ho, computer bhi chhote boxes rangta hai.',
      'Game, movie ke effects, mobile ka map, sab Computer Graphics hai. Ye subject batata hai ye sab kaise hota hai.',
    ],
    english: [
      'Computer graphics means making pictures with a computer.',
      'The computer stores numbers. It turns those numbers into colored dots.',
      'Games, maps, movies and app screens all use computer graphics.',
      'This subject teaches how a computer creates and changes pictures.',
    ],
    formulas: () => ['\\text{Total pixels} = \\text{width} \\times \\text{height}'],
    example: {
      inputs: [{ key: 'w', label: 'Width', default: 100 }, { key: 'h', label: 'Height', default: 50 }],
      problem: (v) => `An image is ${v.w} pixels wide and ${v.h} pixels high. How many colour values (R, G, B) are stored?`,
      solve: (v) => [`Pixels = width x height = ${v.w} x ${v.h} = ${v.w * v.h}.`, 'Each pixel stores 3 values: red, green, blue.', `Total values = ${v.w * v.h} x 3 = ${v.w * v.h * 3}.`],
    },
    exam: {
      points: ['Computer Graphics is the creation, storage and manipulation of images using a computer.', 'Two kinds: passive (no user control) and interactive (user changes the picture).', 'A picture is built from pixels.', 'Main parts: input, processing, output (display).'],
      terms: ['Computer Graphics', 'Pixel', 'Interactive graphics', 'Rendering'],
      mistakes: ['Mixing up Computer Graphics (making images) with Image Processing (improving existing images).'],
      questions: ['2 marks: Define computer graphics.', '5 marks: Explain interactive and passive graphics.', '10 marks: Discuss applications of computer graphics.'],
    },
    quiz: [
      { q: 'Computer graphics mainly deals with:', options: ['Making and changing pictures by computer', 'Only typing text', 'Repairing hardware'], answer: 0, why: 'It is about creating and manipulating images.' },
      { q: 'A picture on screen is made of:', options: ['Pixels', 'Wires', 'Sounds'], answer: 0, why: 'Pixels are the small dots that form the picture.' },
      { q: 'A 10 x 10 image has how many pixels?', options: ['20', '100', '1000'], answer: 1, why: '10 x 10 = 100.' },
    ],
  },
  'pixel-resolution': {
    hinglish: [
      'Pixel (screen ka sabse chhota dot) jaise graph paper ka ek chhota box hai.',
      'Resolution (screen me kitne pixels hain) batata hai grid kitna bada hai, jaise 1920 x 1080.',
      'Pixels zyada = picture saaf. Pixels kam = picture blocky, jaise purane mobile ki photo.',
    ],
    english: [
      'A pixel is the smallest dot on a screen.',
      'Resolution is the number of pixels across and down.',
      'A screen of 1920 x 1080 has 1920 columns and 1080 rows.',
      'More pixels give a sharper picture. Fewer pixels look blocky.',
    ],
    formulas: (v) => ['\\text{Pixels} = W \\times H', `\\text{Now: } ${v.cols ?? 16} \\times ${v.rows ?? 10} = ${(v.cols ?? 16) * (v.rows ?? 10)}`],
    example: {
      inputs: [{ key: 'w', label: 'Width', default: 1920 }, { key: 'h', label: 'Height', default: 1080 }],
      problem: (v) => `Find the total pixels and the aspect ratio of a ${v.w} x ${v.h} screen.`,
      solve: (v) => {
        const g = (a, b) => (b ? g(b, a % b) : a);
        const d = g(v.w, v.h) || 1;
        return [`Total pixels = ${v.w} x ${v.h} = ${v.w * v.h}.`, `GCD of ${v.w} and ${v.h} is ${d}.`, `Aspect ratio = ${v.w / d} : ${v.h / d}.`];
      },
    },
    exam: {
      points: ['Pixel = picture element, the smallest addressable point on the screen.', 'Resolution = number of pixels horizontally x vertically.', 'Higher resolution means finer detail but needs more memory.', 'Aspect ratio = width : height.'],
      terms: ['Pixel', 'Resolution', 'Aspect ratio', 'Aliasing'],
      mistakes: ['Writing resolution as height x width. Convention is width x height.'],
      questions: ['2 marks: What is a pixel?', '2 marks: Define resolution.', '5 marks: How does resolution affect picture quality and memory?'],
    },
    quiz: [
      { q: 'Resolution 800 x 600 means:', options: ['800 columns and 600 rows', '800 rows and 600 columns', '800 colours'], answer: 0, why: 'Width comes first, then height.' },
      { q: 'More pixels usually give:', options: ['A blockier image', 'A sharper image', 'No change'], answer: 1, why: 'Finer grid means finer detail.' },
      { q: 'Pixel stands for:', options: ['Picture element', 'Print exchange line', 'Point extension'], answer: 0, why: 'Pixel = picture element.' },
    ],
  },
  'screen-coordinates': {
    hinglish: [
      'Screen par har pixel ka address hota hai (x, y), jaise cinema ki seat row aur number.',
      'Maths me y upar badhta hai. Lekin screen par (0,0) upar-left corner me hota hai aur y neeche badhta hai.',
      'Isiliye math wale (x, y) ko screen par laane ke liye y ko ulta karna padta hai.',
    ],
    english: [
      'Every pixel has an address written as (x, y).',
      'On a screen, the origin (0, 0) is at the top-left corner.',
      'x grows to the right. y grows downward.',
      'In school maths, y grows upward. This is a common surprise.',
    ],
    formulas: (v) => ['y_{screen} = (H - 1) - y_{math}', `\\text{Selected: } (${v.x ?? 0},\\ ${v.y ?? 0})`],
    example: {
      inputs: [{ key: 'H', label: 'Screen height', default: 600 }, { key: 'y', label: 'Maths y', default: 100 }],
      problem: (v) => `A screen is ${v.H} pixels high (rows 0 to ${v.H - 1}). A point has maths y = ${v.y}. Find its screen row.`,
      solve: (v) => ['Use y_screen = (H - 1) - y_math.', `y_screen = (${v.H} - 1) - ${v.y}.`, `y_screen = ${v.H - 1 - v.y}.`],
    },
    exam: {
      points: ['Screen origin is the top-left corner.', 'x increases rightward, y increases downward.', 'Device coordinates are integers; world coordinates can be real numbers.', 'Conversion: y_screen = (H - 1) - y_math.'],
      terms: ['Origin', 'Device coordinates', 'World coordinates', 'Raster'],
      mistakes: ['Forgetting that screen y points down.', 'Using H instead of H - 1 for zero-based rows.'],
      questions: ['2 marks: Where is the origin on a screen?', '5 marks: Explain the screen coordinate system with a diagram.'],
    },
    quiz: [
      { q: 'Screen origin (0, 0) is at:', options: ['Top-left', 'Bottom-left', 'Centre'], answer: 0, why: 'Most screens place the origin at the top-left.' },
      { q: 'On the screen, y increases:', options: ['Upward', 'Downward', 'Diagonally'], answer: 1, why: 'Rows are counted from the top.' },
      { q: 'H = 100 rows, maths y = 10. Screen row is:', options: ['89', '90', '10'], answer: 0, why: '(100 - 1) - 10 = 89.' },
    ],
  },
  'frame-buffer': {
    hinglish: [
      'Frame Buffer (screen ki memory) ek bada notebook hai jisme har pixel ka color likha hota hai.',
      'Display us notebook ko baar baar padhta hai aur screen par rang dikhata hai.',
      'Rang ke liye jitne bits chahiye utni memory lagti hai. Bits per pixel jitne zyada, rang utne zyada.',
    ],
    english: [
      'The frame buffer is a block of memory.',
      'It stores the color of every pixel.',
      'The display reads it again and again to draw the screen.',
      'More bits per pixel means more colors and more memory.',
    ],
    formulas: (v) => ['\\text{Memory (bits)} = W \\times H \\times \\text{bpp}', `\\text{Colours} = 2^{\\text{bpp}}`, v.bytes ? `\\text{Now: } ${v.W} \\times ${v.H} \\times ${v.bpp} \\div 8 = ${v.bytes}\\ \\text{bytes}` : '\\text{Change the controls to see live values}'],
    example: {
      inputs: [{ key: 'W', label: 'Width', default: 1024 }, { key: 'H', label: 'Height', default: 768 }, { key: 'bpp', label: 'Bits per pixel', default: 8 }],
      problem: (v) => `Find the frame buffer size for ${v.W} x ${v.H} with ${v.bpp} bits per pixel.`,
      solve: (v) => { const bytes = (v.W * v.H * v.bpp) / 8; return [`Pixels = ${v.W} x ${v.H} = ${v.W * v.H}.`, `Bits = ${v.W * v.H} x ${v.bpp} = ${v.W * v.H * v.bpp}.`, `Bytes = bits / 8 = ${bytes}.`, `That is ${mb(bytes)}.`]; },
    },
    exam: {
      points: ['Frame buffer (refresh buffer) holds the pixel values of the whole image.', 'Size = width x height x bits per pixel.', 'n bits per pixel give 2^n colours.', 'The video controller reads it every refresh cycle.'],
      terms: ['Frame buffer', 'Refresh buffer', 'Bits per pixel', 'Bit depth', 'Colour depth'],
      mistakes: ['Forgetting to divide by 8 when converting bits to bytes.'],
      questions: ['2 marks: What is a frame buffer?', '5 marks: Compute frame buffer size for 1024 x 768 at 8 bpp (answer 768 KB).'],
    },
    quiz: [
      { q: '8 bits per pixel gives how many colours?', options: ['8', '64', '256'], answer: 2, why: '2^8 = 256.' },
      { q: '100 x 100 at 1 bpp needs:', options: ['10,000 bits', '100 bits', '10,000 bytes'], answer: 0, why: '100 x 100 x 1 = 10,000 bits.' },
      { q: 'The frame buffer stores:', options: ['Pixel values', 'Printer ink', 'Keyboard keys'], answer: 0, why: 'It holds the colour of each pixel.' },
    ],
  },
  'basic-maths': {
    hinglish: [
      'Point (x, y) ka matlab hai x kadam daayen, y kadam upar. Graphics ka sara kaam isi par hota hai.',
      'sin aur cos se pata chalta hai point ghumne par kahan pahunchega. Matrix (numbers ka dabba) us ghumne ka formula rakhta hai.',
      'Matrix multiplication: row ke numbers ko column ke numbers se multiply karke jodo. Bas itna hi.',
    ],
    english: [
      'A point (x, y) says how far right and how far up.',
      'Sine and cosine tell where a point lands after turning.',
      'A matrix is a box of numbers that holds a rule.',
      'To multiply: take a row, take a column, multiply pairs, then add.',
    ],
    formulas: (v) => ['x\' = x\\cos\\theta - y\\sin\\theta,\\quad y\' = x\\sin\\theta + y\\cos\\theta', `\\theta = ${v.a ?? 0}^\\circ \\Rightarrow (x\', y\') = (${v.xr ?? 4}, ${v.yr ?? 2})`],
    example: {
      inputs: [{ key: 'x', label: 'x', default: 4 }, { key: 'y', label: 'y', default: 2 }, { key: 'a', label: 'Angle (deg)', default: 90 }],
      problem: (v) => `Rotate the point (${v.x}, ${v.y}) by ${v.a} degrees about the origin.`,
      solve: (v) => {
        const r = (v.a * Math.PI) / 180; const c = Math.cos(r); const s = Math.sin(r);
        const f = (n) => +n.toFixed(3);
        return [`cos ${v.a} = ${f(c)}, sin ${v.a} = ${f(s)}.`, `x' = ${v.x} x ${f(c)} - ${v.y} x ${f(s)} = ${f(v.x * c - v.y * s)}.`, `y' = ${v.x} x ${f(s)} + ${v.y} x ${f(c)} = ${f(v.x * s + v.y * c)}.`];
      },
    },
    exam: {
      points: ['Rotation by theta: x\' = x cos(theta) - y sin(theta), y\' = x sin(theta) + y cos(theta).', 'Matrix product: element (i, j) = row i of A dotted with column j of B.', 'Matrix multiplication is not commutative: AB is not equal to BA.', 'Angles in formulas are usually in radians in code, degrees in problems.'],
      terms: ['Vector', 'Matrix', 'Dot product', 'Radian'],
      mistakes: ['Using degrees in a calculator set to radians.', 'Multiplying matrices in the wrong order.'],
      questions: ['2 marks: Write the 2D rotation matrix.', '5 marks: Rotate (4, 2) by 90 degrees (answer (-2, 4)).'],
    },
    quiz: [
      { q: 'cos 0 degrees equals:', options: ['0', '1', '-1'], answer: 1, why: 'cos 0 = 1.' },
      { q: 'Is AB always equal to BA for matrices?', options: ['Yes', 'No'], answer: 1, why: 'Order matters. This is key in Unit III.' },
      { q: 'Rotating (1, 0) by 90 degrees gives:', options: ['(0, 1)', '(1, 0)', '(0, -1)'], answer: 0, why: 'x\' = cos 90 = 0, y\' = sin 90 = 1.' },
    ],
  },
};
