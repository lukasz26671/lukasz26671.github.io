class RedirectHandler {
	initialized = false;

	destinations = {
		main: () => {
			setTimeout("location.href='index.html';", 50);
		},
		calc: () => {
			setTimeout("location.href='/Kalkulator';", 50);
		},
		sources: () => {
			location.href='zrodla.html';
		},
		mods: () => {
			location.href='mcmod.html';
		},
		contact: () => {
			location.href='kontakt.html';		
		},
		channel: () => {
			window.open('https://www.youtube.com/channel/UCWTjTkGZCSf5-XEZKUMQxoQ?view_as=subscriber', '_blank');
		},
		discordBot: () => {
			location.href='/LukasBot';
		}
	}

	redirect(destination) {
		if(typeof destination != 'function') {
			console.error(`Redirect destination must be a function and implement a redirect method.`);
			return;
		}
		setTimeout(destination, 50);
	}

	constructor() {
		this.initialized = true;
	}
}