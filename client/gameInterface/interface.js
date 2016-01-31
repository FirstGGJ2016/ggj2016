Template.gameInterface.created = function() {
  //TODO: call here the .play() method of the game.
  _room.play(Meteor.user().profile.isPerson ? 'person' : 'spirit');
};
