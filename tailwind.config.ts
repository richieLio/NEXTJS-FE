import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        extend: "light",
        colors: {
          background: "#FAFFF0",
          foreground: "#192E0B",
          primary: {
            50: "#FAFFF0",
            100: "#F5FAEB",
            200: "#E3EDD1",
            300: "#C7E0A2",
            400: "#ABD477",
            500: "#8FC750",
            600: "#6CA138",
            700: "#4D7A25",
            800: "#305415",
            900: "#192E0B",
            DEFAULT: "#8FC750",
            foreground: "#192E0B",
          },
          focus: "#AFF500",
        },

      },
      dark: {
        extend: "dark",
        colors: {
          background: "#000000",
          foreground: "#FAFFF0",
          primary: {
            50: "#F1F5E7",
            100: "#DDE6CB",
            200: "#BED69B",
            300: "#9CC16D",
            400: "#7DAC47",
            500: "#64883B",
            600: "#4B652F",
            700: "#394A26",
            800: "#2A371D",
            900: "#1D2317",
            DEFAULT: "#8FC750",
            foreground: "#FAFFF0",
          },
          focus: "#8FC750",
        },
      },
    },
  })]
};
export default config;
