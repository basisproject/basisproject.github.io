"use strict";

const Anonymizer = (() => {
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms || 0));

	const load = async (options) => {
		const container = options.container;
		if(!container) throw new Error('Anonymizer::load() -- missing `container`');
		const svg = container.querySelector('svg');
		if(!svg) throw new Error('Anonymizer::load() -- missing svg in container');
		animate_text(container, options);
		await sleep(1500);
		animate_steam(svg, container, options);
	};

	const animate_steam = async (svg, container, options) => {
		const loop = () => animate_steam(svg, container, options);
		const steam = svg.querySelector('#steam');
		if(!steam || container.getAttribute('data-animation-disabled') == 'true') {
			await sleep(1000);
			return loop();
		}
		steam.classList.toggle('flip');
		await sleep(1500);
		return loop();
	};

	const animate_text = async (container, options) => {
		const loop = () => animate_text(container, options);
		const text = container.parentNode.querySelector('anon');
		if(!text || container.getAttribute('data-animation-disabled') == 'true') {
			await sleep(1000);
			return loop();
		}
		await sleep(1500);
		let letters = text.innerHTML.split('');
		const copy = letters.slice(0);
		const promises = [];
		const randomchar = () => {
			const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$%^()*&[]#/\\';
			const char = chars[Math.floor(Math.random() * chars.length)];
			return char;
		};
		const update_text = (arr) => { text.innerHTML = arr.join(''); };
		const switcher = async (idx, final) => {
			const num_switches = 5;
			for(var i = 0; i < num_switches; i++) {
				letters[idx] = randomchar();
				update_text(letters);
				await sleep(50);
			}
			letters[idx] = final;
			update_text(letters);
		};
		for(var i = 0; i < letters.length; i++) {
			promises.push(switcher(i, options.to_message[i]));
			await sleep(75);
		}
		await Promise.all(promises);
		await sleep(3000);
		update_text(copy);
		return loop();
	};

	const init = (options) => {
		load(options);
	};
	return init;
})();


