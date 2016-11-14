var slack = slack || {};

slack.queue = {
	master: 'bobbarker',
	users: [],
	search: false,

	ready: function() {
		slack.queue.search = true;

		var channel = slack.channels[slack.channel];
		slack.api.join(channel.name).done(function() {
			slack.api.post('JoinQueue', channel.id).done(function(response) {
				slack.identity = slack.users[response.message.user];
				slack.queue.users.push(slack.identity.id);
			});
		});
	},

	clear: function() {
		slack.queue.users = [];
	},

	event: function(event) {
		// discontinue if we're not matchmaking
		if (!slack.queue.search) return;

		var user = event.user;

		if (user.is_bot && user.name == slack.queue.master) {
			var message = JSON.parse(event.text);

			// ignore the message if it doesn't pertain to me
			if (message.users.indexOf(slack.identity.id) < 0) return;

			switch(message.type) {
				case 'start':
					slack.queue.complete();
				break;
			}

			return;
		} 
		
		// another user joining queue
		if (event.text == 'JoinQueue') {
			slack.queue.push(user.id);

			if (slack.queue.length >= 4) {
				// game has enough players in queue
				slack.queue.complete();

				slack.send(JSON.stringify({
					type: 'start',
					users: slack.queue.users
				}));
			}
		}
	},

	complete: function() {
		// game starting?

		slack.queue.search = false;

		slack.queue.clear();

		// note which users are in the game
		// message.users
	}
};