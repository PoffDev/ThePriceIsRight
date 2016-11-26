$(document).ready(function(){

	slack.start(app.start);

});

var app = {
	start: function() {
		game.audience.members().done(function(response) {
      var members = response.channel.members;
      var view = $('#audience-view');
      for(var i = 0; i < members.length; i++) {
        var user = slack.users[members[i]];

        var player = $('<div class="col-xs-12 col-sm-1 player audience">');

		    player.html('<img src="'+ user.profile.image_72+'">');
		    player.attr('data-id', user.id);

        view.append(player);
      }
    });
	},


	event: function(event) {
		console.log('app', event);
	}
}