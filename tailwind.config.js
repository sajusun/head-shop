/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        text: "var(--color-text)",
      },
      boxShadow: {
        'premium': 'var(--shadow-premium)',
        'soft': 'var(--shadow-soft)',
        'aura-primary': 'var(--shadow-aura-primary)',
        'aura-accent': 'var(--shadow-aura-accent)',
      },
      borderRadius: {
        'button': 'var(--radius-button)',
        'card': 'var(--radius-card)',
        'section': 'var(--radius-section)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
