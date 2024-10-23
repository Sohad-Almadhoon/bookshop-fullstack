/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cardinal: ["Cardinal", "sans-serif"],
        romie: ["Romie", "sans-serif"], // Already added "Romie" font
        voyage: ["voyage", "serif"],
        baskervville: ["Baskervville", "serif"],
      },
      fontWeight: {
        romieLight: 300,
        romieRegular: 400,
        romieMedium: 500,
        romieBold: 700,
      },
    },
  },
  plugins: [],
};
