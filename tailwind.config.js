module.exports = {
  theme: {
    container: (theme) => ({
      center: true,
      padding: theme("spacing.4"),
    }),
    extend: {
      colors: {
        navy: {
          default: "#324353",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["hover"],
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          "@screen sm": {
            maxWidth: "640px",
          },
          "@screen md": {
            maxWidth: "768px",
          },
          "@screen lg": {
            maxWidth: "1024px",
          },
          "@screen xl": {
            maxWidth: "1024px",
          },
        },
      });
    },
  ],
  purge: ["./src/**/*.tsx"],
};
