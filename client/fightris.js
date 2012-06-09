var init, invitePlayer, player, selectPlayer;

player = function() {
	return Players.findOne(Session.get('player_id'));
};

Meteor.startup(function() {
	var player_id;
	player_id = Players.insert({
	  name: "",
	  idle: false
	});
	Session.set('player_id', player_id);

	Meteor.setInterval(function() {
    if (Meteor.status().connected)
      Meteor.call('keepalive', Session.get('player_id'));
  	}, 20*1000);
});

Template.invite.events = {
	'click a.cancelBtn': function() {
	  return $('.invite').hide();
	}
};

Template.player.events = {
	'click a.playerListItem': function() {
	  return selectPlayer(this);
	}
};

Template.lobby.events = {
	'keyup input.formInput': function() {
	  var name;
	  name = $('.lobby input.formInput').val().trim();
	  return Players.update(Session.get('player_id'), {
			$set: {
			  name: name
			}
		});
	},
	'click input.formInput': function(elem) {
	  if ($(this).val() === "Enter your name...") return $(this).val("");
	}
};

Template.playerList.players = function() {
	return Players.find({
	  _id: {
		$ne: Session.get('player_id')
	  },
	  name: {
		$ne: ""
	  }
	}, {
	  sort: {
		name: 1
	  }
	});
};

init = function() {
	return $(window).load(function(elem) {
	  $('.formInput').click(function(elem) {
		if ($(this).val() === "Enter your name...") return $(this).val("");
	  });
	  return $('.formButton').click(invitePlayer);
	});
};

invitePlayer = function() {
	if (!(Session.get('selectedPlayer'))) return;
	$(".invite span").html("Waiting for " + ($('.selectedPlayer').html()));
	return $(".invite").show();
};

selectPlayer = function(elem) {
	$('.selectedPlayer').removeClass('selectedPlayer');
	$('.selected').removeClass('selected');
	Session.set("selectedPlayer", elem._id);
	$('#' + elem._id).addClass("selectedPlayer");
	return $('#' + elem._id).parent().addClass("selected");
};
init();

