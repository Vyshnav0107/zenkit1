/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      // Add custom maxWidth utility for full screen width
      maxWidth: {
        'screen': '100vw',
      },
      // Add break-word utilities if you want
      wordBreak: {
        'break-word': 'break-word',
      },
      // You can add custom colors or shadows if needed
      colors: {
        primary: '#1d4ed8', // example blue
        secondary: '#9333ea', // example purple
      },
      boxShadow: {
        'custom-md': '0 4px 6px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
