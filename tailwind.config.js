/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./admin/**/*.{js,ts,jsx,tsx}",
        // Exclude node_modules to speed up build
        "!./node_modules",
    ],
    theme: {
        extend: {
            colors: {
                'fario-purple': '#7a51a0',
                'fario-dark': '#0f172a',
                'fario-lime': '#d9f99d',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            }
        },
    },
    plugins: [],
}
