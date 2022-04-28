/**
 * Generate a stupid table of contents from *HTML* (so, must be included AFTER the
 * page renders, but BEFORE the layout runs).
 */

module.exports = (options) => {
	if(!options) options = {};
	const marker = options.marker || /{:toc}/g;
	return (files, metalsmith, done) => {
		const needs_toc = Object.keys(files)
			.filter((path) => files[path].generate_toc);
		needs_toc.forEach((path) => {
			const file = files[path];
			const html = file.contents.toString('utf8');
			const toc = [];
			const entries = [];
			// find h1-h4
			html.replace(/<h[1234]\s.*?>.*?<\/h[1234]>/g, (match) => {
				// parse into tagname, id, and text content
				const [tag, id, content] = match
					.replace(/<(h[1234])\s.*?(id="(.*?)")?.*?>(.*?)<\/h[1234]>/si, '$1,$3,$4')
					.split(',');
				// determine the indent level
				const level = parseInt(tag.replace(/[^0-9]/g, ''));
				entries.push({tag, id, content, level});
			});

			// loop over our stupid entries and build a POJO tree
			const first_level = entries[0].level;
			const tree = {};
			const parents = [];
			const get_tree = () => {
				let cur = tree;
				parents.forEach((id) => cur = cur[id].children);
				return cur;
			};
			let last = null;
			entries
				.filter((e) => e.level >= first_level)
				.forEach((entry) => {
					let tree = get_tree();
					const tree_entry = {
						entry,
						children: {},
					};
					if(!last) {
						last = entry;
						tree[entry.id] = tree_entry;
						return;
					} 
					if(entry.level > last.level) {
						if(entry.level - last.level > 1) {
							throw new Error('Level jumped');
						}
						parents.push(last.id);
						tree = get_tree();
						tree[entry.id] = tree_entry;
					} else if(entry.level < last.level) {
						const diff = last.level - entry.level;
						for(let i = 0; i < diff; i++) {
							parents.pop();
							tree = get_tree();
						}
						tree[entry.id] = tree_entry;
					} else if(entry.level == last.level) {
						tree[entry.id] = tree_entry;
					}
					last = entry;
				});

			// turn our stinkin tree into nested <ul><li><ul>...</ul></li>...</ul>
			if(Object.keys(tree).length > 0) {
				const tag = (tagname) => `<${tagname}>`;
				const html = [];
				const build_html = (entries) => {
					html.push(tag('ul'));
					Object.keys(entries).forEach((id) => {
						const node = entries[id];
						html.push(tag('li'))
						html.push(`<a href="#${node.entry.id}">${node.entry.content}</a>`);
						if(Object.keys(node.children).length > 0) {
							build_html(node.children);
						}
						html.push('</li>');
					});
					html.push('</ul>');
				};
				build_html(tree);
				// now, becaues this plugin requires html we can't just assign
				// the TOC into a var and have nunjucks print it (because that
				// ship has sailed already), so we do the dumb replacement
				// inline here.
				const replaced = file.contents
					.toString('utf8')
					.replace(marker, html.join('\n'));
				file.contents = Buffer.from(replaced);
			}
		});
		done();
	};
};

