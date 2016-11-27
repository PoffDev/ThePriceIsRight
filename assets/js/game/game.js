var game = {
	chat: function(message) {
		slack.api.post(message, slack.channel);
	},

	audience: {
		// generally used when in audience
		yell: function(message) {
			game.send({
				type: 'audience.yell',
				user: slack.identity.id,
				message: message
			});
		},

		members: function() {
			return slack.api.channel.info(slack.channel);
		}
	},

	contestant: {
		// used when on contests row
		bid: function(amount) {
			game.send({
				type: 'contestant.bid',
				user: slack.identity.id,
				message: amount
			});
		},

		add: function(user) {
			game.send({
				type: 'contestant.add',
				user: user
			});
		},

		list: function(list) {
			game.send({
				type: 'contestant.reset',
				user: list
			})
		},

		won: function(user, bid) {
			game.send({
				type: 'contestant.won',
				user: user,
				message: bid
			});
		},

		turn: function(user, message) {
			game.send({
				type: 'contestant.turn',
				user: user,
				message: message || ''
			});
		},

		product: function(product) {
			game.send({
				type: 'contestant.product',
				product: product
			});
		}
	},

	wheel: {
		// http://priceisright.wikia.com/wiki/Showcase_Showdown
		values: [
			'0.05', '1.00', '0.15', '0.80', '0.35', 
			'0.60', '0.20', '0.40', '0.75', '0.55', 
			'0.95', '0.50', '0.85', '0.30', '0.65', 
			'0.10', '0.45', '0.70', '0.25', '0.90'
		],
		
		spin: function() {
			// spin the wheel!
			var length = game.wheel.values.length;
			var random = Math.floor(Math.random() * length);
			var result = values[random];

			game.send({
				type: 'wheel.spin',
				user: slack.identity.id,
				message: result
			});

			return result;
		}
	},

	showcase: {
		// passed on showcase if user1
		pass: function() {
			game.send({
				type: 'showcase.pass',
				user: slack.identity.id
			});
		},

		bid: function(amount) {
			// bid on showcase
			game.send({
				type: 'showcase.bid',
				user: slack.identity.id,
				message: amount
			});
		}
	},

	send: function(obj) {
		slack.send(JSON.stringify(obj));
	}
}