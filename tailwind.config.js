/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Teal
        primary: "#0CC8A8",
        "primary-hover": "#0AB394",
        "primary-muted": "#0CC8A820",

        // Dark Mode Backgrounds
        "dark-bg": "#0F0F0F",
        "dark-card": "#1A1A1A",
        "dark-nav": "#141414",
        "dark-input": "#242424",

        // Light Mode Backgrounds
        "light-bg": "#F5F5F5",
        "light-card": "#FFFFFF",
        "light-nav": "#FAFAFA",
        "light-input": "#F0F0F0",

        // Severity Colors
        critical: "#E53935",
        "critical-bg": "#E5393515",
        high: "#FB8C00",
        "high-bg": "#FB8C0015",
        medium: "#FDD835",
        "medium-bg": "#FDD83515",
        low: "#43A047",
        "low-bg": "#43A04715",

        // Scan Status
        "status-completed": "#0CC8A8",
        "status-scheduled": "#7C83FD",
        "status-failed": "#E53935",
        "status-running": "#FB8C00",

        // Borders
        "border-dark": "#2A2A2A",
        "border-light": "#E0E0E0",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },

      boxShadow: {
        "card-dark": "0 1px 3px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
        "card-light": "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
        "teal-glow": "0 0 16px rgba(12,200,168,0.35)",
        "teal-glow-sm": "0 0 8px rgba(12,200,168,0.25)",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(12,200,168,0.4)" },
          "70%": { boxShadow: "0 0 0 6px rgba(12,200,168,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(12,200,168,0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out both",
        "terminal-blink": "terminal-blink 1s step-end infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
    },
  },
  plugins: [],
};
