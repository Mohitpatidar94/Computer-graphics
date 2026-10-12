# Computer Graphics Study Guide — Handoff

This document is for a new contributor continuing Phases 4 and 5 without chat
history. It records what is actually present in this workspace, then clearly
labels missing files and proposed contracts. Do not assume a described
placeholder API has already been implemented.

## 1. Current workspace and folder tree

The Vite app is organized under `src/`. `node_modules/` is a generated local
dependency directory and is intentionally omitted from this source tree.

```text
.
├── HANDOFF.md                         This continuation guide
├── index.html                         HTML shell; loads /src/main.jsx
├── package.json                       Project metadata, scripts and dependencies
├── postcss.config.js                  Tailwind and Autoprefixer PostCSS setup
├── tailwind.config.js                 Fonts, unit colors and glow utility
├── vite.config.js                     Vite React plugin and Vitest config
└── src/
    ├── App.jsx                        Hash routes and shared provider/layout
    ├── index.css                      Theme tokens, graph-paper background, glass
    ├── main.jsx                       React DOM entry point
    ├── components/
    │   ├── AlgoPanel.jsx              Algorithm pseudocode and variable panel
    │   ├── AlgoStepper.jsx            Playback controls for algorithm steps
    │   ├── CommandPalette.jsx         Keyboard-searchable topic/page navigation
    │   ├── HeroCanvas.jsx             Animated hero visual on the home page
    │   ├── Layout.jsx                 Header, language/theme switches, sidebar
    │   ├── PixelGrid.jsx              Interactive canvas pixel grid
    │   ├── ProgressBar.jsx            Animated accessible progress indicator
    │   ├── TopicLayout.jsx            Shared topic lesson, lab, formula, quiz UI
    │   └── demos/
    │       ├── Hooks.jsx              Small animated visual hooks by kind
    │       ├── IntroDemos.jsx         Unit I introduction demonstrations
    │       ├── LinesDemo.jsx          Interactive DDA/Bresenham lab
    │       ├── registry.jsx           Topic ID -> content / hook / demo mapping
    │       ├── ShapesDemo.jsx         Midpoint circle and ellipse labs
    │       └── Unit0Demos.jsx         Unit 0 paint, resolution, coordinate labs
    ├── data/
    │   ├── topics.js                  Syllabus, sidebar metadata and topic helpers
    │   ├── unit0.js                   Unit 0 lesson content
    │   ├── unit1-intro.js             Unit I introduction / overview content
    │   ├── unit1-scan.js              Unit I line scan-conversion lesson content
    │   ├── unit1-shapes.js            Unit I circle and ellipse lesson content
    │   └── unit2.js                   Unit II lesson content and device datasets
    ├── hooks/
    │   ├── AppContext.jsx             Language, theme and completed-topic state
    │   ├── useCanvas.js               HiDPI, resize-aware canvas drawing lifecycle
    │   └── useStepper.js              Playback state for a precomputed step array
    ├── lib/
    │   └── algorithms/
    │       ├── circle.js              Midpoint circle generator and symmetry
    │       ├── circle.test.js         Circle / ellipse algorithm tests
    │       ├── clipping.js            Cohen-Sutherland, Cyrus-Beck, subdivision
    │       ├── clipping.test.js       Clipping and raster step tests
    │       ├── ellipse.js             Midpoint ellipse generator and symmetry
    │       ├── line.js                DDA / Bresenham generators and helpers
    │       ├── line.test.js           Line-generator tests
    │       └── raster.js              Raster/video-display step helpers
    └── pages/
        ├── Home.jsx                   Home page and unit cards
        └── TopicPage.jsx              Topic lookup, lesson dispatch, placeholder
```

### Referenced but currently missing

These imports / features are referenced by current code, but the corresponding
files are not present in this workspace:

- `src/components/LangTabs.jsx` — imported by `TopicLayout`.
- `src/components/QuizCard.jsx` — imported by `TopicLayout`.
- `src/components/Tex.jsx` — imported as `Tex` by `TopicLayout` and as the
  default `MatrixView` by `Unit0Demos`.
- `src/components/PseudoCode.jsx` and `src/components/VariableTable.jsx` —
  imported by `AlgoPanel`.
- `src/lib/imageSample.js` — imported by the hooks and Unit 0 demos.
- `src/data/unit3.js`, glossary/formula datasets, and Formula Sheet / Glossary
  page components are not present.

Some corresponding imports use different relative paths in the current files;
resolve imports against the actual source file location and keep the shared
component imports consistent when restoring these files. Do not silently add
empty components just to make the build green.

## 2. Dependencies and commands

Versions below are the ranges declared in `package.json` (the `^` is part of
each declared version range).

| Kind | Package | Declared version |
|---|---|---:|
| dependency | `@react-three/drei` | `^9.109.0` |
| dependency | `@react-three/fiber` | `^8.16.8` |
| dependency | `framer-motion` | `^11.3.0` |
| dependency | `katex` | `^0.16.11` |
| dependency | `lucide-react` | `^0.400.0` |
| dependency | `react` | `^18.3.1` |
| dependency | `react-dom` | `^18.3.1` |
| dependency | `react-katex` | `^3.0.1` |
| dependency | `react-router-dom` | `^6.24.0` |
| dependency | `three` | `^0.166.0` |
| devDependency | `@vitejs/plugin-react` | `^4.3.1` |
| devDependency | `autoprefixer` | `^10.4.19` |
| devDependency | `postcss` | `^8.4.39` |
| devDependency | `tailwindcss` | `^3.4.6` |
| devDependency | `vite` | `^5.3.3` |
| devDependency | `vitest` | `^2.0.2` |

```sh
npm install
npm run dev       # Vite dev server
npm test          # vitest run
npm run build     # production build
npm run preview   # serve the production build locally
```

**Current verification status:** the algorithm suite passed (3 test files,
19 tests) after dependencies were installed. A production build currently
fails because referenced source files listed above are missing. Re-run tests
and the build after implementing the missing pieces. Do not use `npm audit fix`
or upgrade dependencies as an incidental part of Phases 4/5.

## 3. Design system

### Fonts

`index.html` loads Google Fonts: **Inter** (body/UI), **Poppins** (display
headings), and **JetBrains Mono** (code / coordinates). Tailwind aliases:

- `font-sans` → Inter, system UI, sans-serif.
- `font-display` → Poppins, system UI, sans-serif.
- `font-mono` → JetBrains Mono, UI monospace, monospace.

### CSS custom properties

`src/index.css` defines the base tokens on `:root` / `[data-theme='dark']`;
`[data-theme='light']` overrides the neutral theme. `[data-unit]` overrides
only `--accent`.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0B1020` | `#F6F8FF` |
| `--bg-2` | `#111833` | `#E9EEFB` |
| `--surface` | `rgba(26, 35, 71, 0.55)` | `rgba(255, 255, 255, 0.75)` |
| `--border` | `rgba(160, 180, 255, 0.16)` | `rgba(40, 60, 140, 0.16)` |
| `--text` | `#E9EEFB` | `#121A3A` |
| `--muted` | `#9AA7D1` | `#4A5683` |
| `--grid` | `rgba(120, 150, 255, 0.07)` | `rgba(40, 60, 140, 0.07)` |
| default `--accent` | `#4FD1FF` | `#0A7CC2` |

| `data-unit` value | Unit | Accent |
|---|---|---|
| `"0"` | Unit 0 | `#FFB454` (amber) |
| `"1"` | Unit I | `#4FD1FF` (cyan) |
| `"2"` | Unit II | `#FF5CAA` (pink) |
| `"3"` | Unit III | `#B6F25C` (lime) |

Tailwind also exposes `ink-950/900/800/700`, `paper-50/100`, `u0`–`u3`, and
`shadow-glow` (`0 0 24px -4px var(--accent)`). The body uses a 24px CSS
graph-paper grid. The shared **`.glass`** class applies the theme surface,
border, 14px backdrop blur, and 18px radius. Use CSS variables rather than
hard-coded neutral colors so dark/light mode and unit accents continue to work.

### Motion

There are no named/shared Framer Motion preset constants in the current code.
These inline patterns are the existing style; reuse them unless deliberately
introducing and applying a shared preset:

- Route content: initial `{ opacity: 0, y: 8 }`, animate `{ opacity: 1, y: 0 }`,
  exit `{ opacity: 0 }`, duration `0.18`; `AnimatePresence mode="wait"`.
- Mobile sidebar scrim: opacity `0 → 1`; drawer `x: -288 → 0`, tween duration
  `0.2`, then exits back to `-288`.
- Content sections: fade in with `whileInView={{ opacity: 1 }}`, once, with
  viewport margin `-40px`.
- Home unit cards: opacity `0`, y `14` to opacity `1`, y `0`, once; delay
  `index * 0.05`.
- Progress fill: animate width to percentage with spring stiffness `120`,
  damping `20`.
- Reduced motion is handled in CSS; `useCanvas` also respects
  `prefers-reduced-motion`.

## 4. Shared component APIs

“Current” means directly confirmed by a source definition or call site.
“Inferred / proposed” means the implementation file is missing and a new
contributor must create and validate it. Keep these contracts aligned with
the existing callers.

### `TopicLayout` — implemented

```ts
TopicLayoutProps = {
  topic: { id: string; unit: string; unitTitle: string; title: string;
           ek: string; level: string; mins: number };
  content: TopicContent;
  Hook: React.ComponentType;
  Demo: React.ComponentType<{ setVars: (vars: Record<string, number>) => void }>;
}
```

`TopicContent` is defined in section 5. The demo's `setVars` feeds
`content.formulas(vars)`. The shared layout also reads `useApp()` and calls
`markDone(topic.id)`.

```jsx
<TopicLayout
  topic={getTopic('scan-lines')}
  content={UNIT1_SCAN['scan-lines']}
  Hook={LineHook}
  Demo={LinesDemo}
/>
```

### `LangTabs` — missing; call-site contract

The only verified props are `hinglish` and `english`, each an array of lesson
paragraph strings. The component should read `lang` from `useApp()` to match
the global language switch; that internal implementation is not currently
available to verify.

```jsx
<LangTabs hinglish={content.hinglish} english={content.english} />
```

### `PixelGrid` — implemented

```ts
PixelGridProps = {
  cols: number;
  rows: number;
  lit?: Array<{ x: number; y: number; c?: string }>;
  ideal?: Array<[x1: number, y1: number, x2: number, y2: number]>;
  mark?: { x: number; y: number };
  flipY?: boolean;
  onCell?: (x: number, y: number) => void;
  label?: string; // defaults to "Pixel grid"
}
```

`lit` cells default to the unit accent; `ideal` draws dashed lines through
pixel centres; `flipY` switches to maths-style y-up coordinates. `onCell` is
called only for a pointer inside the grid.

```jsx
<PixelGrid
  cols={12}
  rows={9}
  lit={[{ x: 3, y: 2, c: '#FFB454' }]}
  mark={{ x: 3, y: 2 }}
  onCell={(x, y) => setSelected({ x, y })}
  label="Interactive coordinate grid"
/>
```

### `AlgoStepper` — implemented

It takes one `s` object, normally the return value of `useStepper(steps)`:

```ts
s = {
  idx: number; playing: boolean; speed: number; setSpeed: (ms: number) => void;
  last: number; step: Step | undefined;
  play: () => void; pause: () => void; next: () => void;
  back: () => void; reset: () => void;
}
```

```jsx
const s = useStepper([...bresenhamSteps(2, 2, 19, 9)]);
<AlgoStepper s={s} />
```

### `PseudoCode` — missing; call-site contract

`lines` is a string array; `active` is the zero-based highlighted line, or
`-1` when there is no current step.

```jsx
<PseudoCode lines={BRESENHAM_CODE} active={step?.line ?? -1} />
```

### `VariableTable` — missing; call-site contract

`vars` is an optional plain object from the current algorithm step. Render
empty state safely when it is missing.

```jsx
<VariableTable vars={step?.vars} />
```

### `MatrixView` — missing; call-site contract

`src/components/demos/Unit0Demos.jsx` imports the **default** export from
`../Tex.jsx` under the name `MatrixView`. Verified props: `rows` (2D values)
and `label` (accessible label).

```jsx
<MatrixView rows={[[cos, -sin], [sin, cos]]} label="Rotation matrix" />
```

The same missing module is imported by `TopicLayout` as a **named** `Tex`
component and used as `<Tex block>{latexString}</Tex>`. Preserve both export
shapes when implementing that module.

### `QuizCard` — missing; call-site contract

It receives `questions` (the quiz array defined in section 9) and
`onComplete` (callback). `TopicLayout` calls `markDone(topic.id)` through this
callback. Do not change the answer field from a zero-based option index unless
you update every quiz entry and consumer together.

```jsx
<QuizCard questions={content.quiz} onComplete={() => markDone(topic.id)} />
```

### `ProgressBar` — implemented

```ts
ProgressBarProps = { value: number; max: number; label: string }
```

```jsx
<ProgressBar value={done.length} max={ALL_TOPICS.length} label="Overall progress" />
```

### Glossary tooltip — not implemented; proposed Phase 5 contract

There is currently no glossary tooltip, term dataset, or glossary component.
Suggested minimal API: `term` plus an optional `definition`; when only `term`
is supplied, look it up in the canonical glossary data. Prefer an accessible
button / tooltip pattern that also works on keyboard focus and touch.

```jsx
<GlossaryTooltip term="Aliasing" />
```

This is a recommendation, **not** an existing component/API. Avoid hard-coding
separate tooltip definitions in every lesson.

## 5. Topic and lesson data schema

Metadata and lesson content are separate and joined by the exact same stable
topic ID:

```js
// src/data/topics.js — syllabus/sidebar metadata
{
  id: string,       // URL segment; unique and stable
  title: string,
  ek: string,       // one-line Hinglish summary ("Ek line me")
  level: 'Easy' | 'Medium' | 'Hard',
  mins: number,
}
// Parent unit: { id: '0' | '1' | '2' | '3', title, tag, topics: [...] }

// src/data/unitN-*.js — lesson data; keyed by the same topic id
{
  [topicId]: {
    hinglish: string[],
    english: string[],
    formulas: (vars: Record<string, number>) => string[], // KaTeX/LaTeX
    example: {
      inputs: Array<{ key: string; label: string; default: number }>,
      problem: (values: Record<string, number>) => string,
      solve: (values: Record<string, number>) => string[],
    },
    exam: {
      points: string[],
      terms: string[],
      mistakes: string[],
      questions: string[],
    },
    quiz: Array<{
      q: string,
      options: string[],
      answer: number, // zero-based index into options
      why: string,
    }>,
  }
}
```

One complete example, using the actual `what-is-cg` topic:

```js
// In src/data/topics.js, within unit 0:
{ id: 'what-is-cg', title: 'What is Computer Graphics?',
  ek: 'Computer se tasveer banana aur use badalna.', level: 'Easy', mins: 8 }

// In src/data/unit0.js:
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
      inputs: [
        { key: 'w', label: 'Width', default: 100 },
        { key: 'h', label: 'Height', default: 50 },
      ],
      problem: (v) =>
        `An image is ${v.w} pixels wide and ${v.h} pixels high. How many colour values (R, G, B) are stored?`,
      solve: (v) => [
        `Pixels = width x height = ${v.w} x ${v.h} = ${v.w * v.h}.`,
        'Each pixel stores 3 values: red, green, blue.',
        `Total values = ${v.w * v.h} x 3 = ${v.w * v.h * 3}.`,
      ],
    },
    exam: {
      points: [
        'Computer Graphics is the creation, storage and manipulation of images using a computer.',
        'Two kinds: passive (no user control) and interactive (user changes the picture).',
        'A picture is built from pixels.',
        'Main parts: input, processing, output (display).',
      ],
      terms: ['Computer Graphics', 'Pixel', 'Interactive graphics', 'Rendering'],
      mistakes: [
        'Mixing up Computer Graphics (making images) with Image Processing (improving existing images).',
      ],
      questions: [
        '2 marks: Define computer graphics.',
        '5 marks: Explain interactive and passive graphics.',
        '10 marks: Discuss applications of computer graphics.',
      ],
    },
    quiz: [
      {
        q: 'Computer graphics mainly deals with:',
        options: ['Making and changing pictures by computer', 'Only typing text', 'Repairing hardware'],
        answer: 0,
        why: 'It is about creating and manipulating images.',
      },
      {
        q: 'A picture on screen is made of:',
        options: ['Pixels', 'Wires', 'Sounds'],
        answer: 0,
        why: 'Pixels are the small dots that form the picture.',
      },
      {
        q: 'A 10 x 10 image has how many pixels?',
        options: ['20', '100', '1000'],
        answer: 1,
        why: '10 x 10 = 100.',
      },
    ],
  },
};
```

The functions in lesson data are JavaScript, not JSON-serializable JSON. Keep
data modules as ES modules. The `formulas(vars)` callback is evaluated by
`TopicLayout` on each render; demo components can call the supplied `setVars`
to update formula values. Examples are also executable functions, not static
strings.

## 6. Routes, sidebar, and adding Unit III topics

### Current route flow

- `src/main.jsx` mounts `App`.
- `src/App.jsx` wraps routes in `AppProvider` and `HashRouter`, then renders
  `Layout`. Present routes are `/`, `/topic/:id`, and a wildcard redirect to
  `/`.
- `src/data/topics.js` exports `UNITS`; `Layout.jsx`'s `Sidebar` maps `UNITS`
  and each unit's `topics`. `ALL_TOPICS` is derived from `UNITS` and is also
  used for completion totals, search, home cards, and next/previous topic
  navigation.
- `src/pages/TopicPage.jsx` looks up a URL ID via `getTopic(id)`. If
  `REGISTRY[id]` exists it renders the full `TopicLayout`; otherwise it renders
  a placeholder lesson and previous/next links.
- `src/components/demos/registry.jsx` is the full-lesson registry:
  `topic id -> { content, Hook, Demo }`.

### Unit III is already present in the syllabus

**Do not add a duplicate Unit III or duplicate its seven sidebar entries.**
Unit id `"3"` and these topic IDs already exist in `src/data/topics.js`:

1. `transform-2d`
2. `homogeneous`
3. `composition`
4. `window-viewport`
5. `efficiency`
6. `transform-3d`
7. `coordinate-change`

They currently render the Phase 4 placeholder because their IDs are not in
`REGISTRY`. To implement the Unit III lessons:

1. Add `src/data/unit3.js` exporting a `UNIT3` object keyed by all seven IDs,
   using the schema in section 5.
2. Add reusable transformation demos / hooks under
   `src/components/demos/` as appropriate.
3. Import `UNIT3` and demos in `src/components/demos/registry.jsx`, then add
   one registry entry for each topic ID. Keep key spelling identical to
   `topics.js`.
4. Keep `data-unit="3"` on the article; it selects the lime accent token.
5. `TopicPage.jsx` currently maps unit `"3"` to placeholder “Phase 4”. Update
   or remove that placeholder wording when the full lesson exists so it does
   not lie to users.
6. Check IDs, registry completeness, sidebar, command palette, neighboring
   links, formulas, quizzes, tests, and production build.

The sidebar requires no separate Unit III registration: it derives from
`UNITS`. The `EXTRA_PAGES` links (`/formulas`, `/glossary`, `/revision`,
`/test`) are shown in the sidebar and command palette but are **not** routes
in `App.jsx`; with the current wildcard route, clicking them redirects to `/`.
Add explicit page components/routes before considering those tools complete.

## 7. Algorithm step-generator convention

Algorithms are pure JavaScript generator functions in `src/lib/algorithms/`.
They yield one playback event per meaningful operation. The demo materializes
the generator into an array (`[...generator]`) and passes it to `useStepper`.
`line` is a zero-based index into the corresponding `*_CODE` array. `vars`
feeds `VariableTable`; `note` explains the step; `plot: true` marks a pixel
event. Coordinates (`x`, `y`, or shape-specific `pts`) are supplied on plot
events. Add extra fields only when the algorithm / visualizer needs them.
Export a plain helper such as `collectPixels` when useful for tests or compares.

```js
// Existing convention: src/lib/algorithms/circle.js
export function* circleSteps(cx, cy, r) {
  let x = 0;
  let y = r;
  let p = 1 - r;
  yield {
    line: 0,
    plot: false,
    vars: { x, y, p },
    note: 'Start at the top of the circle. p0 = 1 - r.',
  };
  while (x <= y) {
    yield {
      line: 2,
      plot: true,
      x,
      y,
      cx,
      cy,
      pts: symmetry8(cx, cy, x, y),
      vars: { x, y, p },
      note: `Plot (${x}, ${y}) and its 7 mirror images.`,
    };
    // Update decision variables, then yield the next explainable step.
    // ...
  }
}

const steps = [...circleSteps(cx, cy, radius)];
const playback = useStepper(steps);
```

Match every `line` index to its pseudocode array. Keep algorithm generators
deterministic and independent of React so they remain easy to unit test.

## 8. Progress, language, theme, and localStorage

`src/hooks/AppContext.jsx` exports `AppProvider` and `useApp()`. The current
context value is `{ lang, setLang, theme, setTheme, done, markDone }`.

- `lang` defaults to `"both"` and supports `"hinglish"`, `"english"`, `"both"`.
  `Layout.jsx` renders the language buttons and changes the shared state.
- `theme` defaults to `"dark"`. Its effect persists the setting and writes
  `data-theme` to `<html>`, which selects tokens in `src/index.css`.
- `done` is an array of topic IDs. `markDone(id)` adds an ID once; both
  `TopicLayout` and the sidebar/home progress use this shared list.
- Storage keys are `cg-lang`, `cg-theme`, and `cg-done`.
- `read(key, fallback)` wraps `localStorage.getItem` and JSON parsing in
  `try/catch`; missing/corrupt/unavailable storage returns the supplied
  fallback. `write(key, value)` wraps serialization and `setItem` in
  `try/catch`; if storage is unavailable, in-memory state still works. Keep
  both guards; do not replace them with unguarded localStorage access.
- `useStepper(steps)` is local lab playback state, not persisted. It resets to
  index zero when its `steps` array changes.
- Quiz completion's exact scoring/retry behavior cannot be verified because
  `QuizCard.jsx` is missing. Keep durable topic completion routed through
  `markDone(topic.id)`.

## 9. Quiz, glossary, and formula sheet data

### Existing quiz data

Quizzes live on each lesson object as `quiz: [...]`. Each entry is:

```js
{
  q: 'Question text',
  options: ['Choice A', 'Choice B', 'Choice C'],
  answer: 0, // zero-based correct option index
  why: 'Short explanation shown as feedback',
}
```

`TopicLayout` passes the full array to `<QuizCard questions={content.quiz}
onComplete={...} />`. `QuizCard` itself is missing, so confirm how it tracks
all-correct / completion before relying on its UX; the parent also supplies an
independent “Mark as done” button.

### Glossary data and tooltip

There is no glossary dataset or tooltip in the current tree. For Phase 5, use
one canonical module, suggested path `src/data/glossary.js`, with a stable
export such as:

```js
export const GLOSSARY = [
  {
    term: 'Aliasing',
    definition: 'Visible stair-step edges caused by representing a shape on a pixel grid.',
    unit: '1',
    topicId: 'scan-lines',
  },
];
```

This schema is a recommendation, not an existing format. Have both the future
Glossary page and inline tooltip read this export instead of maintaining
separate term definitions. Sort/search by `term`; use `topicId` for an
optional related-topic link and `unit` for grouping/filtering. Decide and test
case-insensitive lookup / duplicate-term rules when implementing it.

### Formula Sheet data and rendering

The existing formulas are attached to lessons as
`content.formulas(vars) -> string[]` of LaTeX and rendered in `TopicLayout`
through the missing named export `Tex` (`<Tex block>{latex}</Tex>`). There is
no static formula-sheet data or Formula Sheet route yet. For a stable Phase 5
page, prefer an explicit flat dataset (suggested `src/data/formulas.js`) with
records like:

```js
export const FORMULAS = [
  {
    id: 'pixel-count',
    title: 'Total pixels',
    latex: '\\text{Total pixels} = W \\times H',
    unit: '0',
    topicId: 'pixel-resolution',
  },
];
```

Treat this as a proposed page-oriented schema, not an already-shipped
contract. Keep reusable static LaTeX in data so a page can import and render
it directly with `Tex`. Do not call lesson formulas with guessed variable
values, parse JSX, or regex-extract formulas to populate the sheet. If a
formula needs dynamic lab values, keep that behavior in the lesson's
`formulas(vars)` and separately provide its static expression in the
page-oriented dataset.

## 10. Known issues and coding rules

### Known current issues (verified in this workspace)

1. Production build fails because shared component imports are unresolved.
   Missing paths include `LangTabs.jsx`, `QuizCard.jsx`, `Tex.jsx`,
   `PseudoCode.jsx`, and `VariableTable.jsx`.
2. Both `Hooks.jsx` and `Unit0Demos.jsx` import absent `src/lib/imageSample.js`.
3. The `UNIT2` content exists in `src/data/unit2.js`, but the demo registry has
   no Unit II lesson entries. Unit II syllabus topics currently display
   placeholders where no registry entry exists.
4. Unit III syllabus metadata exists, but there is no Unit III lesson data,
   demo registry entry, or transformation lesson implementation yet.
5. `/formulas`, `/glossary`, `/revision`, and `/test` are advertised in the
   sidebar/search, but `App.jsx` defines no corresponding routes; wildcard
   currently redirects them to `/`.
6. `src/components/demos/Unit0Demos.jsx` imports the missing `Tex.jsx` default
   export as `MatrixView`; `TopicLayout.jsx` also expects a named `Tex` export
   from that same module.
7. No ESLint script/config, TypeScript config, or package lockfile is present
   in the project root. Don't claim those checks ran unless they are added
   intentionally.
8. `npm install` reported vulnerabilities during handoff preparation. Do not
   auto-upgrade/fix packages as unrelated scope; handle dependency security
   in its own reviewed task.

Before declaring the build fixed, scan local imports for missing targets,
restore/implement the intended shared modules, verify their import paths, then
run `npm test` and `npm run build`.

### Coding rules

- Keep the app React 18 + Vite + JavaScript ES modules; match existing
  two-space JSX formatting and named/default export conventions.
- Keep syllabus metadata in `src/data/topics.js`, lesson content in separate
  `src/data/` modules, reusable UI in `src/components/`, route screens in
  `src/pages/`, and pure algorithm logic in `src/lib/algorithms/`.
- A topic ID is a stable key shared by metadata, URL, content and registry.
  When adding a topic, check every surface in section 6; do not invent a
  second source of truth for the sidebar.
- Keep lesson data pure except for its documented formula/example callbacks.
  Keep visual interaction in demos and math/step generation in pure helpers.
- Use existing theme variables (`--accent`, `--text`, `--muted`, `--border`,
  `--surface`) and the `.glass` class. Respect `data-unit` and light/dark mode.
- Preserve localStorage try/catch guards and reduced-motion behavior.
- Make controls accessible: labels, button names, keyboard support, and
  canvas `role="img"` / `aria-label` where appropriate.
- Add/update Vitest tests for algorithm or data behavior. After restoring
  missing modules, run the smallest relevant tests and then production build.
- Make focused changes; do not hide unresolved imports behind broad catches,
  empty fallback components, or success-shaped placeholders.
