/** Graph-paper design system: ink-blue base, one accent per unit. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: { 950: '#0B1020', 900: '#111833', 800: '#1A2347', 700: '#26325F' },
        paper: { 50: '#F6F8FF', 100: '#E9EEFB' },
        u0: '#FFB454',
        u1: '#4FD1FF',
        u2: '#FF5CAA',
        u3: '#B6F25C',
      },
      boxShadow: {
        glow: '0 0 24px -4px var(--accent)',
      },
    },
  },
  plugins: [],
};
