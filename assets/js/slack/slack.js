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
			slack.parse(response);
			slack.ready(); // figure out who the heck i am!
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

		switch(event.type) {
			case 'message':
				// connection.start();
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

		connection.send(msg);
	},

	ready: function() {
		var channel = slack.channels[slack.channel];
		slack.api.join(channel.name).done(function() {
			slack.api.post('JoinQueue').done(function(response) {
				slack.identity = slack.users[response.message.user];
			});
		});
	}
};