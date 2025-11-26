export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores corporativos Business IT (actualizados)
        'bit-black': '#000000',
        // Primary lime green
        'bit-green': '#94BA1D',
        // Active / accent cyan
        'bit-green-light': '#50EED3',
        // Darker green for textos
        'bit-green-dark': '#7BA013',
        // Hover state (verde azulado)
        'bit-green-hover': '#009E83',

        // Azul corporativo
        'bit-blue-dark': '#00326D',
        'bit-blue-light': '#EFF7FF',
        'bit-blue-border': '#D2E9FC',

        // Acento amarillo suave
        'bit-yellow-soft': '#FFF9E3',

        // Grises neutros
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',

        // Estados
        'state-success': '#10B981',
        'state-warning': '#F59E0B',
        'state-error': '#EF4444',
        'state-info': '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        md: '0.5rem', // 8px
        lg: '0.75rem', // 12px
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}


