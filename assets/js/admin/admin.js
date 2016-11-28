$(document).ready(function() {
  slack.start(admin.start);
  $('#one-bid-product').on('click', contestant.product);
  $('#reset-contestants').on('click', contestant.reset);
});

var admin = {
  start: function() {
    game.audience.members().done(function(response) {
      var members = response.channel.members;
      for(var i = 0; i < members.length; i++) {
        var member = slack.users[members[i]];
        audience.add(member);
      }
    });
  },

  event: function(event) {
    console.log('admin', event);

    if (event.subtype) {
      switch (event.subtype) {
        case 'channel_join':
          position.push(event.user);
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
      switch(message.type) {
        case 'contestant.bid':
          contestant.bid(message.user, message.message);
        break;
      }
    }
  }

};
