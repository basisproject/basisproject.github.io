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
		num_boids: 100,
		loop_delay: Math.round(1000 / 60),
		boid_color: '#cc00ff',
		visual_range: 75,
		bounding_turn_factor: 0.8,
		bounding_margin: 200,
		centering_factor: 0.005,
		min_distance: 20,
		avoid_factor: 0.05,
		velocity_matching_factor: 0.05,
		speed_limit: 15,
		self_determination_probability: 0.005,
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
				// how many ticks left until this boid joins the other sheeple
				self_determination_ticks: 0,
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

	// Constrain a boid to within the window. If it gets too close to an edge,
	// nudge it back in and reverse its direction.
	function keep_within_bounds(boid) {
		if (boid.x < options.bounding_margin) {
			boid.dx += options.bounding_turn_factor;
		}
		if (boid.x > width - options.bounding_margin) {
			boid.dx -= options.bounding_turn_factor;
		}
		if (boid.y < options.bounding_margin) {
			boid.dy += options.bounding_turn_factor;
		}
		if (boid.y > height - options.bounding_margin) {
			boid.dy -= options.bounding_turn_factor;
		}
	}

	function self_determination(boid) {
		if(boid.self_determination_ticks > 0) {
			boid.self_determination_ticks--;
			return;
		}
		if(Math.random() >= options.self_determination_probability) {
			return;
		}
		boid.self_determination_ticks = options.self_determination_ticks;
		boid.self_determination_point = [
			Math.round(Math.random() * width),
			Math.round(Math.random() * height),
		];
	}

	// Find the center of mass of the other boids and adjust velocity slightly to
	// point towards the center of mass.
	function center_boid(boid) {
		let centerX = 0;
		let centerY = 0;
		if(boid.self_determination_ticks > 0) {
			centerX = boid.self_determination_point[0];
			centerY = boid.self_determination_point[1];
		}
		let numNeighbors = 0;

		for (let otherBoid of boids) {
			if(boid === otherBoid) continue;
			if (distance(boid, otherBoid) < options.visual_range) {
				centerX += otherBoid.x;
				centerY += otherBoid.y;
				numNeighbors += 1;
			}
		}

		if (numNeighbors) {
			centerX = centerX / numNeighbors;
			centerY = centerY / numNeighbors;

			boid.dx += (centerX - boid.x) * options.centering_factor;
			boid.dy += (centerY - boid.y) * options.centering_factor;
		}
	}

	// Move away from other boids that are too close to avoid colliding
	function avoid_others(boid) {
		let moveX = 0;
		let moveY = 0;
		for (let otherBoid of boids) {
			if(boid === otherBoid) continue;
			if (distance(boid, otherBoid) < options.min_distance) {
				moveX += boid.x - otherBoid.x;
				moveY += boid.y - otherBoid.y;
			}
		}

		boid.dx += moveX * options.avoid_factor;
		boid.dy += moveY * options.avoid_factor;
	}

	// Find the average velocity (speed and direction) of the other boids and
	// adjust velocity slightly to match.
	function match_velocity(boid) {
		let avgDX = 0;
		let avgDY = 0;
		let numNeighbors = 0;

		for (let otherBoid of boids) {
			if(boid === otherBoid) continue;
			if (distance(boid, otherBoid) < options.visual_range) {
				avgDX += otherBoid.dx;
				avgDY += otherBoid.dy;
				numNeighbors += 1;
			}
		}

		if (numNeighbors) {
			avgDX = avgDX / numNeighbors;
			avgDY = avgDY / numNeighbors;

			boid.dx += (avgDX - boid.dx) * options.velocity_match_factor;
			boid.dy += (avgDY - boid.dy) * options.velocity_match_factor;
		}
	}

	// Speed will naturally vary in flocking behavior, but real animals can't go
	// arbitrarily fast.
	function limit_speed(boid) {
		const speed = Math.sqrt((boid.dx * boid.dx) + (boid.dy * boid.dy));
		if (speed > options.speed_limit) {
			boid.dx = (boid.dx / speed) * options.speed_limit;
			boid.dy = (boid.dy / speed) * options.speed_limit;
		}
	}

	function draw_boid(ctx, boid) {
		switch(options.boid_shape) {
			case 'arrow':
				const angle = Math.atan2(boid.dy, boid.dx);
				ctx.translate(boid.x, boid.y);
				ctx.rotate(angle);
				ctx.translate(-boid.x, -boid.y);
				ctx.fillStyle = options.boid_color;
				ctx.beginPath();
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
				ctx.fillStyle = options.boid_color;
				ctx.moveTo(boid.x, boid.y);
				ctx.arc(boid.x, boid.y, 2.0, 0, 2 * Math.PI);
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
	function tick() {
		if(!active()) {
			setTimeout(() => { window.requestAnimationFrame(tick); }, 250);
			return;
		}
		// Update each boid
		for (let boid of boids) {
			// Update the velocities according to each rule
			self_determination(boid);
			center_boid(boid);
			avoid_others(boid);
			match_velocity(boid);
			limit_speed(boid);
			keep_within_bounds(boid);

			// Update the position based on the current velocity
			boid.x += boid.dx;
			boid.y += boid.dy;
		}

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

