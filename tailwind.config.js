/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./b.html', './b.js'],
  theme: {
    extend: {
      colors: {
        cream: '#fbf7ef',
        oat: '#f2eadc',
        paper: '#fffdf8',
        espresso: '#30221b',
        'espresso-soft': '#58473d',
        crust: '#9a512e',
        caramel: '#bd8742',
        'caramel-light': '#e4c893',
        muted: '#6e6258',
        line: '#e5d9c8'
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif']
      },
      boxShadow: {
        nav: '0 12px 34px rgba(48, 34, 27, 0.07)',
        artisan: '0 18px 48px rgba(48, 34, 27, 0.09), 0 3px 10px rgba(48, 34, 27, 0.04)',
        lift: '0 30px 62px rgba(48, 34, 27, 0.16), 0 8px 18px rgba(48, 34, 27, 0.07)',
        drawer: '-22px 0 60px rgba(31, 24, 19, 0.18)'
      },
      gridTemplateColumns: {
        hero: '1.05fr 1fr'
      },
      keyframes: {
        'artisan-float': {
          '0%, 100%': { translate: '0 0' },
          '50%': { translate: '0 -10px' }
        },
        'badge-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '38%': { transform: 'scale(1.32)' },
          '68%': { transform: 'scale(0.94)' }
        },
        'cart-fly': {
          from: { opacity: '0.95', transform: 'translate3d(var(--fly-x), var(--fly-y), 0) scale(1)' },
          to: { opacity: '0', transform: 'translate3d(var(--fly-to-x), var(--fly-to-y), 0) scale(0.12)' }
        },
        sheen: {
          from: { transform: 'translateX(-140%) skewX(-18deg)' },
          to: { transform: 'translateX(260%) skewX(-18deg)' }
        }
      },
      animation: {
        'artisan-float': 'artisan-float 7s ease-in-out infinite',
        'badge-bounce': 'badge-bounce 420ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'cart-fly': 'cart-fly 680ms cubic-bezier(0.2, 0.75, 0.25, 1) forwards',
        sheen: 'sheen 850ms ease-out'
      }
    }
  },
  plugins: []
};