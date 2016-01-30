Template.room.helpers({
  room: function() {
    return Rooms.findOne({ owner: Meteor.userId() });
  },
});

Template.room.events({
  'click #start': function() {
    Meteor.call('searchRoom', function(err, res) {
      if (res) {
        //TODO: start game
      } else if (err) {
        //TODO: something was wrong
      } else {
        //TODO: Logged in!
      }
    });
  },
});
