module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#e1e5e9',
          500: '#4a5568',
          600: '#2d3748',
          700: '#1a202c',
        },
        secondary: {
          50: '#e6fffa',
          500: '#3182ce',
          600: '#2c5282',
        },
        accent: {
          500: '#718096',
          600: '#4a5568',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
