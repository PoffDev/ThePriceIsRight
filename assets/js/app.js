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
        $('#contestant-row-bid').submit(function(event) {
            event.stopPropagation();
            var amount = $('#bidAmount').val();
            game.contestant.bid(amount);
            var user = slack.users[slack.identity.id];
            contestant.bid(user, amount);
            return false;
        });
        $('#yellButton').on('click', function(event) {
            event.stopPropagation();
            var message = $('#yellMessage').val();
            game.audience.yell(message);
            var user = slack.users[slack.identity.id];
            audience.yell(user, message);
            return false;
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
                case 'audience.yell':
                    audience.yell(message.user, message.message)
                break;

                case 'contestant.turn':
                    contestant.turn(message.user);
                break;

                case 'contestant.bid':
                    contestant.bid(message.user, message.message);
                break;

                case 'contestant.add':
                    contestant.list.push(message.user);
                    contestant.add(message.user);
                break;

                case 'contestant.reset':
                    contestant.list = [];
                    contestant.reset(message.user);
                break;

                case 'contestant.won':
                    contestant.won(message.user);
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
    yell: function(user, message) {
        var view = $('#audience-view');
        var member = view.find('div[data-id="'+ user.id +'"]');
        var messagePop = member.find('div[data-pop="'+ user.id +'"]')
        if(messagePop.length !== 0) {
            messagePop.html(message);
            messagePop.removeClass('hide');
        } else {
            messagePop = $('<div class="message-pop" data-pop="'+ user.id +'">'+ message +'</div>');
            member.prepend(messagePop);
        }

        setTimeout(function() {
            messagePop.html('');
            messagePop.addClass('hide');
        }, 2000);


    }
};

/**
 * CONTESTANT DOM CONTROLS
 */

var contestant = {
	bid: function(user, amount) {
        $('#contestant-bids > li[data-id="'+ user.id +'"]').html(amount);
	},
	add: function(user) {
	    if (contestant.list.length <= 4) {
            var view = $('#contestant-list');
            var bids = $('#contestant-bids');
            var yell = $('#yell-action');

            var player = $('<li id="contestant'+ contestant.list.length +'" class="col-xs-2 col-sm-2 player contestant">');

            player.html('<img src="'+ user.profile.image_72 +'"> ');
            player.attr('data-id', user.id);
            view.append(player);
            bids.append('<li id="contestant'+ contestant.list.length +'-bid" data-id="'+ user.id +'" class="bid">0</div>');

            if (contestant.list.length === 4) {
                bids.removeClass('hide');
                if (user.id !== slack.identity.id) {
                    yell.removeClass('hide');
                }
            }
        }
	},
    turn: function(user) {
        if (user.id === slack.identity.id) {
            $('#contestant-action').removeClass('hide');
        } else {
            $('#contestant-action').addClass('hide');
        }
        for(var i = 1; i < contestant.list.length; i++) {
            if (user.id === contestant.list[i-1].id) {
                $('#contestant' + i).addClass('bounce');
            } else {
                $('#contestant' + i).removeClass('bounce');
            }
        }
    },
	// reset all contestants
	reset: function(users) {
		var view = $('#contestant-view');
		var players = view.find('.contestant');
		players.remove();
		$('.bid').remove();
		$('#product-display > div').empty();
		$('.modal-title').empty();
		$('.modal-body').empty();
        $('#contestant-action').addClass('hide');
        $('#contestant-bids').addClass('hide');
	},
    won: function(user){
	  for (var i=0;i < contestant.list.length;i++) {
	      var pos = i + 1;
	      $('#contestant' + pos).removeClass('bounce');
	      if (user.id === contestant.list[i].id) {
	          $('#contestant' + pos + '> img').addClass('winner');
	          $('#yell-action').addClass('hide');
          }
      }
    },
	product: function(product) {
		var view = $('#product-display > div');
		var modalTitle = $('.modal-title');
		var modalBody = $('.modal-body');
		var image = product.image.replace(/[<>]/g,"");
        var modal = {
            title: product.name,
            description: product.longDescription,
            image: '<img height="100%" width="100%" src='+ image +' data-toggle="modal" data-target="#productModal">'
        };
		view.append(modal.image);
		modalTitle.append(modal.title);
		modalBody.append(modal.image + '<br>' + modal.body);

	},
    list: []
};