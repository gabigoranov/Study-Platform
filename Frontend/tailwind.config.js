/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        background: "hsl(var(--background))",
        "background-muted": "hsl(var(--background-muted))",
        surface: "hsl(var(--surface))",
        "surface-muted": "hsl(var(--surface-muted))",
        text: "hsl(var(--text))",
        "text-muted": "hsl(var(--text-muted))",
        "text-inverted": "hsl(var(--text-inverted))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        success: "hsl(var(--success))",
        "success-light": "hsl(var(--success-light))",
        "success-dark": "hsl(var(--success-dark))",
        warning: "hsl(var(--warning))",
        "warning-light": "hsl(var(--warning-light))",
        "warning-dark": "hsl(var(--warning-dark))",
        error: "hsl(var(--error))",
        "error-light": "hsl(var(--error-light))",
        "error-dark": "hsl(var(--error-dark))",
        info: "hsl(var(--info))",
        "info-light": "hsl(var(--info-light))",
        "info-dark": "hsl(var(--info-dark))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
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
    },
  },
  plugins: [require("tailwindcss-animate")]
}

