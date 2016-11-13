var slack = {
	client_secret: 'YOUR CLIENT SECRET',
	redirect_uri: 'http://localhost/game.html',

	team: 'YOUR TEAM ID',
	channel: 'YOUR CHANNEL ID',
	messageId: 0,
	users: {},
	channels: {},

	start: function() {
		if (!this.client_id) return;

		oauth.login().done(function(response) {
			slack.parse(response);
			connection.start(response.url, slack.event);
		});
	},

	parse: function(response) {
		// update channels
		var channels = response.channels;
		for (var i = channels.length - 1; i >= 0; i--) {
			this.channels[channels[i].id] = channels[i];
		};

		// update users
		var users = response.users;
		for (var i = users.length - 1; i >= 0; i--) {
			this.users[users[i].id] = users[i];
		};
	},

	event: function(event) {
		if (event.user) {
			event.user = slack.users[event.user];
		}

		if (event.channel) {
			event.channel = slack.channels[event.channel];
		}

		console.log(event);
	},

	send: function(message) {
		var msg = JSON.stringify({
			id: ++slack.messageId,
			type: 'message',
			channel: slack.channel,
			text: message
		});

		connection.send(msg);
	}
};

slack.start();