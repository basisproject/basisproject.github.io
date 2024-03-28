module.exports = {
	content: [
		'dist/**/*.html',
	],
	//purge: [
	//	'**/*.html',
	//	'**/*.js',
	//],
	theme: {
		extend: {
			colors: {
				'ink': '#111',
				'primary': '#c22',
				'highlight': '#dfebe0',
				'link': '#c22',
				'linkvisited': '#8a1717',
			},
			fontFamily: {
				accent: ['Lato', 'sans-serif'],
				logo: ['Bolshevik'],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};

