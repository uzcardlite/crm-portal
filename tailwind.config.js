/** @type {import('tailwindcss').Config} */
export default {
  // Night mode is toggled by adding `.dark` to <html> (see utils/theme.js and
  // the flash-prevention script in index.html).
  darkMode: "class",
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
        // Semantic, theme-aware surfaces/text — driven by the CSS variables in
        // index.css so a single `.dark` toggle re-skins the whole app.
        background: "rgb(var(--page-bg) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          secondary: "rgb(var(--fg-secondary) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
          faint: "rgb(var(--fg-faint) / <alpha-value>)",
        },
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
        info: {
          DEFAULT: "#2563EB",
          bg: "#E5EEFF",
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
      backgroundImage: {
        // Girih tile: two overlapping squares (one rotated 45°) forming an
        // eight-pointed star outline (accent #F5A623 at 6% opacity). The only
        // place a raw hex is allowed in the design system.
        "girih-faint":
          "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3E%3Cg%20fill='none'%20stroke='%23F5A623'%20stroke-width='1'%20opacity='0.06'%3E%3Crect%20x='8'%20y='8'%20width='24'%20height='24'/%3E%3Crect%20x='8'%20y='8'%20width='24'%20height='24'%20transform='rotate(45%2020%2020)'/%3E%3C/g%3E%3C/svg%3E\")",
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
