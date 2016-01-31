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

Room.emitMessage = function(id, channel, message) {
  Streamy.broadcast(id + channel, {
    user: Meteor.userId(),
    message: message,
  });
};

Room.subscribeChanel = function(id, channel, cb) {
  Streamy.on(id + channel, function(data) {
    if (data.user !== Meteor.userId()) {
      cb(data);
    }
  });
};

Room.emitWord = function(word) {
  var room = this.getRoom();

  this.emitMessage(room._id, 'word', word);
};

Room.onWord = function(cb) {
  var room = this.getRoom();

  this.subscribeChanel(room._id, 'word', function(res) {
    cb(res.message);
  });
};
