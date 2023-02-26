/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./components/**/*.js",
    "./screens/**/*.js",
    "./navigation/**/*.js",
    "./models/**/*.js",
    "./translations/**/*.js",
    "./App.js",
],
  theme: {
    colors: {
      'gray': '#D1D5DB',
      'offwhite': '#F5F4FF',
      'lightlavender': '#DDD6F6',
      'lavender': '#C0B3F1',
      'salmon': '#ff7f73',
      'teal': '#00394E',
      'turquoise': '#005C6A',
      'seafoam': '#5B9F8F'
    },
    extend: {},
  },
  plugins: [],
}
