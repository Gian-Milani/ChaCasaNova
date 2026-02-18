/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Paleta extraída de cores.jpg + marrom-chocolate para headers
        champagne: {
          DEFAULT: '#F7F4EC',  // off-white / bege fundo
          light: '#F9EBEB',    // pastel pink background
        },
        pastel: {
          pink: '#F2D7D9',     // rosa pastel
          teal: '#A8D0D3',    // azul-esverdeado poeirento
        },
        chocolate: {
          DEFAULT: '#4E342E', // marrom-chocolate escuro (headers)
          dark: '#3E2723',
        },
        charcoal: '#222222',  // texto escuro
        neutral: '#9A9A9A',   // cinza neutro
      },
    },
  },
  plugins: [],
}
