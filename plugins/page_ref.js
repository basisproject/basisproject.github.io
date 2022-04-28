/**
 * This takes each file and recursively stores itself under the `page` key, giving
 * access to the entire set of vars under {{ page.* }} in the templating engine.
 */

module.exports = () => (files) => {
	Object.keys(files)
		.forEach((path) => files[path].page = files[path])
};

