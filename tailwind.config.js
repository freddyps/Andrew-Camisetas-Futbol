/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'futbol-verde': '#22c55e',
        'hospital-dark': '#0f172a',
      },
    },
  },
  plugins: [],
}
