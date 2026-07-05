const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

postcss([
  tailwindcss({
    content: [{ raw: '<div class="glass-sm"></div>' }],
    theme: {
      extend: {
        colors: {
          border: 'hsl(var(--border))',
          card: 'hsl(var(--card))'
        }
      }
    }
  })
]).process('.glass-sm { @apply bg-card/40 backdrop-blur-md border border-border/40; } @tailwind utilities;').then(result => {
  console.log(result.css);
});
