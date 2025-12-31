import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        midnight: '#0D1117',
        accent: '#00E7FF',
        neon: '#8A2BE2'
      },
      boxShadow: {
        glow: '0 0 40px rgba(138, 43, 226, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
