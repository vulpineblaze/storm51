if(NT === undefined) {
  var NT = {};
}

NT.Messages = {
    movesText:  "",
    movesTextPrefix:   "Moves: ",

    levelText:  "",
    levelTextPrefix :   "Level: ",

    ticksText:  "",
    ticksTextPrefix :   "Till Base: ",

    timeText:  "",
    timeTextPrefix :   "Time: ",
    savedTime: 0,

    introTextMsg:   "Click to play!!",
    winTextMsg:   "You Won!",
    loseTextMsg:   "You Lost!",
    restartTextMsg:   "Click to restart!",

    savedTimeFormatted: function(){
        return NT.Messages.msToTime(NT.Messages.savedTime);
    },

    msToTime: function(s) {

  // Pad to 2 or 3 digits, default is 2
      function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
      }

      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      // return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
      return pad(mins) + ':' + pad(secs) + '.' + pad(ms);
    }
};

