"use strict";

function Network() {
	const network_draw = (container, bus, nodes, links, options) => {
		options || (options = {});
		const render_delay = 1000 / (options.draw_fps || 60);
		const canvasopts = options.canvas || {};
		const width = options.width || 400;
		const height = options.height || 400;
		const depth = options.depth || 5;
		const optimal_dist = options.optimal_dist || false;
		const link_force = options.link_force || (1 / 400);
		const extra_classes = options.extra_classes || '';
		const trans = (opts) => {
			opts || (opts = {});
			return d3.transition()
				.duration(opts.duration || 500)
				.delay(opts.delay || 0)
				.ease(d3.easeCubic);
		};

		var d3_nodes = null;
		var d3_links = null;
		var linkdata = [];
		const node_idx = {};
		const nodelist_idx = {};

		const [canvas, ctx] = (function() {
			const canvas = d3.select(container)
				.append('canvas')
				.attr('class', extra_classes)
				.attr('width', width)
				.attr('height', height);
			const ctx = canvas.node().getContext('2d');
			return [canvas, ctx];
		})();

		const line_pos = (d, attr, now) => {
			const source = d.target;
			const target = d.source;
			if(!source[attr] || !target[attr]) return 0;
			if(now > d.end) return target[attr];
			const end = d.created + 500;
			const progress = Math.min(1, (now - d.created) / (end - d.created));
			return source[attr] + (progress * (target[attr] - source[attr]));
		};
		const draw_canvas = () => {
			ctx.clearRect(0, 0, width, height);

			const lines = linkdata;
			const now = new Date().getTime();
			ctx.strokeStyle = canvasopts.node_color_active;
			lines.forEach((line) => {
				const z_ratio = ((line.target.z + line.source.z) / 2) / depth;
				const opacity = (0.4 * z_ratio) + 0.0;
				ctx.lineWidth = Math.ceil(z_ratio * 4) + 1;
				ctx.globalAlpha = opacity;
				ctx.beginPath();
				ctx.moveTo(line.target.x, line.target.y);
				ctx.lineTo(line_pos(line, 'x', now), line_pos(line, 'y', now));
				ctx.stroke();
			});
			ctx.globalAlpha = 0.7;

			ctx.beginPath();
			ctx.fillStyle = canvasopts.node_color_inactive;
			ctx.strokeStyle = canvasopts.node_color_inactive;
			ctx.lineWidth = 1;
			const drawnode = (node) => {
				//const halfz = (node.z + 1) / 2;
				//ctx.rect(node.x - halfz, node.y - halfz, node.z + 1, node.z + 1);
				ctx.moveTo(node.x, node.y);
				ctx.arc(node.x, node.y, node.z + 2, 0, 2 * Math.PI);
			};
			nodes.forEach((node) => {
				if(nodelist_idx[node.id]) return;
				drawnode(node);
			});
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = canvasopts.node_color_active;
			ctx.strokeStyle = canvasopts.node_color_active;
			ctx.lineWidth = 1;
			nodes.forEach((node) => {
				if(!nodelist_idx[node.id]) return;
				drawnode(node);
			});
			ctx.fill();
		};

		setInterval(() => {
			if(options.log) console.log(`- draws/s: ${draws / ((new Date().getTime() - draws_start) / 1000)}`);
			if(draws_start + 5000 < new Date().getTime()) {
				draws = 0;
				draws_start = new Date().getTime();
			}
		}, 2000);

		var tick_timeout = null;
		let draws = 0;
		let draws_start = new Date().getTime();
		const ticked = () => {
			if(tick_timeout) return;
			if(force.alpha() < 0.001) return;
			tick_timeout = setTimeout(() => {
				tick_timeout = null;
				window.requestAnimationFrame(draw_canvas);
				draws++;
			}, render_delay);
		};

		const linkforce = d3.forceLink()
			.id((d) => d.id)
			.strength((d) => link_force)
			.distance(() => optimal_dist ? optimal_dist() : 100);
		const nodeforce = d3.forceManyBody()
			.strength((d) => -5)
			.distanceMax(() => optimal_dist ? optimal_dist() : 100);
		const force = d3.forceSimulation()
			//.alphaDecay(1 - Math.pow(0.001, 1 / 600))
			.velocityDecay(0.3)
			.on('tick', ticked)
			.force('link', linkforce)
			.force('charge', nodeforce);
		
		bus.on('force-reset', () => {
			force.alpha(0.2);
			force.restart();
		});

		const update_nodes = () => {
			const nodedata = nodes;
			force.stop();
			force.nodes(nodedata);
			bus.emit('force-reset');
		};

		const update_links = () => {
			linkdata = links.all();
			links.nodelist().forEach((id) => nodelist_idx[id] = true);
			force.stop();
			force.force('link').links(linkdata);
			bus.emit('force-reset');
		};

		bus.on('node-add', (node) => {
			node_idx[node.id] = node;
			update_nodes();
		});
		bus.on('link-add', (_link) => {
			update_links();
		});
	};

	let process_queue = null;
	let paused = false;
	const init_scene = (container, options) => {
		// --- config ---
		const node_density = options.node_density || 0.0001;
		const max_links = options.max_links || 4;
		const link_force = options.link_force || (1 / 400);
		const extra_classes = options.extra_classes || '';
		const queue_speed = options.queue_speed || {
			min: 100,
			div: 10,
			pow: 1,
			base: 500,
			jitter: 1000,
		};
		const padding = options.padding || 0;
		// --------------

		const bus = new EventBus();
		const nodes = [];
		const links = (function Links() {
			const links = [];
			const dedupe = (arr) => {
				const map = {};
				return arr.filter((x) => {
					if(map[x]) return false;
					map[x] = true;
					return true;
				});
			};
			const nodelist = () => {
				const tmp = [];
				links.forEach((link) => {
					tmp.push(link.source);
					tmp.push(link.target);
				});
				return dedupe(tmp);
			};
			const id = (link) => `${link[0].id}->${link[1].id}`;
			const exists = (id1, id2) => {
				return links.find((link) => {
					return (link.source == id1 && link.target == id2) ||
						(link.source == id2 && link.target == id1);
				});
			};
			const linked_to = (id) => {
				const linked_to = [];
				links.forEach((link) => {
					if(link.source == id) linked_to.push(link.target);
					if(link.target == id) linked_to.push(link.source);
				});
				return dedupe(linked_to);
			};
			return {
				add: (link) => {
					const [from, to] = link;
					links.push({
						id: id(link),
						source: from.id,
						target: to.id,
						created: new Date().getTime(),
					});
				},
				all: () => JSON.parse(JSON.stringify(links)),
				raw: () => links,
				exists,
				linked_to,
				nodelist,
			};
		})();

		const get_width = () => container.offsetWidth;
		const get_height = () => container.offsetHeight;
		const width = get_width();
		const height = get_height();
		const depth = options.depth || 5;
		const num_nodes = Math.floor(width * height * node_density);
		const optimal_dist = () => Math.pow((width * height) / nodes.length, 0.5) * 1.2;
		const optimal_link_dist = () => optimal_dist() * 2.2;

		// start the draw
		network_draw(container, bus, nodes, links, {
			...options,
			width,
			height,
			optimal_dist: () => optimal_dist(),
			extra_classes,
			link_force,
		});

		const distq = (node1, node2) => Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2);
		const nearest = (center, nodes, exclude, options) => {
			options || (options = {});
			const max_dist = (options.max_dist && Math.pow(options.max_dist, 2)) || false;
			var nearest_nodes = [];
			var last_dist = 99999999999999;
			nodes.forEach((node) => {
				if(node.id == center.id) return;
				if(exclude.indexOf(node.id) >= 0) return;
				const dist_cur = distq(center, node);
				if(nearest_nodes.length == 0 || dist_cur < last_dist) {
					nearest_nodes.unshift({node, dist: dist_cur});
					last_dist = dist_cur;
				}
			});
			return nearest_nodes
				.filter((entry) => {
					if(max_dist && max_dist < entry.dist) {
						return false;
					}
					return true;
				})
				.map((entry) => entry.node);
		};

		const add_node = (node) => {
			nodes.push(node);
			bus.emit('node-add', node);
		};
		const add_link = (node1, node2) => {
			const link = [node1, node2];
			links.add(link);
			bus.emit('link-add', link);
		};
		const queue = [];
		let ticks = 0;
		process_queue = () => {
			if(paused) return;
			const delay = queue_speed.min + ((queue_speed.div / Math.pow(queue.length + 1, queue_speed.pow)) * (queue_speed.base + (Math.random() * queue_speed.jitter)));
			let timeout = setTimeout(process_queue, delay);

			const next = queue.splice(Math.floor(Math.random() * queue.length), 1)[0];
			if(!next) return;
			ticks++;
			const [node, to_node] = next;
			// if the node is too far away, don't pair
			if(Math.pow(optimal_link_dist(), 2) < (Math.pow(node.x - to_node.x, 2) + Math.pow(node.y - to_node.y, 2))) {
				return;
			}
			if(links.exists(node.id, to_node.id)) {
				clearTimeout(timeout);
				process_queue();
				return;
			}
			add_link(node, to_node);
			calculate_links(to_node);
		};
		const calculate_links = (node, options) => {
			if(!options) options = {};
			const override_max = options.override_max;
			const linked_to = links.linked_to(node.id);
			// grab more nodes than we know we should connect with, we're going to
			// verify distance when the queue processes
			const nearest_nodes = nearest(node, nodes, linked_to, {max_dist: optimal_link_dist() * 2})
			nearest_nodes.forEach((to_node) => {
				const to_num_links = links.linked_to(to_node.id).length;
				if(!override_max && to_num_links >= max_links) {
					return;
				}
				queue.push([node, to_node]);
			});
		};
		setInterval(() => {
			if(options.log) console.log(`- nodes: ${nodes.length}, links: ${links.raw().length}, queue: ${queue.length}`);
		}, 2000);

		for(var i = 0; i < num_nodes; i++) {
			add_node({
				id: i + 1,
				x: padding + ((width - (padding * 2)) * Math.random()),
				y: padding + ((height - (padding * 2)) * Math.random()),
				z: depth * Math.random(),
			});
		}
		const node_center = nearest({x: width / 2, y: height / 2}, nodes, [])[0];
		const node_nw = nearest({x: 0, y: 0}, nodes, [])[0];
		const node_ne = nearest({x: width, y: 0}, nodes, [])[0];
		const node_se = nearest({x: width, y: height}, nodes, [])[0];
		const node_sw = nearest({x: 0, y: height}, nodes, [])[0];
		calculate_links(node_center);
		calculate_links(node_nw);
		calculate_links(node_ne);
		calculate_links(node_se);
		calculate_links(node_sw);
	};
	return {
		init: init_scene,
		run: () => {
			paused = false;
			process_queue();
		},
		pause: () => {
			paused = true;
		},
	};
}

