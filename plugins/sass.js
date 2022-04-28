/**
 * This plugin runs SCSS to convert .scss files to .css
 */

const match = require('multimatch');
const sass = require('sass');

async function render_file(file) {
	return new Promise((resolve, reject) => {
		sass.render({ file }, function(err, result) {
			if(err) return reject(err);
			resolve(result);
		});
	});
}

module.exports = (options) => {
	if(!options) options = {};
	const pattern = options.pattern || '**/*.scss';
	return (files, metalsmith, done) => {
		const matches = match(Object.keys(files), pattern);
		const renders = matches.map(async (scss_filename) => {
			const file = files[scss_filename];
			const css_filename = scss_filename.replace(/\.scss$/, '.css');
			const sass_contents = await render_file(`${metalsmith._directory}/${metalsmith._source}${scss_filename}`);
			file.contents = sass_contents.css;
			delete files[scss_filename];
			files[css_filename] = file;
		});
		return Promise.all(renders)
			.then(() => done())
			.catch((err) => done(err));
	};
};

