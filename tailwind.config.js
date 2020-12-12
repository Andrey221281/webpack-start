module.exports = {
  purge: ['./public/**/*.html', './src/**/*.js'],
  darkMode: false,
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['active']
    }
  }, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        // sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        sans: ['Nunito']
        // serif: ["Russo One"],
      },
      colors: {
        'miro-blue': '#03B4E3',
        'miro-blue-light': '#06c8fb',
        'miro-blue-dark': '#02a2cc'
      }
    }
  },
  plugins: []
}
