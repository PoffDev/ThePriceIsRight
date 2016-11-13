var oauth = {
	code: function() {
		// grab code query param out of uri
		var query = $.qs(location.search) || {};
		return query.code;
	},
	token: function(code) {
		if (!code) return;

		var url = 'https://slack.com/api/oauth.access';

		return this.request(url, {
			client_id: slack.client_id,
			client_secret: slack.client_secret,
			code: code
		});
	},
	rtm: function(access_token) {
		if (!access_token) return;

		var url = 'https://slack.com/api/rtm.start';

		return this.request(url, {
			token: access_token,
			simple_latest: true,
			no_unreads: true
		});

	},
	request: function(url, params) {
		var request = {
			url: url + '?' + $.param(params),
			method: 'GET'
		};

		return $.ajax(request);
	},
	authorize: function() {
		var scopes = [
			'channels:read',
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
	login: function() {
		var code = this.code();

		if (!code) return this.authorize();

		var self = this;

		return this.token(code).then(function(response) {
			var access_token = response.access_token;
			var bot_access_token = response.bot.bot_access_token;

			return self.rtm(bot_access_token);
		});
	}
}