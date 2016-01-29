Template.room.helper({
  room: function() {

    return Rooms.findOne({ users:  { $size: 1 } });
  },
});
