/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff00',
          orange: '#ffa500',
        },
        dark: {
          primary: '#0d0d0d',
          secondary: '#1a1a2e',
          tertiary: '#333333',
        },
      },
      boxShadow: {
        neon: '0 0 10px rgba(0, 255, 0, 0.8)',
        'neon-strong': '0 0 20px rgba(0, 255, 0, 1)',
        'neon-text': '0 0 10px rgba(0, 255, 0, 0.5)',
        'neon-text-subtle': '0 0 8px rgba(0, 255, 0, 0.4)',
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
