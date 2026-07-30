/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        royal: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          surface: "rgb(var(--color-surface) / <alpha-value>)",
          surfaceLight: "rgb(var(--color-surface-light) / <alpha-value>)",
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          primaryLight: "rgb(var(--color-primary-light) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
          text: "rgb(var(--color-text-main) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          border: "rgb(var(--color-border) / <alpha-value>)",
          income: "rgb(var(--color-income) / <alpha-value>)",
          expense: "rgb(var(--color-expense) / <alpha-value>)",
          warning: "rgb(var(--color-warning) / <alpha-value>)",
          info: "rgb(var(--color-info) / <alpha-value>)",
        },
      },
      boxShadow: {
        glow: "0 24px 80px rgb(var(--color-primary) / 0.24)",
        card: "0 18px 50px rgb(var(--shadow-color) / 0.35)",
        soft: "0 12px 35px rgb(var(--shadow-color) / 0.18)",
      },
      backgroundImage: {
        "royal-gradient": "var(--app-gradient)",
      },
    },
  },
  plugins: [],
};
