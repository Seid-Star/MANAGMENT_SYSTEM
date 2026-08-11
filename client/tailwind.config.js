/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1E3A8A",
          lightBlue: "#3B82F6",
          bg: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
