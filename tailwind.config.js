module.exports = {
    corePlugins: {
      // ...
     space: false,
    },
    content: ["./src/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        spacing: {
            1: "8px",
            2: "12px",
            3: "16px",
            4: "24px",
            5: "32px",
            6: "48px",
            sm: "8px",
            md: "16px",
            lg: "24px",
            xl: "48px",
        },
        extend: {
            spacing: {
                13: "3.25rem",
                15: "3.75rem",
                128: "32rem",
                144: "36rem",
            },
        },
    },
    variants: {
        extend: {},
        fontFamily: {
            sans: ["Inter", "ui-sans-serif", "system-ui"],
        },
    },
    plugins: [],
};
