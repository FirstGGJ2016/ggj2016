Room = {};

Room.getRoom = function() {
  var id = Meteor.userId();

  return Rooms.findOne({ $or: [{ owner: id }, { 'person.id':id }, { 'spirit.id':id }] });
};

Room.isCaller = function(room) {
  if (!room) throw new Error('We need a room!');

  if (room.person.user && room.spirit.user) {
    return false;
  } else {
    return true;
  }
};

Room.isCompleted = function(id) {
  return Rooms.findOne({ _id:id, 'person.user': true, 'spirit.user': true });
};
