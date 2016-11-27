var audience = {
  add: function(user) {
    var view = $('#audience-view');
    var player = $('<div class="col-xs-1 col-sm-2 player audience">');

    player.html('<img src="'+ user.profile.image_32+'"> '+ user.name);
    player.attr('data-id', user.id);
    player.on('click', audience.click);

    view.append(player);
  },

  remove: function(user) {
    var view = $('#audience-view');
    view.find('div[data-id="'+ user.id +'"]').remove();
  },

  click: function() {
    var playerId = $(this).attr('data-id');
    var user = slack.users[playerId];

    $(this).addClass('contestant');

    contestant.add(user);
  }
}