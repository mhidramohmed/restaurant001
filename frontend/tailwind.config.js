module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
            primary: {
                DEFAULT: '#99582a',   // primary color
                light: '#b37347',     // lighter shade
                dark: '#7a4621'       // darker shade
            },
            background: '#fcf0d2',   // background color
            text: {
                DEFAULT: '#432818',   // primary text color
                light: '#6b5641'      // lighter text shade
            }
            }
        }
    
    },
    plugins: [require('@tailwindcss/forms')],
}
