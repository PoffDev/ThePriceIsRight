var slack = slack || {};

slack.queue = {
	master: 'bobbarker',
	users: [],
	ready: function() {
		slack.queue.clear();
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
		var user = event.user;

		if (user.is_bot && user.name == slack.queue.master) {
			var message = JSON.parse(event.text);

			// ignore the message if it doesn't pertain to me
			if (message.users.indexOf(slack.identity.id) < 0) return;

			switch(message.type) {
				case 'start':
					slack.queue.complete();
					// note which users are in the game
					// message.users
				break;

				case 'action':
					// check which user made the action
					// message.user
					// bid, etc.
				break;
			}

			return;
		} 
		
		// user joining queue
		if (event.text == 'JoinQueue') {
			slack.queue.push(user.id);

			if (slack.queue.length >= 4) {
				// game has enough players in queue
				slack.send(JSON.stringify({
					type: 'start',
					users: slack.queue.users
				}));
			}
		}
	},

	complete: function() {
		// game starting?
		slack.queue.clear();
	}
};