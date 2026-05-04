/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--aurax-font-sans)",
          "Tajawal",
          "ui-serif",
          "serif",
        ],
        display: [
          "var(--aurax-font-sans)",
          "Tajawal",
          "ui-serif",
          "serif",
        ],
      },
      colors: {
        // aurax silver/black themed palette
        aurax: {
          50:  "#F7F7F8",
          100: "#EDEEF0",
          200: "#D9DBDF",
          300: "#BDC1C7",
          400: "#9AA0A8",
          500: "#7A808A", // primary silver tone
          600: "#565B64",
          700: "#3A3E45",
          800: "#1F2226",
          900: "#0B0C0E", // near black
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px -10px rgba(0,0,0,0.6)",
        soft: "0 8px 24px -12px rgba(0,0,0,0.25)",
      },
      backgroundImage: {
        "silver-gradient":
          "linear-gradient(135deg,#EDEEF0 0%,#BDC1C7 25%,#7A808A 55%,#3A3E45 100%)",
        "noir-gradient":
          "linear-gradient(135deg,#0B0C0E 0%,#1F2226 50%,#3A3E45 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
