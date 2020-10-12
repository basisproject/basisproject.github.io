"use strict";

const Anonymizer = (() => {
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms || 0));

	const load = (options) => {
		const container = options.container;
		if(!container) throw new Error('Anonymizer::load() -- missing `container`');
		const canvas = container.querySelector('canvas');
		if(!canvas) throw new Error('Anonymizer::load() -- missing canvas in container');
		canvas.className = 'reset start';
		canvas.className = 'start';
		const canvas2 = document.createElement('canvas');
		const img = new Image();
		const resize = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			canvas2.width = canvas.width;
			canvas2.height = canvas.height;
		};
		img.onload = () => {
			resize();
			animate(canvas, container, { ...options, img, canvas2 });
		};
		img.src = options.image;
	};

	const animate = async (canvas, container, options) => {
		const loop = () => animate(canvas, container, options);
		if(container.getAttribute('data-animation-disabled') == 'true') {
			await sleep(1000);
			return loop();
		}
		const ctx = canvas.getContext('2d');
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		const redraw = (scale) => {
			const ctx2 = options.canvas2.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx2.clearRect(0, 0, canvas.width, canvas.height);
			ctx2.mozImageSmoothingEnabled = false;
			ctx2.webkitImageSmoothingEnabled = false;
			ctx2.imageSmoothingEnabled = false;
			const img = options.img;
			const width = canvas.width * scale;
			const height = canvas.height * scale;
			ctx2.drawImage(img, 0, 0, width, height);
			ctx.drawImage(options.canvas2, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
		};

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.className = 'reset start';
		redraw(1);
		await sleep(1);
		canvas.className = 'show';
		await sleep(1500);
		for(var i = 0, n = 1; i < 6; i++, n *= 2) {
			redraw(1 / n);
			await sleep(250);
		}
		await sleep(500);
		canvas.className = 'done';
		await sleep(1500);
		canvas.className = 'reset start';
		await sleep(1000);
		return loop();
	};

	const init = (options) => {
		load(options);
	};
	return init;
})();


