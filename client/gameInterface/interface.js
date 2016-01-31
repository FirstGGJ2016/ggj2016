var nextWord = true;

Template.gameInterface.created = function() {
  //TODO: call here the .play() method of the game.
  _room.play(Meteor.user().profile.isPerson ? 'person' : 'spirit');

  Room.onWord(function(word) {
    _room.spellWord(word, function() {

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
      nextWord = false;
      var input = $('#word')[0],
          val = input.value.trim().toLowerCase();
      Room.emitWord(input.value);
      input.value = 'spelling...';
      _room.spellWord(input.value, function() {
        input.value = '';
        nextWord = true;
      });
    }
  },
});
