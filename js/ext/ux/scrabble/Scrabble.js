Ext.ns('Ext.ux.Scrabble');

Ext.ux.Scrabble.Game = function() {
  // Scrabble Board
  this.scrabbleBoard = new Ext.ux.Scrabble.Board();
  
  // Reset Button
  this.resetBtn = new Ext.Button({
    text:    'Reset',
    handler: function(){
      this.scrabbleBoard.resetBoard();
    },
    scope:   this
  });
  
  // Create window for the game and show it on the document
  this.win = new Ext.Window({
    width:  599,
    title:  'Ext Scrabble',
    id:     'scrabble_game',
    cls:    'x-scrabble-game',
    items:  [this.scrabbleBoard],
    tbar:   [this.resetBtn]
  });
  
  // Create the rack
  this.rack = new Ext.ux.Scrabble.Rack();
};

Ext.ux.Scrabble.Game.prototype = {
  
  /**
   * Starts the game by opening the window
   */
  launch: function() {
    this.win.show();
  }
  
};