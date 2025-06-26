/** @type {import('tailwindcss').Theme} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#eb0029",
          dark: "#B20710",
          light: "#F64C4C",
        },
        secondary: {
          DEFAULT: "#FDBA74",
          dark: "#FB923C",
        },
        dark: {
          DEFAULT: "#23262D",
          deeper: "#000000",
        },
        grayish: "#D1D5DB",
      },
    },
  },
  plugins: [],
};
