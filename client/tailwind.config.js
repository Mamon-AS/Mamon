/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{vue,js,html}",
    "./components/**/*.{vue,js, html}",
],

  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'lightblue': '#289DD2',
        'yellow': '#fde68a',
        'teal': '#a7f3d0',
        'lime': '#86efac',
        'sky': '#5eead4',
        'mamonblue': '#096191', 
        'mamonheader': 'rgba(9, 97, 145, 0.8)',    
      },
      minWidth: {
        'custom-600': '600px',
      },
    },
  },
  plugins: [],
}