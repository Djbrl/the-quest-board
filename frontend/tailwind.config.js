/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        switzer: ['Switzer', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        comico: ['Comico', 'sans-serif'],
        zodiak: ['Zodiak', 'sans-serif'],
        khand: ['Khand', 'sans-serif'],
        pixel: ['Pixel', 'sans-serif'],
        monaSans: ['MonaSans', 'sans-serif'],
        martialMono: ['MartialMono', 'sans-serif'],
      },
    },
  },
  plugins: [],
}