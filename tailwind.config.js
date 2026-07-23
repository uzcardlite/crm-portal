/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#12182B",
          text: "#C7C9D6",
          active: "#F5A623",
          "active-text": "#412402",
        },
        background: "#F8F9FB",
        accent: {
          DEFAULT: "#F5A623",
          light: "#FAC775",
          dark: "#854F0B",
        },
        success: {
          DEFAULT: "#0F6E56",
          bg: "#E1F5EE",
        },
        danger: {
          DEFAULT: "#A32D2D",
          bg: "#FCEBEB",
        },
        // Per-group lesson hues (LessonCard's colored rail) — same palette as
        // crm-frontend's Schedule/portal so a group keeps its hue everywhere.
        scheduleBlock: {
          teal: { bg: "#CCFBF1", text: "#0F766E", border: "#5EEAD4" },
          blue: { bg: "#DBEAFE", text: "#1D4ED8", border: "#93C5FD" },
          violet: { bg: "#EDE9FE", text: "#6D28D9", border: "#C4B5FD" },
          rose: { bg: "#FFE4E6", text: "#BE123C", border: "#FDA4AF" },
          amber: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
          green: { bg: "#DCFCE7", text: "#15803D", border: "#86EFAC" },
          pink: { bg: "#FCE7F3", text: "#BE185D", border: "#F9A8D4" },
        },
      },
      borderRadius: {
        // Softer, rounder surfaces — the "modern & soft" refresh.
        card: "16px",
        btn: "10px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Layered, low-opacity shadows read as soft depth, not a hard edge.
        card: "0 1px 2px 0 rgb(16 24 40 / 0.04), 0 2px 8px -2px rgb(16 24 40 / 0.08)",
        "card-hover": "0 8px 24px -4px rgb(16 24 40 / 0.12)",
        drawer: "0 10px 40px -8px rgb(16 24 40 / 0.35)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
