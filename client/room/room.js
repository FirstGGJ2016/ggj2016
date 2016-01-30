Template.room.helpers({
  room: function() {

    return Rooms.findOne({ users:  { $size: 1 } });
  },
});
