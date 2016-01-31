function roomId() {
  var id = Meteor.userId();
  room = Rooms.findOne({ $or: [{ owner: id }, { 'person.id':id }, { 'spirit.id':id }] });

  if (room) {
    return room._id;
  } else {
    return false;
  }
}

function isCaller() {
  var id = Meteor.userId(),
      room = Rooms.findOne({ $or: [{ owner: id }, { 'person.id':id }, { 'spirit.id':id }] });

  if (!room) throw new Error('We need a room!');

  if (room.person.user && room.spirit.user) {
    return false;
  } else {
    return true;
  }
}

Template.search.events({
  'click #start': function() {
    Meteor.call('searchRoom', function(err, res) {
      if (res) {
        Session.set('homeTemp', 'searching');
      }
    });
  },
});

// Template.search.events({
//   'click #start': function() {
//     Meteor.call('searchRoom', function(err, res) {
//       if (res) {
//         //TODO: start game
//         var caller = isCaller();
//         rtc = new RTC(caller, roomId());
//       } else if (err) {
//         //TODO: something was wrong
//       } else {
//         //TODO: Logged in!
//       }
//     });
//   },
// });
