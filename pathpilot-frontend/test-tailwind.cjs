const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

postcss([
  tailwindcss({
    content: [{ raw: '<div class="bg-card/60"></div>' }],
    theme: {
      extend: {
        colors: {
          card: 'hsl(var(--card))'
        }
      }
    }
  })
]).process('@tailwind utilities;').then(result => {
  console.log(result.css);
});
