/** @type {import('tailwindcss').Config} */
module.exports = {
  // files where tailwind can be used (feel free to add more as needed)
  content: [
    "./assets/**/*.js",
    "./components/**/*.js",
    "./screens/**/*.js",
    "./navigation/**/*.js",
    "./models/**/*.js",
    "./translations/**/*.js",
    "./App.js",
],
  // jit (just-in-time compilation) mode enables CSS functions like calc() to be used for dynamic styling
  mode: 'jit',

  // theme is used to define the colors, fonts, and other styles that are used throughout the app
  // example: <View className="bg-teal border-2 border-salmon"> <-- teal and salmon will map to the colors values defined below
  theme: {
    extend: {
      colors: {
        'gray': '#D1D5DB',
        'offwhite': '#FEFFF4',
        'lavenderlight': '#DDD6F6',
        'lavender': '#C0B3F1',
        'salmon': '#ff7f73',
        'teal': '#00394E',
        'turquoise': '#005C6A',
        'seafoam': '#5B9F8F',
        'greydark': '#272727',
      }
    }
  },

  // plugins are general addons to extend tailwind
  plugins: [],
    // safelist was added because some of the theme colors were not working, so adding this pattern ensures they will work across all files
    safelist: [{
      pattern: /(bg|text|border)-(gray|offwhite|lavenderlight|lavender|salmon|teal|turquoise|seafoam|greydark)/
    }
  ]
}
