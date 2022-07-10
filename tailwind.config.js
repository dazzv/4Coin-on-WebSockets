module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontSize: {
      '2xl': '1.7rem'
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
