import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#A4506B",
          dark: "#8A425A",
          light: "#F6EBF0",
          50: "#F5E6EA",
          100: "#ECCBD4",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#FAF7F2",
          subtle: "#F2EDE4",
        },
        text: {
          DEFAULT: "#2E2430",
          muted: "#6B5E6E",
          inverse: "#FAF7F2",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "serif"],
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        label: ["var(--font-label)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
