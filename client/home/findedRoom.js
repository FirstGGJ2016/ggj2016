Template.findedRoom.rendered = function() {
  Room.rtc = new RTC(true, Room.getRoom()._id);
};

Template.findedRoom.events({
  'click #start': function() {
    Room.rtc.call();
  },
});
