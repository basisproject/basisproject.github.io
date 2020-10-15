"use strict";

const Profitless = (() => {
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms || 0));
	const load = (options) => {
		const container = options.container;
		if(!container) throw new Error('Profitless::load() -- missing `container`');
		const svg = container.querySelector('svg');
		if(!svg) throw new Error('Profitless::load() -- missing svg in container');
		animate(svg, container);
	};

	const animate = async (svg, container) => {
		if(container.getAttribute('data-animation-disabled') == 'true') {
			await sleep(1000);
			return animate(svg, container);
		}
		await sleep(1000);
		return animate(svg, container);
	};

	const init = (options) => {
		load(options);
	};
	return init;
})();

