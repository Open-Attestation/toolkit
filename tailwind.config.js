module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
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
