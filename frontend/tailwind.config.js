/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'login': ['Inter', 'DM Sans', 'sans-serif'],
        'register': ['Manrope', 'Poppins', 'sans-serif'],
        'dashboard': ['Satoshi', 'Urbanist', 'sans-serif'],
        'product': ['Plus Jakarta Sans', 'Work Sans', 'sans-serif'],
      },
      colors: {
        primary: '#6366F1', // Indigo for login/primary
        success: '#10B981', // Green for success/progress
        edit: '#F59E42', // Orange for edit
        delete: '#EF4444', // Red for delete
        report: '#10B981', // Emerald for report (same as success)
        cancel: '#6B7280', // Gray for cancel
        background: '#F7F7FA', // Light neutral background
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-critical': 'pulseCritical 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        pulseCritical: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
        },
      },
    },
  },
  plugins: [],
}
