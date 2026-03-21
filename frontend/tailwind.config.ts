import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#081019",
        panel: "#101826",
        line: "#1f2a3a",
        brand: "#7dd3fc",
      },
    },
  },
  plugins: [],
} satisfies Config;
