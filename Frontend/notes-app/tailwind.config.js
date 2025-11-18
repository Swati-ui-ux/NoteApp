/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8",   // blue
        secondary: "#9333ea", // purple
        success: "#22c55e",   // green
        warning: "#f59e0b",   // yellow
        danger: "#ef4444",    // red
        info: "#3b82f6",      // light blue
      },
    },
  },
  plugins: [],
}
