var contestant = {
  list: [],
  bids: [],
  turn: 0,

  price: 0,
  products: [
    '887276158044', '879957008595', '711719504023', 
    '813646026088', '067638999601', '660685152731', 
    '818279015218', '888462347754', '889296126898', 
    '046677464479', '017817725460', '017817701709', 
    '753759131418'
  ],

  add: function(user) {
    game.contestant.add(user.id);
    contestant.list.push(user);

    var view = $('#contestant-view');
    var player = $('<div class="col-xs-12 col-sm-2 player contestant">');

    player.html('<img src="'+ user.profile.image_32+'"> '+ user.name);
    player.attr('data-id', user.id);

    view.append(player);

    if (contestant.list.length >= 4) {
      $('#one-bid-product').removeAttr('disabled');
    }
  },

  reset: function() {
    $('#one-bid-product').attr('disabled', 'disabled');
    $('#contestant-view .player').remove();
    $('#audience-view .player').removeClass('contestant');
    contestant.bids = [];
    contestant.list = [];
    contestant.price = 0;
    contestant.turn = 0;

    game.contestant.list([]);
  },

  product: function() {
    // array of products to search between
    var products = contestant.products;

    // randomize an item
    var randomProduct = products[Math.floor(Math.random() * products.length)];

    // params
    var params = {
      apiKey: 'OQlsKGXtUxeSNIUHxIORzpsG',
      format: 'json'
    };

    // pass the randomProduct item into the API
    var queryURL = 'https://api.bestbuy.com/v1/products(upc=' + randomProduct +')?'+ $.param(params);

    $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
      var product = response.products[0];
      var price = Math.ceil(product.regularPrice);

      contestant.price = price;

      game.contestant.product({
        name: product.name,
        price: price,
        description: product.longDescription,
        image: product.image
      });

      contestant.turn = 0;
      var id = contestant.list[contestant.turn].id;
      game.contestant.turn(id);
    });
  },

  bid: function(userId, amount) {
    var view = $('#contestant-view');
    amount = parseInt(amount);
    var player = view.find('div[data-id="'+ userId +'"]');
    player.append('<div class="contestant-bid">'+ amount +'</div>');

    contestant.bids.push({
      user: userId,
      amount: amount
    });

    // all contestants have bid
    if (contestant.bids.length >= 4) {
      var winner = {};

      for (var i = 0; i < contestant.bids.length; i++) {
        var bid = contestant.bids[i];

        // user bid over the price
        if (bid.amount > contestant.price) continue;

        // user guessed the exact amount!
        if (bid.amount == contestant.price) {
          winner = contestant.bids[i];
          break;
        }

        var diff1 = contestant.price - bid.amount;
        var diff2 = contestant.price - winner.amount;

        if (!winner.amount || diff1 < diff2) {
          winner = contestant.bids[i];
        }
      }

      game.contestant.won(winner.user, winner.bid);

      return;
    }

    // can't bid the same as another player
    var duplicate = false;
    for (var i = contestant.bids.length - 1; i >= 0; i--) {
      var bid = contestant.bids[i];
      if (userId !== bid.user && amount == bid.amount) {
        duplicate = true;
      }
    }

    if (duplicate) {
      contestant.bids.pop();
      var id = contestant.list[contestant.turn].id;
      game.contestant.turn(id, "Your bid cannot be the same amount as another player's");
    } else {
      // switch turns
      var id = contestant.list[++contestant.turn].id;
      game.contestant.turn(id);
    }

  },

  all: function() {
    game.contestant.list(contestant.list);
  }
};