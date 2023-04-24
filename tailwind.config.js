/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        fontFamily: {
            SourceSansPro: ['Source Sans Pro', 'sans-serif'],
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: '#000000',
            black1: '#0C0122',
            white: '#ffffff',
            lightblack: '#403E3E',
            primary: '#6ee7b7',
            darkprimary:'#047857',
            darkblue: '#0C0122',
            lightblue: '#DFE0EE',
            red: '#ED3E33',
            green: '#59B667',
            yellow: '#FFCF25',
            lightblue1: '#E8EFFA'
        },
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};
