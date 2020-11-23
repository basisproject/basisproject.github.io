"use strict";

const MonotonousButton = (() => {
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms || 0));

	const load = async (options) => {
		const container = options.container;
		if(!container) throw new Error('MonotonousButton::load() -- missing `container`');
		const frame2 = options.frame2;
		if(!frame2) throw new Error('MonotonousButton::load() -- missing `frame2`');
		const svg = container.querySelector('svg');
		if(!svg) throw new Error('MonotonousButton::load() -- missing svg in container');
		await sleep(1000);
		animate(svg, frame2, container, options);
	};

	const animate = async (svg, frame2, container, options) => {
		const loop = () => animate(svg, frame2, container, options);
		if(container.getAttribute('data-animation-disabled') == 'true') {
			await sleep(1000);
			return loop();
		}
		const orig = svg.innerHTML;
		svg.innerHTML = frame2.innerHTML;
		await sleep(750);
		svg.innerHTML = orig;
		await sleep(750 + Math.round(Math.random() * 3000));
		return loop();
	};

	const init = (options) => {
		load(options);
	};
	return init;
})();


