/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tactical: {
          bg: '#080B11',
          panel: '#0E1422',
          surface: '#141D30',
          border: '#1E2C4A',
          borderGlow: 'rgba(0, 240, 255, 0.25)',
          cyan: '#00F0FF',
          cyanDim: '#00B4D8',
          violet: '#8B5CF6',
          violetDark: '#6D28D9',
          amber: '#F59E0B',
          red: '#EF4444',
          emerald: '#10B981',
          lime: '#22C55E',
          muted: '#64748B',
          text: '#E2E8F0',
          header: '#F8FAFC',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'hud-cyan': '0 0 15px -2px rgba(0, 240, 255, 0.25)',
        'hud-violet': '0 0 15px -2px rgba(139, 92, 246, 0.25)',
        'hud-emerald': '0 0 15px -2px rgba(16, 185, 129, 0.25)',
        'hud-amber': '0 0 15px -2px rgba(245, 158, 11, 0.25)',
        'hud-red': '0 0 15px -2px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
