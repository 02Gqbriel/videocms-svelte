const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,svelte}'],
	theme: {
		fontFamily: {
			sans: ["'Outfit'", ...fontFamily.sans],
		},
		extend: {},
	},
	plugins: [],
};
