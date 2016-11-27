$(document).ready(function(){

	slack.start(app.start);

});

var app = {
	start: function() {
		game.audience.members().done(function(response) {
      var members = response.channel.members;
      for(var i = 0; i < members.length; i++) {
        var user = slack.users[members[i]];
        audience.add(user);
      }
    });
	},

	event: function(event) {
		console.log('app', event);

		if (event.subtype) {
      switch (event.subtype) {
        case 'channel_join':
          audience.add(event.user);
        break;

        case 'channel_leave':
          audience.remove(event.user);
        break;
      }

      return;
    }

    if (event.type == 'message') {
      var message = JSON.parse(event.text);
      if (message.user) {
      	message.user = slack.users[message.user];
      }

      switch(message.type) {
        case 'contestant.bid':
          contestant.bid(message.user, message.message);
        break;

        case 'contestant.add':
        	contestant.add(message.user);
        break;

        case 'contestant.reset':
        	contestant.reset(message.user);
        break;

        case 'contestant.product':
        	contestant.product(message.product);
        break;
      }
    }
	}
};

/**
 * AUDIENCE DOM EVENTS
 */

var audience = {
	add: function(user) {
		var view = $('#audience-view');
    var player = $('<div class="col-xs-1 col-sm-1 player audience">');

    player.html('<img src="'+ user.profile.image_48 +'">');
    player.attr('data-id', user.id);

    view.append(player);
	},

	remove: function(user) {
    var view = $('#audience-view');
    view.find('div[data-id="'+ user.id +'"]').remove();
  },
};

/**
 * CONTESTANT DOM CONTROLS
 */

var contestant = {
	bid: function(user, amount) {
		var view = $('#contestant-bids');
		var bid = $('<div class="bid">'+ amount +'</div>');
		view.append(bid);
	},

	add: function(user) {
		var view = $('#contestant-view');
		var player = $('<div class="col-xs-2 col-sm-2 player contestant">');

    player.html('<img src="'+ user.profile.image_72 +'"> ');
    player.attr('data-id', user.id);

    view.append(player);
	},

	// reset all contestants
	reset: function(users) {
		var view = $('#contestant-view');
		var players = view.find('.contestant');
		players.remove();
		$('.bid').remove();
		$('#product-display > div').empty();
	},

	product: function(product) {
		var view = $('#product-display > div');
		view.append(JSON.stringify(product));
	}
};