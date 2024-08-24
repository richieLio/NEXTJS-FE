import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const addVariablesForColors = ({ addBase, theme }: any) => {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
};

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "3xl": "1600px",
      },
    },
    extend: {
      colors: {
        primary: "#4CAF50", // Adjust to match the Aceternity primary color
        accent: "#FFC107",
        background: "#F5F5F5",
        black: {
          DEFAULT: "#000",
          100: "#000319",
          200: "rgba(17, 25, 40, 0.75)",
          300: "rgba(255, 255, 255, 0.125)",
        },
        white: {
          DEFAULT: "#FFF",
          100: "#BEC1DD",
          200: "#C1C2D3",
        },
        blue: {
          100: "#E4ECFF",
        },
        purple: "#CBACF9",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Match the Aceternity font
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      spacing: {
        2: "8px",
        4: "16px",
        6: "24px",
        8: "32px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
        button: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle shadow to buttons
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
  plugins: [
    nextui({
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
    }),
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100" height="100" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
        },
        { values: theme("backgroundColor") }
      );
    },
    function ({ addComponents }: any) {
      addComponents({
        ".btn-primary": {
          backgroundColor: "#4CAF50", // Primary button color
          borderRadius: "8px",
          padding: "12px 24px",
          color: "#fff",
          fontWeight: "600",
          "&:hover": {
            backgroundColor: "#45A049",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 3px rgba(72, 180, 97, 0.4)",
          },
        },
        ".input-field": {
          backgroundColor: "#F5F5F5",
          borderRadius: "4px",
          padding: "10px 16px",
          border: "1px solid #CED4DA",
          boxShadow: "var(--tw-shadow-input)",
          fontSize: "16px",
          "&:focus": {
            outline: "none",
            borderColor: "#4CAF50",
            boxShadow: "0 0 0 3px rgba(72, 180, 97, 0.4)",
          },
        },
        ".form-label": {
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "4px",
          color: "#192E0B",
        },
        ".form-error": {
          fontSize: "12px",
          color: "#DC3545",
          marginTop: "4px",
        },
        // Add other component styles as needed
      });
    },
  ],
};
export default config;
