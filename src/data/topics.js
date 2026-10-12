// Single source of truth for the syllabus tree. Page content lives in other data files.
const t = (id, title, ek, level, mins) => ({ id, title, ek, level, mins });

export const UNITS = [
  { id: '0', title: 'Unit 0: Start Here', tag: 'Zero-knowledge basics', topics: [
    t('what-is-cg', 'What is Computer Graphics?', 'Computer se tasveer banana aur use badalna.', 'Easy', 8),
    t('pixel-resolution', 'Pixel and Resolution', 'Screen chhote chhote dots ka grid hai.', 'Easy', 8),
    t('screen-coordinates', 'Screen Coordinate System', 'Screen par (0,0) upar-left se shuru hota hai.', 'Easy', 8),
    t('frame-buffer', 'Frame Buffer', 'Screen ki memory jo har pixel ka color yaad rakhti hai.', 'Easy', 8),
    t('basic-maths', 'Basic Maths in 5 Minutes', 'x-y, sin/cos aur matrix multiplication.', 'Easy', 12),
  ]},
  { id: '1', title: 'Unit I: Graphics Basics and Scan Conversion', tag: 'Lines, circles, ellipses', topics: [
    t('interactive-advantages', 'Advantages of Interactive Graphics', 'Dekhna hi nahi, chhoona aur badalna bhi.', 'Easy', 10),
    t('representative-uses', 'Representative Uses of Computer Graphics', 'Game se hospital tak graphics har jagah.', 'Easy', 10),
    t('classification-development', 'Classification of Applications and Development of Hardware and Software', 'Vector se raster se GPU tak ka safar.', 'Easy', 12),
    t('conceptual-framework', 'Conceptual Framework for Interactive Graphics', 'Model, program, graphics system aur display ka chakkar.', 'Medium', 12),
    t('overview', 'Overview', 'Poori Unit I ek nazar me.', 'Easy', 6),
    t('scan-lines', 'Scan Converting Lines (DDA and Bresenham)', 'Seedhi line ko pixels me badalna.', 'Medium', 25),
    t('scan-circles', 'Scan Converting Circles (Midpoint)', 'Circle ka 1/8 hissa nikalo, baaki symmetry se.', 'Medium', 25),
    t('scan-ellipses', 'Scan Converting Ellipses (Midpoint)', 'Do regions, do decision parameters.', 'Hard', 30),
  ]},
  { id: '2', title: 'Unit II: Devices and Clipping', tag: 'Hardware, display, clipping', topics: [
    t('hardcopy', 'Hardcopy Technologies', 'Printers aur plotters kaagaz par kaise likhte hain.', 'Easy', 12),
    t('display-tech', 'Display Technologies', 'CRT, LCD, LED aur Plasma ka fark.', 'Easy', 15),
    t('raster-scan', 'Raster-Scan Display System', 'Beam har line ko left se right bharti hai.', 'Medium', 15),
    t('video-controller', 'Video Controller', 'Frame buffer se pixel uthakar screen tak bhejta hai.', 'Medium', 12),
    t('random-scan', 'Random-Scan Display Processor', 'Beam sirf wahi lines banata hai jo chahiye.', 'Medium', 12),
    t('input-devices', 'Input Devices for Operator Interaction', 'Mouse, joystick, touch aur aur bhi.', 'Easy', 12),
    t('image-scanners', 'Image Scanners', 'Kaagaz ki photo ko pixels me badalna.', 'Easy', 10),
    t('cohen-sutherland', 'Cohen-Sutherland Line Clipping (syllabus: "Southland-Cohen")', '4-bit region code se turant accept ya reject.', 'Medium', 25),
    t('cyrus-beck', 'Cyrus-Beck Line Clipping', 'Parametric t aur dot product se clipping.', 'Hard', 25),
    t('midpoint-subdivision', 'Midpoint Subdivision Clipping', 'Line ko baar baar aadha karke clip karo.', 'Medium', 20),
  ]},
  { id: '3', title: 'Unit III: Transformations', tag: 'Matrices and viewing', topics: [
    t('transform-2d', '2D Transformations', 'Translate, scale, rotate, shear aur reflect.', 'Medium', 25),
    t('homogeneous', 'Homogeneous Coordinates and Matrix Representation', '(x, y) ko (x, y, 1) bana do, sab matrix ban jata hai.', 'Medium', 20),
    t('composition', 'Composition of 2D Transformations', 'Order badla to jawab badla.', 'Hard', 25),
    t('window-viewport', 'The Window-to-Viewport Transformation', 'World ka hissa screen ke dabbe me.', 'Medium', 20),
    t('efficiency', 'Efficiency', 'Kam multiplications, tez graphics.', 'Medium', 12),
    t('transform-3d', 'Matrix Representation of 3D Transformations', '4x4 matrix se 3D object ghumao.', 'Hard', 25),
    t('coordinate-change', 'Transformations as a Change in Coordinate System', 'Object hilao ya axes, jawab ulta-seedha.', 'Hard', 20),
  ]},
];

export const EXTRA_PAGES = [
  { path: '/formulas', title: 'Formula Sheet' },
  { path: '/glossary', title: 'Glossary' },
  { path: '/revision', title: 'Quick Revision' },
  { path: '/quizzes', title: 'Unit-wise Quizzes' },
  { path: '/test', title: 'Final Test' },
];

export const ALL_TOPICS = UNITS.flatMap((u) => u.topics.map((tp) => ({ ...tp, unit: u.id, unitTitle: u.title })));
export const topicIndex = (id) => ALL_TOPICS.findIndex((x) => x.id === id);
export const getTopic = (id) => ALL_TOPICS[topicIndex(id)];
export const neighbors = (id) => {
  const i = topicIndex(id);
  return { prev: ALL_TOPICS[i - 1] || null, next: ALL_TOPICS[i + 1] || null };
};
