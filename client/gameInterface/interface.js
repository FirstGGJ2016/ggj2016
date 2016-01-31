var nextWord = true;

Template.gameInterface.created = function() {
  //TODO: call here the .play() method of the game.
  _room.play(Meteor.user().profile.isPerson ? 'person' : 'spirit');

  var input = $('#word');

  Room.onWord(function(word) {
    _room.spellWord(word, function() {
      input.value = '';
    });
  });
};

Template.gameInterface.helpers({
  isSpirit: function() {
    return !Meteor.user().profile.isPerson;
  },
});

Template.gameInterface.events({
  'keypress #word': function(e) {
    if (e.keyCode === 13 && nextWord) {
      var input = $('#word')[0];
      nextWord = false;
      Room.emitWord(input.value);
      input.value = 'spelling...';
      _room.spellWord(input.value, function() {
        input.value = '';
        nextWord = true;
      });
    }
  },
});
