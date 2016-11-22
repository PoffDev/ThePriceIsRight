var game = game || {};

game.queue = {
	master: 'bobbarker',
	users: [],
	search: false,

	ready: function() {
		game.queue.search = true;

		var channel = slack.channels[slack.channel];
		slack.api.join(channel.name).done(function() {
			slack.api.post('JoinQueue', channel.id).done(function(response) {
				slack.identity = slack.users[response.message.user];
				game.queue.users.push(slack.identity.id);
			});
		});
	},

	clear: function() {
		game.queue.users = [];
	},

	event: function(event) {
		// discontinue if we're not matchmaking
		if (!game.queue.search) return;

		// discontinue if event didn't come from a user or is a reply
		if (!event.user || event.reply_to) return;

		var user = event.user;

		if (user.is_bot && user.name == game.queue.master) {
			var message = JSON.parse(event.text);

			// ignore the message if it doesn't pertain to me
			if (message.users.indexOf(slack.identity.id) < 0) return;

			switch(message.type) {
				case 'game.start':
					game.queue.complete();
				break;
			}

			return;
		} 
		
		// another user joining queue
		if (event.text == 'JoinQueue') {
			game.queue.users.push(user.id);

			if (game.queue.length >= 4) {
				// game has enough players in queue
				game.queue.complete();

				slack.send(JSON.stringify({
					type: 'game.start',
					users: game.queue.users
				}));
			}
		}
	},

	complete: function() {
		// game starting?

		game.queue.search = false;

		game.queue.clear();

		// note which users are in the game
		// message.users
	}
};