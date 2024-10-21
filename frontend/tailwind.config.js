/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cardinal: ["Cardinal", "sans-serif"],
        romie: ["Romie", "sans-serif"],
        voyage: ["voyage", "serif"],
        baskervville: ["Baskervville", "serif"],
      },
    },
  },
  plugins: [],
};

