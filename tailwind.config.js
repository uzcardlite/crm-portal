/** @type {import('tailwindcss').Config} */
export default {
  // The parent app is night-only by design (see DIZAYN.md §1): there is no
  // light variant, so no `.dark` class and no `dark:` variants anywhere.
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // --- brand ---------------------------------------------------------
        // Carrot earns attention: active tab, bell count, star total, the next
        // lesson. Used everywhere it would be visible nowhere.
        carrot: {
          DEFAULT: "#D2712F",
          bright: "#EC8A45",
          deep: "#A0501C",
        },

        // --- surfaces ------------------------------------------------------
        bg: "#181310",
        surface: {
          DEFAULT: "#241C16",
          // Raised: bottom sheets, the drawer, an unread row.
          2: "#2C231B",
        },
        line: "rgba(255,255,255,.08)",

        // --- text ----------------------------------------------------------
        ink: {
          DEFAULT: "#F4EEE7",
          soft: "#BAAA9B",
          faint: "#7F7466",
        },

        // --- state (never decoration) ---------------------------------------
        // Carrot never carries state: "came to class" is teal, not carrot, or
        // the parent stops being able to read colour at all.
        teal: "#34C9A3",
        rose: "#F5766B",
        amber: "#E8B04B",
        sky: "#62A8F0",
      },

      borderRadius: {
        card: "17px",
        btn: "11px",
      },

      fontFamily: {
        // Numbers and headings only — everything else is Jakarta.
        display: ["Bricolage Grotesque", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      boxShadow: {
        // The app's signature. Only on the one element that must pull the eye —
        // a card itself never glows, something inside it does.
        glow: "0 0 18px -2px rgba(236,138,69,.55)",
        "glow-lg": "0 0 34px -4px rgba(236,138,69,.55)",
        "glow-sm": "0 0 8px -1px rgba(236,138,69,.55)",
        "glow-teal": "0 0 18px -4px rgba(52,201,163,.6)",
        "glow-rose": "0 0 10px -2px rgba(245,118,107,.7)",
        sheet: "0 -24px 60px -12px rgba(0,0,0,.78)",
        drawer: "26px 0 60px -18px rgba(0,0,0,.8)",
        tabbar: "0 20px 40px -14px rgba(0,0,0,.7)",
      },

      backgroundImage: {
        // Layer 1 of every screen (DIZAYN.md §4): a 46px carrot grid at 5.5%.
        grid: "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='46'%20height='46'%3E%3Cpath%20d='M46%200H0v46'%20fill='none'%20stroke='%23F0A16A'%20stroke-width='1'%20opacity='0.055'/%3E%3C/svg%3E\")",
        // Layer 2: the warm bloom that sits behind the top of every screen.
        glow: "radial-gradient(circle, rgba(236,138,69,.36) 0%, rgba(210,113,47,.12) 46%, transparent 72%)",
        // Carrot fill for the active tab, the send button, a pressed pill.
        "carrot-grad": "linear-gradient(150deg, #EC8A45, #D2712F)",
      },

      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        // A reaction arrives the way a message does: from above, settling.
        "drop-in": {
          from: { opacity: "0", transform: "translateY(-14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "drawer-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in .2s ease-out",
        "drop-in": "drop-in .28s cubic-bezier(.32,.72,0,1)",
        "sheet-up": "sheet-up .3s cubic-bezier(.32,.72,0,1)",
        "drawer-in": "drawer-in .28s cubic-bezier(.32,.72,0,1)",
      },
    },
  },
  plugins: [],
};
