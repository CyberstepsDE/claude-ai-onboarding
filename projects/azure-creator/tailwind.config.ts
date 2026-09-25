import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azure-ish accent + a calm slate dashboard palette
        azure: {
          DEFAULT: "#0a84ff",
          soft: "#3b9dff",
          deep: "#0062cc",
        },
        ink: {
          900: "#0b1120",
          800: "#0f172a",
          700: "#1e293b",
          600: "#334155",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
