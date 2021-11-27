module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        'primary': '#2D2D2A',
        'secondary': '#151514',
        'header': '#673ab7',
        'header-hover': '#c2aff0',
      },
      backgroundColor: {
        'pink-primary': '#e40066'
      },
      minHeight: {
        xl: 'calc(100vh - 12rem) !important'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
