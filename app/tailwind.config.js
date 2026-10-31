/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        'bg-elev': '#161616',
        'bg-hi': '#1f1f1f',
        border: '#2a2a2a',
        'border-hi': '#3a3a3a',
        text: '#f0f0f0',
        'text-dim': '#a0a0a0',
        'text-muted': '#606060',
        accent: '#ffb000',
        'accent-dim': '#7a5300',
        danger: '#ff3b30',
        success: '#30d158',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'SF Mono'", 'Monaco', 'Consolas', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'system-ui', 'sans-serif'],
      },
      minHeight: { tap: '44px' },
      minWidth: { tap: '44px' },
    },
  },
  plugins: [],
}

