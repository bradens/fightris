// server code: heartbeat method
Meteor.methods({
  keepalive: function (player_id) {
  	console.log("running keepalive" + player_id);
    Players.update({_id: player_id},
                  {$set: {last_keepalive: (new Date()).getTime(),
                          idle: false}});
  }
});

// server code: clean up dead clients after 5 seconds
Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var remove_threshold = now - 20*1000;
  Players.find({last_keepalive: {$lt: remove_threshold}}).forEach(function (user) {
    console.log(user);
  });
  
  Players.remove({last_keepalive: {$lt: remove_threshold}});
}, 5*1000);


/*
Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var idle_threshold = now - 70*1000; // 70 sec
  var remove_threshold = now - 60*60*1000; // 1hr

  Players.update({$lt: {last_keepalive: idle_threshold}},
                 {$set: {idle: true}});

  // XXX need to deal with people coming back!
  // Players.remove({$lt: {last_keepalive: remove_threshold}});

}, 30*1000);*/