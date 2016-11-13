var slack = slack || {};

slack.api = {
	code: function() {
		// grab code query param out of uri
		var query = $.qs(location.search) || {};
		return query.code;
	},

	authorize: function() {
		var scopes = [
			'channels:read',
			'channels:write',
			'chat:write:user',
			'users:read',
			'bot'
		];

		var params = {
			client_id: slack.client_id,
			scope: scopes.join(' '),
			redirect_uri: slack.redirect_uri,
			team: slack.team
		}

		var url = 'https://slack.com/oauth/authorize?' + $.param(params);

		window.location.href = url;
	},

	token: function(code) {
		if (!code) return;

		var url = 'https://slack.com/api/oauth.access';

		return slack.api.request(url, {
			client_id: slack.client_id,
			client_secret: slack.client_secret,
			code: code
		});
	},

	rtm: function(bot_access_token) {
		var url = 'https://slack.com/api/rtm.start';

		return slack.api.request(url, {
			token: bot_access_token,
			simple_latest: true,
			no_unreads: true
		});

	},

	post: function(message, channel) {
		if (!message) return;

		var url = 'https://slack.com/api/chat.postMessage';

		return slack.api.request(url, {
			token: slack.api.access_token,
			channel: channel,
			text: message,
			as_user: true
		});
	},

	join: function(channel) {
		if (!channel) return;

		var url = 'https://slack.com/api/channels.join';

		return slack.api.request(url, {
			token: slack.api.access_token,
			name: channel
		});
	},

	part: function(channel) {
		if (!channel) return;

		var url = 'https://slack.com/api/channels.leave';

		return slack.api.request(url, {
			token: slack.api.access_token,
			name: channel
		});
	},

	request: function(url, params) {
		var request = {
			url: url + '?' + $.param(params),
			method: 'GET'
		};

		return $.ajax(request);
	},

	login: function() {
		var code = slack.api.code();

		if (!code) {
			var access_token = localStorage.getItem('access_token');
			var bot_access_token = localStorage.getItem('bot_access_token');
			
			if (access_token && bot_access_token) {
				slack.api.access_token = access_token;

				return slack.api.rtm(bot_access_token);
			}

			return slack.api.authorize();
		}

		return slack.api.token(code).then(function(response) {
			slack.api.access_token = response.access_token;
			var bot_access_token = response.bot.bot_access_token;

			localStorage.setItem('access_token', slack.api.access_token);
			localStorage.setItem('bot_access_token', bot_access_token);

			return slack.api.rtm(bot_access_token);
		});
	}
}