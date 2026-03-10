/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#ffffff",
        "primary-inverse": "#090909",
        "background-light": "#f0f0f0",
        "background-dark": "#0B0B0C",
        "surface-dark": "#161617",
        "border-dark": "#27272A",
        "accent-purple": "#a855f7",
      },
      fontFamily: {
        "display": ["Outfit", "sans-serif"],
        "body": ["Outfit", "sans-serif"],
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
      keyframes: {
        scrollMarquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'marquee': 'scrollMarquee 20s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
