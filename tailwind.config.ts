import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7ff',
          100: '#b3ebff',
          200: '#80deff',
          300: '#4dd0ff',
          400: '#00c8ff', // Logo start color
          500: '#00b0e6',
          600: '#0099cc',
          700: '#0080b3',
          800: '#006699',
          900: '#004d80',
        },
        accent: {
          50: '#f3e5f5',
          100: '#e1bee7',
          200: '#ce93d8',
          300: '#ba68c8',
          400: '#ab47bc',
          500: '#9c27b0',
          600: '#8e24aa',
          700: '#7b1fa2',
          800: '#6a1b9a',
          900: '#6400c8', // Logo end color
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00C8FF 0%, #6400C8 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #00B0E6 0%, #5500AA 100%)',
      },
    },
  },
  plugins: [],
}
export default config

