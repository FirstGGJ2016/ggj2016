Template.searching.rendered = function() {
  Tracker.autorun(function(c) {
    if (Room.isCompleted(Room.getRoom()._id)) {
      c.stop();
      Session.set('homeTemp', Meteor.user().profile.isPerson ? 'findedRoom' : 'waitPerson');
    }
  });
};
