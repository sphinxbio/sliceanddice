// postcss.config.js
module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('tailwindcss'),
    require('postcss-import'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('cssnano'),
  ]
}