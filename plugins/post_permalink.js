/**
 * This plugin automatically assigns permalinks to collections based on the standard
 * jekyll format (using the date and slug from the filename (NOT the title))
 */

const match = require('multimatch');

module.exports = (options) => {
	if(!options) options = {};
	const pattern = options.pattern || ['posts/**/*.md'];
	return (files, metalsmith, done) => {
		match(Object.keys(files), pattern)
			.map((k) => [k, files[k]])
			.forEach(([path, f]) => {
				const date = new Date(f.date);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const parts = path.split('/');
				const slug = parts[parts.length - 1]
					.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}-?/, '')
					.replace(/(\.[a-z0-9]{1,4})*$/, '');
				f.permalink = `posts/${year}/${month}/${slug}/`;
				f.url = `${metalsmith._metadata.site.base}/${f.permalink}`;
			});
		done();
	};
};

