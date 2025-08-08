// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };



module.exports = {
  darkMode: 'class',
  // ... rest of your config
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Add other colors as needed
      },
    },
  },
}