// postcss.config.cjs
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('@tailwindcss/postcss'),  // This line may need to be removed if it's not correct
  ],
};
