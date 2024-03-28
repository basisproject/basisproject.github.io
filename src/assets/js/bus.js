const EventBus = function EventBus() {
	const event_store = {};

	function eachev(events, looper) {
		(Array.isArray(events) ? events : [events]).forEach(looper);
	}

	const on = (events, fn) => {
		eachev(events, (ev) => {
			event_store[ev] || (event_store[ev] = []);
			event_store[ev].push(fn);
		});
	};

	const once = (events, fn) => {
		eachev(events, (ev) => {
			const newfn = (...args) => {
				fn(...args);
				off(ev, newfn);
			};
			on(ev, newfn);
		});
	};

	const off = (events, fn) => {
		eachev(events, (ev) => {
			if(!event_store[ev]) return;
			if(!fn) {
				delete event_store[ev];
				return;
			}
			event_store[ev] = event_store[ev]
				.filter((fn_comp) => fn !== fn_comp);
		});
	};

	const emit = (event, ...args) => {
		const fnlist = event_store[event] || [];
		fnlist.forEach((fn) => {
			fn(...args);
		});
	};

	const destroy = () => {
		Object.keys(event_store).forEach((k) => delete event_store[k]);
	};

	return {
		on,
		once,
		off,
		emit,
		destroy,
	}
};

