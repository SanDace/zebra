/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dashBg: "#dde7ed", // Example custom color
        dashHover: "#e1e5e8", // Another custom color
      },
    },
  },
  plugins: [],
};
