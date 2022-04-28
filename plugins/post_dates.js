/**
 * Assign dates to collection files based on the filename (like jekyll)
 */

const match = require('multimatch');
const moment = require('moment');

module.exports = (options) => {
	if(!options) options = {};
	const pattern = options.pattern || ['posts/**/*.md'];
	return (files, metalsmith, done) => {
		match(Object.keys(files), pattern)
			.map((k) => [k, files[k]])
			.forEach(([path, f]) => {
				const date = path.replace(/.*?\/([0-9]{4}-[0-9]{2}-[0-9]{2}).*/, '$1');
				if(date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
					f.date = date;
					f.date_moment = moment(date);
				}
			});
		done();
	};
};

