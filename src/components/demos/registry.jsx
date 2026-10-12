import Hook from './Hooks.jsx';
import { WhatIsDemo, ResolutionDemo, CoordDemo, FrameBufferDemo, MathDemo } from './Unit0Demos.jsx';
import { UNIT0 } from '../../data/unit0.js';
import { UNIT1_SCAN } from '../../data/unit1-scan.js';
import LinesDemo from './LinesDemo.jsx';
import { UNIT1_INTRO } from '../../data/unit1-intro.js';
import { InteractiveDemo, UsesDemo, TimelineDemo, FrameworkDemo, OverviewDemo } from './IntroDemos.jsx';
import { UNIT1_SHAPES } from '../../data/unit1-shapes.js';
import { CircleDemo, EllipseDemo } from './ShapesDemo.jsx';
import Unit3Hook from './Unit3Hooks.jsx';
import { CompositionDemo, HomogeneousDemo, Transform2DDemo } from './Unit3CoreDemos.jsx';
import { CoordinateChangeDemo, EfficiencyDemo, Transform3DDemo, WindowViewportDemo } from './Unit3AdvancedDemos.jsx';
import { UNIT3 } from '../../data/unit3.js';

const h = (kind) => () => <Hook kind={kind} />;

/** topic id -> { content, Hook, Demo }. Later phases add their units here. */
export const REGISTRY = {
  'what-is-cg': { content: UNIT0['what-is-cg'], Hook: h('pixelate'), Demo: WhatIsDemo },
  'pixel-resolution': { content: UNIT0['pixel-resolution'], Hook: h('pixelate'), Demo: ResolutionDemo },
  'screen-coordinates': { content: UNIT0['screen-coordinates'], Hook: h('coords'), Demo: CoordDemo },
  'frame-buffer': { content: UNIT0['frame-buffer'], Hook: h('buffer'), Demo: FrameBufferDemo },
  'basic-maths': { content: UNIT0['basic-maths'], Hook: h('maths'), Demo: MathDemo },
  'scan-lines': { content: UNIT1_SCAN['scan-lines'], Hook: h('line'), Demo: LinesDemo },
  'scan-circles': { content: UNIT1_SHAPES['scan-circles'], Hook: h('circle'), Demo: CircleDemo },
  'scan-ellipses': { content: UNIT1_SHAPES['scan-ellipses'], Hook: h('ellipse'), Demo: EllipseDemo },
  'interactive-advantages': { content: UNIT1_INTRO['interactive-advantages'], Hook: h('cube'), Demo: InteractiveDemo },
  'representative-uses': { content: UNIT1_INTRO['representative-uses'], Hook: h('uses'), Demo: UsesDemo },
  'classification-development': { content: UNIT1_INTRO['classification-development'], Hook: h('timeline'), Demo: TimelineDemo },
  'conceptual-framework': { content: UNIT1_INTRO['conceptual-framework'], Hook: h('flow'), Demo: FrameworkDemo },
  overview: { content: UNIT1_INTRO.overview, Hook: h('line'), Demo: OverviewDemo },
  'transform-2d': { content: UNIT3['transform-2d'], Hook: () => <Unit3Hook topicId="transform-2d" />, Demo: Transform2DDemo },
  homogeneous: { content: UNIT3.homogeneous, Hook: () => <Unit3Hook topicId="homogeneous" />, Demo: HomogeneousDemo },
  composition: { content: UNIT3.composition, Hook: () => <Unit3Hook topicId="composition" />, Demo: CompositionDemo },
  'window-viewport': { content: UNIT3['window-viewport'], Hook: () => <Unit3Hook topicId="window-viewport" />, Demo: WindowViewportDemo },
  efficiency: { content: UNIT3.efficiency, Hook: () => <Unit3Hook topicId="efficiency" />, Demo: EfficiencyDemo },
  'transform-3d': { content: UNIT3['transform-3d'], Hook: () => <Unit3Hook topicId="transform-3d" />, Demo: Transform3DDemo },
  'coordinate-change': { content: UNIT3['coordinate-change'], Hook: () => <Unit3Hook topicId="coordinate-change" />, Demo: CoordinateChangeDemo },
};
