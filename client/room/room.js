Template.room.helpers({
  room: function() {
    return Rooms.findOne();
  },
});

function is(person) {
  return person ? 'person' : 'spirit';
}

function createRoom(id, person) {
  var room = {
        owner: id,
      };

  room.person = { user: person };
  room.spirit = { user: !person };

  room[is(person)].id = id;

  Rooms.insert(room);
}

function enterInARoom(id, person) {
  var query = {};

  query[is(!person) + '.user'] = true;

  var room = Rooms
    .findOne(query);

  if (room) {
    room[is(person)].user = true;
    room[is(person)].id = id;

    Rooms.update(room._id, room);
    return room;
  } else {
    createRoom(id, person);
  }
}

Template.room.events({
  'click #start': function() {
    var user = Meteor.user();
    if (user) {
      enterInARoom(Meteor.userId(), user.profile.isPerson);
    }
  },
});
