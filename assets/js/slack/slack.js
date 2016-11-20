var slack = {
	client_id: '',
    client_secret: '',
	redirect_uri: 'http://localhost/game.html',

	team: 'T279KBDGU',
	channel: 'C32GH70T1',
	messageId: 0,
	users: {},
	channels: {},
	identity: {},

	start: function() {
		if (!this.client_id) return;

		slack.api.login().done(function(response) {
			// update channels
			var channels = response.channels;
			for (var i = channels.length - 1; i >= 0; i--) {
				slack.channels[channels[i].id] = channels[i];
			};

			// update users
			var users = response.users;
			for (var i = users.length - 1; i >= 0; i--) {
				slack.users[users[i].id] = users[i];
			};

			slack.queue.ready(); // figure out who the heck i am!
			slack.connection.start(response.url, slack.event);
		});
	},

	event: function(event) {
		// ignore events that come from me
		if (event.user === slack.identity.id) return;

		if (event.user) {
			event.user = slack.users[event.user];
		}

		if (event.channel) {
			event.channel = slack.channels[event.channel];
		}

		console.log('slack', event);

		switch(event.type) {
			case 'message':
				slack.queue.event(event);
				game.event(event);
			break;
		}
	},

	send: function(message) {
		var msg = JSON.stringify({
			id: ++slack.messageId,
			type: 'message',
			channel: slack.channel,
			text: message
		});

		slack.connection.send(msg);
	}
};