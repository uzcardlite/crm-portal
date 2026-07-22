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
        card: "12px",
        btn: "8px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
};
