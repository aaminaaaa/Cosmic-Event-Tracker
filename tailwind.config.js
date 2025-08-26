/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // This is crucial: tells Tailwind where to find your React components
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}