document.addEventListener('DOMContentLoaded', function () {
	const el_open = document.body.querySelector('#page-nav');
	const el_close = document.body.querySelector('#page-nav-close');
	const el_nav = document.body.querySelector('nav');
	el_open.addEventListener('click', function(e) {
		e.preventDefault();
		if(el_nav.classList.contains('translate-x-0')) {
			el_nav.classList.add('-translate-x-full');
			el_nav.classList.remove('translate-x-0');
		} else {
			el_nav.classList.remove('-translate-x-full');
			el_nav.classList.add('translate-x-0');
		}
	});
	el_close.addEventListener('click', function(e) {
		e.preventDefault();
		el_nav.classList.add('-translate-x-full');
		el_nav.classList.remove('translate-x-0');
	});
}, false);

