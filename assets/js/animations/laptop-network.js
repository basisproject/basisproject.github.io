"use strict";

(() => {
	const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
	const coords = {};
	const load = (container) => {
		const svg_el = container.querySelector('svg');
		if(!svg_el) console.warn('laptop-network::load_animation() -- missing svg in el', container);
		const svg = d3.select(svg_el);
		svg.append('g').attr('class', 'transactions');
		[1, 2, 3].forEach((id) => {
			coords[`laptop${id}`] = [
				svg.select(`#lap${id}-coord`).attr('cx'),
				svg.select(`#lap${id}-coord`).attr('cy'),
			];
		});
		animate(svg);
	};

	const num_laptops = 3;
	let tid = 0;
	let current_laptop = 0;
	let runs = 0;
	let transactions = [];
	let data = [];
	const animate = async (svg) => {
		const trans = (opts) => {
			opts || (opts = {});
			return d3.transition()
				.duration(opts.duration || 1000)
				.delay(opts.delay || 0)
				.ease(d3.easeCubic);
		};

		const render_data = async () => {
			const groups = {};
			// clear selected data
			if(data.length == 0) {
				svg.selectAll('#g-db-data path')
					.each(function(el, u) { this.classList.remove('enabled'); });
				return sleep(1000);
			} else {
				svg.selectAll('#g-db-data path').attr('class', '');
			}

			data.forEach((dat) => {
				if(!groups[dat.to]) groups[dat.to] = [];
				groups[dat.to].push(dat);
			});
			const promises = [];
			Object.keys(groups).forEach((lid) => {
				groups[lid].forEach((dat, i) => {
					const dat_id = `#${dat.to}-data-${i + 1}`;
					svg.select(dat_id)
						.attr('class', `enabled data-${dat.from}`);
				});
			});
			return sleep(1000);
		};

		const laptop_id = (numerical_idx) => `laptop${(numerical_idx % num_laptops) + 1}`;

		const from = coords[`${laptop_id(current_laptop)}`];
		const to1 = coords[`${laptop_id(current_laptop + 1)}`];
		const to2 = coords[`${laptop_id(current_laptop + 2)}`];

		transactions.push({ id: tid++, from, to: to1 });
		transactions.push({ id: tid++, from, to: to2 });

		const g_trans = svg.select('g.transactions');
		const enter = g_trans
			.selectAll('circle.transaction')
			.data(transactions)
			.enter();
		const enter_trans = enter.append('circle')
			.attr('class', (d) => `transaction transaction-from-${laptop_id(current_laptop)}`)
			.attr('cx', from[0])
			.attr('cy', from[1])
			.attr('r', 0)
			.transition(trans())
			.attr('r', 125);
		sleep(250).then(() => {
			data.push({ id: tid++, from: laptop_id(current_laptop), to: laptop_id(current_laptop) });
			render_data();
		});
		const go_trans = enter_trans
			.transition(trans())
			.attr('cx', (d) => d.to[0])
			.attr('cy', (d) => d.to[1]);
		const leave_trans = go_trans
			.transition(trans())
			.attr('r', 0);
		leave_trans.end().then(() => {
			transactions = [];
			g_trans
				.selectAll('circle.transaction')
				.data(transactions)
				.exit()
				.remove();
		});
		await go_trans.end();
		data.push({ id: tid++, from: laptop_id(current_laptop), to: laptop_id(current_laptop + 1) });
		data.push({ id: tid++, from: laptop_id(current_laptop), to: laptop_id(current_laptop + 2) });
		await render_data();

		current_laptop = Math.round(Math.random() * num_laptops);
		await sleep(1000);
		runs = (runs + 1) % num_laptops;
		if(runs == 0) {
			data = [];
			await render_data();
		}
		animate(svg);
	};

	window.addEventListener('load', () => {
		document.body.querySelectorAll('.laptop-network')
			.forEach(load);
	});
})();

