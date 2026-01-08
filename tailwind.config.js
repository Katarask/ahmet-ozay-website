/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Alegreya', 'Georgia', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        // Light Mode - Warm Stone Palette
        light: {
          bg: {
            primary: '#FFFFFF',      // 100%
            secondary: '#FAFAF9',    // 98%
            tertiary: '#F5F5F4',     // 96%
          },
          text: {
            primary: '#0C0C0C',      // 5%
            secondary: '#525252',    // 32%
            tertiary: '#737373',     // 45%
            muted: '#A3A3A3',        // 64%
          },
          border: {
            primary: '#E5E5E5',      // 90%
            secondary: '#D4D4D4',    // 83%
            accent: '#0C0C0C',       // 5%
          },
          accent: {
            primary: '#131F5B',      // Ahmet's brand blue
            hover: '#1a2a7a',
          }
        },
        // Dark Mode - Deep Slate Palette
        dark: {
          bg: {
            primary: '#0A0A0B',      // 4%
            secondary: '#121214',    // 7%
            tertiary: '#1A1A1D',     // 10%
          },
          text: {
            primary: '#FAFAFA',      // 98%
            secondary: '#A1A1AA',    // 63%
            tertiary: '#71717A',     // 44%
            muted: '#52525B',        // 32%
          },
          border: {
            primary: '#27272A',      // 15%
            secondary: '#3F3F46',    // 25%
            accent: '#FAFAFA',       // 98%
          },
          accent: {
            primary: '#6B7CFF',      // Lighter blue for dark mode
            hover: '#8B99FF',
          }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '800px',
          },
        },
      },
    },
  },
  plugins: [],
}
