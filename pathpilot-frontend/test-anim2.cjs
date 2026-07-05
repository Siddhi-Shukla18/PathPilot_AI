const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

postcss([
  tailwindcss({
    content: [{ raw: '<div class="message-enter"></div>' }],
    theme: {
      extend: {
        keyframes: { 'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } } },
        animation: { 'fade-in': 'fade-in 0.3s' }
      }
    }
  })
]).process('.message-enter { @apply animate-fade-in; } @tailwind utilities;').then(result => {
  console.log(result.css);
});
