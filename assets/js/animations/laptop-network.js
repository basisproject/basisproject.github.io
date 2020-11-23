"use strict";

(() => {
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms || 0));
	const frame = () => new Promise((res) => window.requestAnimationFrame(res));
	const load = (container) => {
		const svg_el = container.querySelector('svg');
		if(!svg_el) console.warn('laptop-network::load_animation() -- missing svg in el', container);
		const svg = d3.select(svg_el);
		svg.append('g').attr('class', 'transactions');
		[1, 2, 3].forEach((id) => {
			const x = svg.select(`#lap${id}-coord`).attr('cx');
			const y = svg.select(`#lap${id}-coord`).attr('cy');
			container.style.setProperty(`--laptop${id}-coords-x`, x+'px');
			container.style.setProperty(`--laptop${id}-coords-y`, y+'px');
		});
		animate(svg, container);
	};

	const num_laptops = 3;
	let tid = 0;
	let current_laptop = 0;
	let runs = 0;
	let transactions = [];
	let data = [];
	const animate = async (svg, container) => {
		if(container.getAttribute('data-animation-disabled') == 'true') {
			await sleep(1000);
			return animate(svg, container);
		}
		const render_data = async () => {
			const groups = {};
			data.forEach((dat) => {
				if(!groups[dat.to]) groups[dat.to] = [];
				groups[dat.to].push(dat);
			});
			Object.keys(groups).forEach((lid) => {
				groups[lid].forEach((dat, i) => {
					const dat_id = `#${dat.to}-data-${i + 1}`;
					svg.select(dat_id)
						.attr('class', `enabled data-${dat.from}`);
				});
			});
			return sleep(1000);
		};
		const clear_data = async () => {
			// clear selected data
			svg.selectAll('#g-db-data path')
				.each(function(el, u) { this.classList.remove('enabled'); });
			return sleep(1000);
		};

		const laptop_id = (numerical_idx) => `laptop${(numerical_idx % num_laptops) + 1}`;

		const from = laptop_id(current_laptop);
		const to1 = laptop_id(current_laptop + 1);
		const to2 = laptop_id(current_laptop + 2);

		transactions.push({ id: tid++, from, to: to1 });
		transactions.push({ id: tid++, from, to: to2 });

		const g_trans = svg.select('g.transactions');
		const enter_g = g_trans
			.selectAll('g')
			.data(transactions, (d) => d.id)
			.enter()
			.append('g')
			.attr('class', (d) => `transaction-container from-${d.from}`);
		const enter_cir = enter_g.append('circle')
			.attr('class', (d) => `transaction from-${d.from}`)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', 125);
		await frame();
		await sleep(10);
		enter_cir.attr('class', (d) => `transaction from-${d.from} open`);
		data.push({ id: tid++, from: laptop_id(current_laptop), to: laptop_id(current_laptop) });
		render_data();
		await sleep(1000);
		enter_g.attr('class', (d) => `transaction-container to-${d.to}`);
		await sleep(1000);
		enter_cir.attr('class', (d) => `transaction from-${d.from} close`);
		data.push({ id: tid++, from: laptop_id(current_laptop), to: laptop_id(current_laptop + 1) });
		data.push({ id: tid++, from: laptop_id(current_laptop), to: laptop_id(current_laptop + 2) });
		await render_data();

		transactions = [];
		g_trans
			.selectAll('g')
			.data(transactions, (d) => d.id)
			.exit()
			.remove();

		current_laptop = Math.round(Math.random() * num_laptops);
		await sleep(1000);
		runs = (runs + 1) % num_laptops;
		if(runs == 0) {
			data = [];
			await clear_data();
		}
		return animate(svg, container);
	};

	window.addEventListener('load', () => {
		document.body.querySelectorAll('.laptop-network')
			.forEach(load);
	});
})();

