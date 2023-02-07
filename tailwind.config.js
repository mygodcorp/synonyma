/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: "10px",
      sm: "12px",
      base: "16px",
      lg: "24px",
      xl: "32px",
      "2xl": "40px",
      "3xl": "48px",
      "4xl": "56px",
      "5xl": "64px",
      "6xl": "72px",
      "7xl": "80px",
    },
  },
  plugins: [],
};
