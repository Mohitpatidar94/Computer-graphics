# Computer Graphics and Multimedia Study Website

An interactive, unit-wise study guide built with React, Vite, Tailwind CSS, and Framer Motion. Lessons combine concise explanations, animated demonstrations, worked examples, quizzes, formula references, and revision tools.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local development URL (normally `http://localhost:5173`).

## Tests and production build

```bash
npm test
npm run build
npm run preview
```

`npm run build` writes the optimized site to `dist/`. `npm run preview` serves that output locally for a production-build check.

## Deploy to Vercel

1. Import the Git repository into Vercel.
2. Select **Vite** as the framework if it is not detected automatically.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Deploy. No environment variables are required for the static study site.

## Deploy to Netlify

1. Import the Git repository into Netlify.
2. Set the build command to `npm run build` and the publish directory to `dist`.
3. Deploy. The app uses hash-based navigation, so routes work on static hosting without server-side rewrite configuration.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow that tests, builds, and deploys to Pages whenever changes are pushed to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. After the workflow succeeds, the site is available at `https://mohitpatidar94.github.io/Computer-graphics/`.

## Project notes

- Topic content and quizzes live in `src/data/`; interactive lesson demonstrations live in `src/components/demos/`.
- Shared lesson and progress UI is in `src/components/` and `src/hooks/`.
- Formula Sheet, Quick Revision, Glossary, and quiz pages are registered in `src/App.jsx`.
- `HANDOFF.md` documents the project structure, data contracts, shared component APIs, and conventions for continuing development.
