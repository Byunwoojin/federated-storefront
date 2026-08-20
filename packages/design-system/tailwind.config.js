const primitives = {
  blue600: "#2563EB",
  slate50: "#FFFFFF",
  slate200: "#E2E8F0",
  slate900: "#0F172A",
  slate500: "#64748B",
  red600: "#DC2626",
};

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: primitives.blue600,
        surface: primitives.slate50,
        border: primitives.slate200,
        "text-primary": primitives.slate900,
        "text-secondary": primitives.slate500,
        price: primitives.red600,
      },
      fontSize: {
        heading: ["18px", { fontWeight: "700" }],
        body: ["14px", { fontWeight: "400" }],
        "price-text": ["16px", { fontWeight: "700" }],
      },
    },
  },
};
