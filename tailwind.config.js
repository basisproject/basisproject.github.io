module.exports = {
	content: [
		'docs/**/*.html',
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
				accent: ['Titillium Web', 'sans-serif'],
				logo: ['Bolshevik'],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};

