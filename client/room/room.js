Template.room.helpers({
  room: function() {
    return Rooms.findOne({ owner: Meteor.userId() });
  },

  temp: function () {
    return Session.get('homeTemp') || 'search';
  }
});
