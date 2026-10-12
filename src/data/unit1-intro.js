const ex = (points, terms, mistakes, questions) => ({ points, terms, mistakes, questions });

export const USES = [
  { id: 'games', title: 'Games', text: 'Real-time 3D worlds redrawn 60 times a second.', kind: 'games' },
  { id: 'cad', title: 'CAD / Design', text: 'Engineers rotate and edit parts of machines and buildings.', kind: 'cad' },
  { id: 'medical', title: 'Medical imaging', text: 'CT and MRI slices become pictures of the body.', kind: 'medical' },
  { id: 'movies', title: 'Movies and VFX', text: 'Computer-made frames mixed with film.', kind: 'movies' },
  { id: 'sim', title: 'Simulation', text: 'Flight and driving trainers, weather and physics models.', kind: 'sim' },
  { id: 'gui', title: 'User interfaces', text: 'Windows, icons and menus on every device.', kind: 'gui' },
  { id: 'maps', title: 'Maps and GIS', text: 'Roads, terrain and routes drawn from data.', kind: 'maps' },
  { id: 'vr', title: 'VR and AR', text: 'Two slightly different images, one for each eye.', kind: 'vr' },
];

export const EVENTS = [
  { era: '1950s', title: 'Vector displays on CRTs', text: 'Early systems such as SAGE drew lines with an electron beam. The light pen let an operator point at the screen.', track: 'Hardware' },
  { era: '1963', title: 'Sketchpad', text: 'Ivan Sutherland showed that a person could draw and change pictures directly on a screen. This started interactive computer graphics.', track: 'Software' },
  { era: '1960s-70s', title: 'Refresh and storage-tube displays', text: 'Vector refresh displays needed fast memory and a display processor. Storage tubes were cheap but could not show animation.', track: 'Hardware' },
  { era: '1970s-80s', title: 'Raster displays and frame buffers', text: 'Falling memory prices allowed a frame buffer holding every pixel. Filled areas and colours became easy. Graphics workstations and GUIs appeared.', track: 'Hardware' },
  { era: '1980s', title: 'Graphics standards', text: 'Standards such as GKS (2D) and PHIGS (3D) made programs portable across devices. Early libraries drew the primitives for the programmer.', track: 'Software' },
  { era: '1990s', title: 'GPUs and OpenGL', text: 'Dedicated graphics chips took over geometry and pixel work. OpenGL (1992) and later DirectX gave programmers common APIs.', track: 'Both' },
  { era: 'Today', title: 'Programmable shaders and real-time ray tracing', text: 'Modern GPUs run small programs called shaders. APIs like Vulkan, Metal and DirectX 12 give close control of the hardware.', track: 'Both' },
];

export const CLASSIFY = [
  { by: 'By interaction', items: ['Non-interactive (passive): a printed chart or a film. The viewer cannot change it.', 'Interactive: the user changes the picture with input devices, such as a CAD program or a game.'] },
  { by: 'By dimension', items: ['2D: drawings, charts, user interfaces, maps.', '3D: models, games, simulation, medical volumes.'] },
  { by: 'By purpose', items: ['Design (CAD), presentation graphics, simulation and training, entertainment, art, cartography, scientific and medical visualization, user interfaces.'] },
  { by: 'By picture type', items: ['Line drawings, grey-scale images, full-colour images.'] },
];

export const FLOW = {
  boxes: {
    model: { x: 10, label: 'Application Model', note: 'The data about the objects: shapes, positions, colours. It is not the picture itself.' },
    program: { x: 185, label: 'Application Program', note: 'Builds and changes the model, handles input, and sends drawing requests.' },
    gs: { x: 360, label: 'Graphics System', note: 'Turns requests into pixels (scan conversion, clipping, transformation) and passes input to the program.' },
    display: { x: 535, label: 'Display', note: 'Shows the picture on the screen from the frame buffer.' },
    input: { x: 360, label: 'Input Devices', note: 'Mouse, keyboard, touch. User actions go to the graphics system first.' },
  },
  output: ['model', 'program', 'gs', 'display'],
  input: ['input', 'gs', 'program', 'model', 'program', 'gs', 'display'],
};

export const OVERVIEW_ROWS = {
  line: { name: 'Line: DDA / Bresenham', start: 'Endpoint (x1, y1)', param: 'DDA: none (floating increments). Bresenham: p0 = 2dy - dx', symmetry: 'None. Handle slopes by octant', stop: 'After max(|dx|, |dy|) steps', cost: 'DDA: float adds + rounding. Bresenham: integer adds only' },
  circle: { name: 'Circle: Midpoint', start: '(0, r)', param: 'p0 = 1 - r', symmetry: '8-way', stop: 'When x >= y', cost: 'Integer adds, about r/√2 steps' },
  ellipse: { name: 'Ellipse: Midpoint', start: '(0, ry)', param: 'p1_0 = ry² - rx²ry + rx²/4, then p2_0', symmetry: '4-way', stop: 'Region 1 until 2ry²x >= 2rx²y, Region 2 until y = 0', cost: 'Two regions, two parameters' },
};

export const UNIT1_INTRO = {
  'interactive-advantages': {
    hinglish: [
      'Interactive Graphics (jisme user picture ko chhoo kar badal sake) ka matlab hai: aap sirf dekhte nahi, picture se baat bhi karte ho.',
      'Jaise cricket ka scoreboard photo sirf dikhata hai. Lekin mobile ka map aap zoom aur ghuma sakte ho. Wo interactive hai.',
      'Faayde: picture se jaldi samajh aata hai, 3D cheez ghuma kar dekh sakte hain, badlaav turant dikhta hai, aur kharcha kam hota hai (prototype banana nahi padta).',
    ],
    english: [
      'Interactive graphics lets the user change the picture while looking at it.',
      'A photo is fixed. A map on a phone can be zoomed and turned.',
      'Pictures carry more information than text in less time.',
      'You can rotate a 3D object and see every side.',
      'Changes show up at once, so users learn and fix mistakes quickly.',
    ],
    formulas: (v) => ['\\text{Time per frame} = \\dfrac{1}{\\text{frames per second}}', v.fps ? `\\text{Now: } 1000 / ${v.fps} = ${(1000 / v.fps).toFixed(1)}\\ \\text{ms}` : '\\text{Drag the shape to see it update}'],
    example: {
      inputs: [{ key: 'fps', label: 'Frames/s', default: 30 }],
      problem: (v) => `An interactive program redraws the screen ${v.fps} times per second. How much time does it have for each frame?`,
      solve: (v) => ['Time per frame = 1000 ms / frames per second.', `= 1000 / ${v.fps} = ${(1000 / Math.max(1, v.fps)).toFixed(2)} ms.`, 'The program must read input, update the model and redraw within this time.'],
    },
    exam: ex(['Pictures communicate more information, faster, than text.', 'The user can see 3D structure by rotating the object.', 'Dynamic control: animation and instant feedback.', 'Easy modification: change and view again immediately.', 'Reduces cost by replacing physical prototypes with models.'], ['Interactive graphics', 'Real-time', 'Feedback', 'Animation'], ['Writing only "pictures are better". Give at least four distinct advantages with an example each.'], ['2 marks: What is interactive graphics?', '5 marks: List the advantages of interactive graphics.', '10 marks: Explain with examples why interactive graphics is better than static output.']),
    quiz: [
      { q: 'Which is interactive?', options: ['A printed photo', 'Zooming a map on a phone', 'A film'], answer: 1, why: 'The user changes the view.' },
      { q: 'At 60 frames/s, time per frame is about:', options: ['16.7 ms', '60 ms', '1 s'], answer: 0, why: '1000 / 60 = 16.7 ms.' },
      { q: 'A key advantage of interactive graphics:', options: ['Always cheaper than paper', 'Instant feedback on changes', 'Needs no computer'], answer: 1, why: 'Users see the effect of changes at once.' },
    ],
  },
  'representative-uses': {
    hinglish: [
      'Computer Graphics har jagah hai. Mobile ka keyboard, Google Maps, YouTube ka thumbnail, sab isi se bane hain.',
      'Game (real-time 3D duniya), CAD (machine ka design), Medical Imaging (CT/MRI se body ke slices), Movies/VFX, Simulation (pilot training), GUI, Maps, VR/AR.',
      'Har card par hover ya tap karo. Ek chhota animation dikhega.',
    ],
    english: [
      'Computer graphics is used in almost every field.',
      'Games draw 3D worlds many times a second.',
      'Engineers use CAD to design parts and buildings.',
      'Doctors view CT and MRI scans as pictures.',
      'Movies, simulators, maps and VR all depend on graphics.',
    ],
    formulas: () => ['\\text{Data size} = \\text{slices} \\times W \\times H \\times \\text{bytes per pixel}'],
    example: {
      inputs: [{ key: 's', label: 'Slices', default: 200 }, { key: 'w', label: 'Width', default: 512 }, { key: 'h', label: 'Height', default: 512 }, { key: 'b', label: 'Bytes/pixel', default: 2 }],
      problem: (v) => `A CT scan has ${v.s} slices of ${v.w} x ${v.h} pixels, ${v.b} bytes per pixel. How big is it?`,
      solve: (v) => { const t = v.s * v.w * v.h * v.b; return [`Pixels per slice = ${v.w} x ${v.h} = ${v.w * v.h}.`, `Total bytes = ${v.s} x ${v.w * v.h} x ${v.b} = ${t}.`, `= ${(t / 1048576).toFixed(2)} MB.`]; },
    },
    exam: ex(['CAD/CAM: design and manufacture of machines, buildings, circuits.', 'Presentation graphics: charts and slides for reports.', 'Entertainment: games, movies, animation and special effects.', 'Education and training: simulators for pilots and drivers.', 'Medical visualization, GIS and cartography, VR/AR, user interfaces.'], ['CAD', 'Simulation', 'Visualization', 'GIS', 'Virtual reality'], ['Listing uses without a one-line explanation for each.'], ['2 marks: Name four uses of computer graphics.', '5 marks: Explain computer graphics in CAD and medical imaging.', '10 marks: Discuss representative uses of computer graphics.']),
    quiz: [
      { q: 'CAD stands for:', options: ['Computer-Aided Design', 'Central Art Display', 'Colour And Depth'], answer: 0, why: 'CAD = Computer-Aided Design.' },
      { q: 'CT and MRI images are an example of:', options: ['Medical visualization', 'Word processing', 'Printing'], answer: 0, why: 'Scan data is turned into pictures.' },
      { q: 'Flight simulators mainly belong to:', options: ['Simulation and training', 'Spreadsheets', 'Networking'], answer: 0, why: 'They imitate real situations safely.' },
    ],
  },
  'classification-development': {
    hinglish: [
      'Applications ko alag-alag tareeke se baant sakte hain: interactive ya passive, 2D ya 3D, aur kis kaam ke liye.',
      'Hardware ka safar: pehle Vector Display (beam seedhi lines banata tha), phir Raster Display (frame buffer me har pixel), phir GPU (sirf graphics ke liye chip).',
      'Software ka safar: pehle har program apna code likhta tha. Phir standards aaye jaise GKS aur PHIGS, phir APIs jaise OpenGL, DirectX, Vulkan.',
    ],
    english: [
      'Applications can be grouped by interaction, by dimension and by purpose.',
      'Early displays were vector displays. They drew lines directly with a beam.',
      'Cheap memory made raster displays possible. Every pixel is stored.',
      'GPUs are chips built only for graphics work.',
      'Software moved from custom code to standards, and then to common APIs like OpenGL.',
    ],
    formulas: (v) => ['N_{max} = \\left\\lfloor \\dfrac{10^6 / f}{t_{line}} \\right\\rfloor', v.max ? `\\text{Now: } N_{max} = ${v.max}` : '\\text{Open the example to compute}'],
    example: {
      inputs: [{ key: 'hz', label: 'Refresh (Hz)', default: 30 }, { key: 'us', label: 'µs per line', default: 20 }],
      problem: (v) => `A vector display must redraw every line ${v.hz} times per second. Each line takes ${v.us} microseconds. How many lines can it show without flicker?`,
      solve: (v) => { const frame = 1e6 / Math.max(1, v.hz); return [`Time per refresh = 1,000,000 / ${v.hz} = ${frame.toFixed(1)} µs.`, `Lines = ${frame.toFixed(1)} / ${v.us} = ${Math.floor(frame / Math.max(1, v.us))}.`, 'A vector display slows and flickers as lines increase. A raster display refreshes the same number of pixels regardless of picture complexity.']; },
    },
    exam: ex(['Classification: interactive vs non-interactive, 2D vs 3D, by purpose.', 'Vector (random-scan) displays draw only the lines needed; limited by line count.', 'Raster displays use a frame buffer; cheap memory made them common.', 'GPUs offload geometry and pixel processing from the CPU.', 'Software evolved from device-specific code to standards (GKS, PHIGS) and APIs (OpenGL, DirectX).'], ['Vector display', 'Raster display', 'GPU', 'GKS', 'PHIGS', 'OpenGL'], ['Confusing the order: vector displays came before raster displays.'], ['2 marks: What is a GPU?', '5 marks: Trace the development of graphics hardware.', '10 marks: Classify applications of computer graphics and discuss software development.']),
    quiz: [
      { q: 'Which came first?', options: ['Raster display', 'Vector display', 'GPU'], answer: 1, why: 'Early displays were vector displays.' },
      { q: 'A frame buffer became practical because:', options: ['Memory became cheaper', 'Beams got faster', 'Paper got cheaper'], answer: 0, why: 'Storing every pixel needs memory.' },
      { q: 'OpenGL is a:', options: ['Graphics API', 'Printer', 'Monitor'], answer: 0, why: 'It is a standard programming interface.' },
    ],
  },
  'conceptual-framework': {
    hinglish: [
      'Interactive Graphics system ke 4 mukhya hisse hain: Application Model (objects ka data), Application Program (dimaag), Graphics System (pixels banane wala), aur Display.',
      'Picture banane ka raasta: Model se Program ko data milta hai, Program Graphics System ko drawing ki request bhejta hai, Graphics System pixels banakar Display par dikhata hai.',
      'User ka input (mouse, touch) pehle Graphics System me aata hai, wahan se Program ko jata hai. Program Model badalta hai aur nayi picture banti hai. Yehi feedback loop hai.',
    ],
    english: [
      'An interactive graphics system has four main parts.',
      'The application model stores data about the objects.',
      'The application program reads the model and asks for a picture.',
      'The graphics system turns requests into pixels on the display.',
      'User input goes through the graphics system to the program.',
      'The program changes the model, and a new picture appears. This is the feedback loop.',
    ],
    formulas: () => ['\\text{Pixels for one line} = \\max(|\\Delta x|, |\\Delta y|) + 1'],
    example: {
      inputs: [{ key: 'n', label: 'Lines in model', default: 3 }, { key: 'dx', label: 'dx', default: 10 }, { key: 'dy', label: 'dy', default: 8 }],
      problem: (v) => `The model has ${v.n} lines, each with dx = ${v.dx} and dy = ${v.dy}. How many pixels must the graphics system light (ignore overlap)?`,
      solve: (v) => [`Pixels per line = max(${v.dx}, ${v.dy}) + 1 = ${Math.max(v.dx, v.dy) + 1}.`, `Total = ${v.n} x ${Math.max(v.dx, v.dy) + 1} = ${v.n * (Math.max(v.dx, v.dy) + 1)}.`, 'The graphics system does this scan conversion; the program only sent endpoints.'],
    },
    exam: ex(['Four parts: application model, application program, graphics system, display (plus input devices).', 'The model holds geometry and attributes, independent of the display.', 'The program creates and edits the model and sends output primitives.', 'The graphics system converts primitives to pixels and handles input.', 'Loop: user action -> input -> program -> model -> picture.'], ['Application model', 'Application program', 'Graphics system', 'Primitives', 'Feedback loop'], ['Drawing the arrows from the model straight to the display, skipping the program and graphics system.'], ['2 marks: What is an application model?', '5 marks: Explain the conceptual framework with a diagram.', '10 marks: Explain how input and output flow in an interactive graphics system.']),
    quiz: [
      { q: 'Which part stores object data?', options: ['Application model', 'Display', 'Mouse'], answer: 0, why: 'The model holds the objects.' },
      { q: 'User input first reaches:', options: ['The graphics system', 'The model', 'The display'], answer: 0, why: 'The graphics system passes it to the program.' },
      { q: 'The graphics system mainly:', options: ['Turns primitives into pixels', 'Stores the user\'s name', 'Prints pages'], answer: 0, why: 'It performs scan conversion and related steps.' },
    ],
  },
  overview: {
    hinglish: [
      'Unit I ka saar: graphics kyon zaroori hai, kahan use hota hai, hardware-software kaise badle, aur system ka framework kya hai.',
      'Phir asli kaam: Scan Conversion. Line ke liye DDA aur Bresenham, circle ke liye Midpoint Circle (8-way symmetry), ellipse ke liye Midpoint Ellipse (2 regions, 4-way symmetry).',
      'Teeno me ek hi idea hai: ek decision parameter se agla pixel chuno, sirf integers use karo.',
    ],
    english: [
      'Unit I explains why graphics matters and where it is used.',
      'It also shows how hardware and software developed.',
      'Then it teaches scan conversion for lines, circles and ellipses.',
      'All midpoint methods use a decision parameter and integer math.',
    ],
    formulas: () => ['\\text{DDA: } steps = \\max(|\\Delta x|, |\\Delta y|)', 'p_0^{line} = 2\\Delta y - \\Delta x,\\quad p_0^{circle} = 1 - r'],
    example: {
      inputs: [{ key: 'dx', label: 'dx', default: 10 }, { key: 'dy', label: 'dy', default: 8 }],
      problem: (v) => `Compare the work of DDA and Bresenham for a line with dx = ${v.dx}, dy = ${v.dy}.`,
      solve: (v) => { const s = Math.max(Math.abs(v.dx), Math.abs(v.dy)); return [`Steps = max(${Math.abs(v.dx)}, ${Math.abs(v.dy)}) = ${s}, pixels = ${s + 1}.`, `DDA: ${2 * s} floating-point additions and ${s + 1} roundings.`, `Bresenham: about ${s} integer additions (plus one comparison each); no rounding.`]; },
    },
    exam: ex(['Interactive graphics: faster understanding, 3D viewing, instant feedback.', 'Applications: CAD, medical, entertainment, simulation, GUI, maps, VR.', 'Hardware: vector -> raster -> GPU. Software: custom code -> standards -> APIs.', 'Scan conversion: DDA, Bresenham (line); midpoint (circle, ellipse).', 'Symmetry: circle 8-way, ellipse 4-way.'], ['Scan conversion', 'Decision parameter', 'Symmetry', 'Framework'], ['Mixing up p0 formulas of line, circle and ellipse.'], ['5 marks: Summarise Unit I.', '10 marks: Compare the line, circle and ellipse algorithms.']),
    quiz: [
      { q: 'Circle symmetry is:', options: ['8-way', '4-way', 'None'], answer: 0, why: 'Octants mirror each other.' },
      { q: 'Midpoint algorithms use:', options: ['Decision parameters', 'Random numbers', 'Colours'], answer: 0, why: 'A decision parameter chooses the next pixel.' },
      { q: 'Initial p for a circle is:', options: ['1 - r', '2dy - dx', 'ry² - rx²ry'], answer: 0, why: 'p0 = 1 - r.' },
    ],
  },
};
