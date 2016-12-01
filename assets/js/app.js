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
        $('#bidButton').on('click', function() {
            var amount = $('#bidAmount').val();
            game.contestant.bid(amount);
            for (var i=1;i <= contestant.list.length;i++) {
                if(contestant.list[i-1].id === slack.identity.id) {
                    $('#contestant'+ i +'-bid').html(amount);
                }
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
    }
};

/**
 * CONTESTANT DOM CONTROLS
 */

var contestant = {
	bid: function(user, amount) {
        // var amt,
        // inputVal = $("#bidAmount").val();
        // if (amount) {
	     //    amt = amount;
        // } else {
	     //    amt = inputVal;
        // }
		// var view = $('#contestant-bids');
		// var bid = $('<li class="bid">'+ amt +'</li>');
		// view.append(bid);
	},
	add: function(user) {
	    if (contestant.list.length <= 4) {
            var view = $('#contestant-list');
            var bids = $('#contestant-bids');

            var player = $('<li id="contestant'+ contestant.list.length +'" class="col-xs-2 col-sm-2 player contestant">');

            player.html('<img src="'+ user.profile.image_72 +'"> ');
            player.attr('data-id', user.id);
            view.append(player);
            bids.append('<li id="contestant'+ contestant.list.length +'-bid" class="bid">0</div>');

            if (contestant.list[3].id === user.id) {
                bids.removeClass('hide');
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
	},
    won: function(user){
	  for (var i=0;i < contestant.list.length;i++) {
	      var pos = i + 1;
	      $('#contestant' + pos).removeClass('bounce');
	      if (user.id === contestant.list[i].id) {
	          $('#contestant' + pos + '> img').addClass('winner');
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