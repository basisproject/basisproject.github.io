"use strict";

/// Adapted and modified from https://github.com/beneater/boids
///
/// Thank you, Ben Eater!

const Boids = (function() {
	// Size of canvas. These get updated to fill the whole browser.
	let width = 150;
	let height = 150;
	let container = null;
	const options = {
		// required
		container: null,
		num_boids: 100,
		// ms between each iteration.
		loop_delay: Math.round(1000 / 60),
		// how much affect time has on movements and forces
		time_multiplier: 0.06,
		// either a numeric valu, or 'auto' to match the height of container
		height: 'auto',
		// honestly, who knows wtf this does. it was originally supposed to make
		// the canvas bigger, but ended up just shrinking everything in it,
		// which looks good so i kept it.
		dimension_multiplier: 2.0,
		// obvis
		boid_color: '#cc00ff',
		// the color our boid is when it's self-determined (ie, decides to do
		// its own thing and not follow other boids). yes, even boids can be
		// anarchists
		boid_determined_color: '#0000cc',
		// "circle" or "arrow"
		boid_shape: 'circle',

		// how far can a boid see? (px)
		visual_range: 40,
		// by what factor does a boid try to mimic its compadres?
		velocity_match_factor: 0.03,
		// how big in px are the margins of the play area? once a margin is
		// crossed, a boid starts to turn back the other way
		bounding_margin: 300,
		// how much a boid turns once it goes out of bounds
		bounding_turn_factor: 0.08,
		// how much a boid tries to center itself amongst its compatriots
		centering_factor: 0.002,
		// how much distance boids try to keep between each other
		min_distance: 15,
		// how hard boids try to avoid each other once min_distance is crossed
		avoid_factor: 0.15,
		// how fast boids are allowed to go
		speed_limit: 4,
		// the probability a boid will self-determine
		self_determination_probability: 0.0001,
		// how long a boid stays determined
		self_determination_duration: 2000,
		// how much more likely other boids will follow a self-determined boid
		self_determination_charisma: 5,
	};

	const boids = [];
	function init_boids() {
		for (var i = 0; i < options.num_boids; i++) {
			boids.push({
				id: i,
				x: Math.random() * width,
				y: Math.random() * height,
				dx: Math.random() * 10 - 5,
				dy: Math.random() * 10 - 5,
				// how many ms left until this boid joins the other sheeple
				self_determination_duration: 0,
				// the point this boid has decided it will go toward, come hell
				// or highwater
				self_determination_point: null,
			});
		}
	}

	function distance(boid1, boid2) {
		return Math.sqrt(
			(boid1.x - boid2.x) * (boid1.x - boid2.x) +
				(boid1.y - boid2.y) * (boid1.y - boid2.y),
		);
	}

	// Called initially and whenever the window resizes to update the canvas
	// size and width/height variables.
	function resize() {
		const canvas = container;
		width = container.parentNode.offsetWidth;
		height = options.height == 'auto' ?
			container.parentNode.offsetHeight :
			options.height;
		if(options.dimension_multiplier) {
			width *= options.dimension_multiplier;
			height *= options.dimension_multiplier;
		}
		canvas.width = width;
		canvas.height = height;
	}

	function self_determination(boid, duration) {
		if(boid.self_determination_duration > 0) {
			boid.self_determination_duration -= duration;
			return;
		}
		boid.self_determination_duration = 0;
		if(Math.random() >= options.self_determination_probability) {
			return;
		}
		boid.self_determination_duration = options.self_determination_duration;
		boid.self_determination_point = [
			Math.round(Math.random() * width),
			Math.round(Math.random() * height),
		];
	}

	// Find the center of mass of the other boids and adjust velocity slightly to
	// point towards the center of mass.
	const center_boid = {
		iter: (state, boid, boid2, dist) => {
			if(!state.neighbors) {
				state.neighbors = 0;
				state.centerX = 0;
				state.centerY = 0;
			}
			if(boid.self_determination_duration > 0) {
				state.neighbors += 1;
				state.centerX += boid.self_determination_point[0];
				state.centerY += boid.self_determination_point[1];
			}
			if (dist < options.visual_range) {
				state.neighbors += 1;
				state.centerX += boid2.x;
				state.centerY += boid2.y;
			}
		},
		apply: (state, boid, time_index) => {
			if(state.neighbors == 0) return;
			const centerX = state.centerX / state.neighbors;
			const centerY = state.centerY / state.neighbors;
			boid.dx += (centerX - boid.x) * options.centering_factor * time_index;
			boid.dy += (centerY - boid.y) * options.centering_factor * time_index;
		},
	};

	// Move away from other boids that are too close to avoid colliding
	const avoid_others = {
		iter: (state, boid, boid2, dist) => {
			if(!state.move_x && !state.move_y) {
				state.move_x = 0;
				state.move_y = 0;
			}
			if(dist < options.min_distance) {
				state.move_x += boid.x - boid2.x;
				state.move_y += boid.y - boid2.y;
			}
		},
		apply: (state, boid, time_index) => {
			boid.dx += state.move_x * options.avoid_factor * time_index;
			boid.dy += state.move_y * options.avoid_factor * time_index;
		},
	};

	// Find the average velocity (speed and direction) of the other boids and
	// adjust velocity slightly to match.
	const match_velocity = {
		iter: (state, boid, boid2, dist) => {
			if(!state.neighbors) {
				state.neighbors = 0;
				state.avg_dx = 0;
				state.avg_dy = 0;
			}
			if(dist < options.visual_range) {
				let factor = 1;
				let dx = boid2.dx;
				let dy = boid2.dy;
				if(boid2.self_determination_duration > 0) {
					factor = options.self_determination_charisma;
					dx *= options.self_determination_charisma;
					dy *= options.self_determination_charisma;
				}
				state.neighbors += factor;
				state.avg_dx += dx;
				state.avg_dy += dy;
			}
		},
		apply: (state, boid, time_index) => {
			if(state.neighbors == 0) return;
			const avg_dx = state.avg_dx / state.neighbors;
			const avg_dy = state.avg_dy / state.neighbors;
			boid.dx += (avg_dx - boid.dx) * options.velocity_match_factor * time_index;
			boid.dy += (avg_dy - boid.dy) * options.velocity_match_factor * time_index;
		},
	};

	// Speed will naturally vary in flocking behavior, but real animals can't go
	// arbitrarily fast.
	function limit_speed(boid, _time_index) {
		const speed = Math.sqrt((boid.dx * boid.dx) + (boid.dy * boid.dy));
		if (speed > options.speed_limit) {
			boid.dx = (boid.dx / speed) * options.speed_limit;
			boid.dy = (boid.dy / speed) * options.speed_limit;
		}
	}

	// Constrain a boid to within the window. If it gets too close to an edge,
	// nudge it back in and reverse its direction.
	function keep_within_bounds(boid, time_index) {
		if (boid.x < options.bounding_margin) {
			boid.dx += (options.bounding_turn_factor * time_index);
		}
		if (boid.x > width - options.bounding_margin) {
			boid.dx -= (options.bounding_turn_factor * time_index);
		}
		if (boid.y < options.bounding_margin) {
			boid.dy += (options.bounding_turn_factor * time_index);
		}
		if (boid.y > height - options.bounding_margin) {
			boid.dy -= (options.bounding_turn_factor * time_index);
		}
	}

	function draw_boid(ctx, boid) {
		switch(options.boid_shape) {
			case 'arrow':
				const angle = Math.atan2(boid.dy, boid.dx);
				ctx.translate(boid.x, boid.y);
				ctx.rotate(angle);
				ctx.translate(-boid.x, -boid.y);
				ctx.beginPath();
				ctx.fillStyle = boid.self_determination_duration > 0 ?
					options.boid_determined_color :
					options.boid_color;
				ctx.moveTo(boid.x, boid.y);
				ctx.lineTo(boid.x - 8, boid.y + 2);
				ctx.lineTo(boid.x - 8, boid.y - 2);
				ctx.lineTo(boid.x, boid.y);
				ctx.fill();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				break;
			case 'circle':
			default:
				ctx.beginPath();
				ctx.fillStyle = boid.self_determination_duration > 0 ?
					options.boid_determined_color :
					options.boid_color;
				ctx.moveTo(boid.x, boid.y);
				ctx.arc(boid.x, boid.y, 2.4, 0, 2 * Math.PI);
				ctx.fill();
				break;
		}
	}

	function draw() {
		// Clear the canvas and redraw all the boids in their current positions
		const ctx = container.getContext("2d");
		ctx.clearRect(0, 0, width, height);
		boids.forEach((boid) => draw_boid(ctx, boid));
	}

	// Main animation loop
	let last_run = new Date().getTime();
	function tick() {
		if(!active()) {
			last_run = new Date().getTime();
			setTimeout(() => { window.requestAnimationFrame(tick); }, 250);
			return;
		}
		const now = new Date().getTime();
		const duration = now - last_run;
		last_run = now;
		const time_index = options.time_multiplier ? options.time_multiplier * duration : 1;
		boids.forEach((boid) => {
			self_determination(boid, duration);

			const center_state = {};
			const avoid_state = {};
			const match_velocity_state = {};
			const bounding_state = {};
			boids.forEach((boid2) => {
				if(boid === boid2) return;
				const dist = distance(boid, boid2);
				center_boid.iter(center_state, boid, boid2, dist);
				avoid_others.iter(avoid_state, boid, boid2, dist);
				match_velocity.iter(match_velocity_state, boid, boid2, dist);
			});
			center_boid.apply(center_state, boid, time_index);
			avoid_others.apply(avoid_state, boid, time_index);
			match_velocity.apply(match_velocity_state, boid, time_index);
			keep_within_bounds(boid, time_index);
			limit_speed(boid, time_index);

			// Update the position based on the current velocity
			boid.x += boid.dx * time_index;
			boid.y += boid.dy * time_index;
		});

		draw();

		setTimeout(() => {
			// Schedule the next frame
			window.requestAnimationFrame(tick);
		}, options.loop_delay);
	}

	const init = (opts) => {
		opts || (opts = {});
		if(!opts.container) throw new Error('boids: missing opts.container');
		container = opts.container;
		Object.assign(options, opts);
		// Make sure the canvas always fills the whole window
		window.addEventListener("resize", resize, false);
		// Randomly distribute the boids to start
		resize();
		init_boids();
		if(opts.skip_start) return;
		start();
	};

	const start = () => {
		// Schedule the main animation loop
		window.requestAnimationFrame(tick);
	};

	const active = () => {
		return !(container.getAttribute('data-animation-disabled') == 'true');
	};

	return { init, start };
})();

