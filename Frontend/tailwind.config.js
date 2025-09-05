/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        black25: "0 4px 6px rgba(0, 0, 0, 0.5)", // 25% black
      },
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: "#2563EB",  // main blue
          light: "#3B82F6",
          dark: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#F59E0B",  // warm accent
          light: "#FBBF24",
          dark: "#B45309",
        },
        tertiary: {
          DEFAULT: "#10B981",  // calm green for success / highlights
          light: "#34D399",
          dark: "#047857",
        },

        // Neutral / gray scale
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },

        // Background & surfaces
        background: {
          DEFAULT: "#F5F5F5",
          muted: "#E5E5E5",
          dark: "#1F2937",
        },

        // Alerts & feedback
        success: {
          DEFAULT: "#16A34A",
          light: "#4ADE80",
          dark: "#166534",
        },
        warning: {
          DEFAULT: "#FBBF24",
          light: "#FCD34D",
          dark: "#B45309",
        },
        error: {
          DEFAULT: "#DC2626",
          light: "#EF4444",
          dark: "#991B1B",
        },
        info: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#1D4ED8",
        },

        // Typography colors
        text: {
          light: "#F9FAFB",
          DEFAULT: "#111827",
          muted: "#6B7280",
          inverted: "#FFFFFF",
        },
      },
    },
  },
  "plugins": ["prettier-plugin-tailwindcss"]
}

