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

  return Rooms.insert(room);
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
    return true;
  } else {
    createRoom(id, person);
    return true;
  }
}

Meteor.methods({
  searchRoom: function() {
    if (this.userId) {
      var user = Meteor.users.findOne(this.userId);
      if (user) {
        return enterInARoom(this.userId, user.profile.isPerson);
      }
    }

    return false;
  },
});
