import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#0B0F1A",
          800: "#141A2A",
          700: "#1F2738",
          600: "#38415A",
        },
        gold: {
          DEFAULT: "#C8A45D",
          600: "#B8924A",
          400: "#D6B878",
          300: "#E3CB9B",
        },
        atlas: {
          DEFAULT: "#2D6CDF",
          600: "#2257C0",
        },
        sand: {
          100: "#FAF5EC",
          200: "#F3E9D6",
          300: "#EBDBBF",
          400: "#E2CBA0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(11,15,26,0.6) 0%, rgba(11,15,26,0.15) 45%, rgba(11,15,26,0.8) 100%)",
        "card-gradient":
          "linear-gradient(to top, rgba(11,15,26,0.9) 0%, transparent 55%)",
      },
      animation: {
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "marquee": "marquee 28s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1F2738",
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-display)",
              fontWeight: "500",
              color: "#0B0F1A",
            },
            a: {
              color: "#C8A45D",
              "&:hover": {
                color: "#B8924A",
              },
            },
            "strong": {
              color: "#0B0F1A",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
