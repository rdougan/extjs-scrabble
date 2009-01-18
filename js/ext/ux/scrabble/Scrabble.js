Ext.ns('Ext.ux.Scrabble');

Ext.ux.Scrabble.Game = function() {
  // Scrabble Board
  this.scrabbleBoard = new Ext.ux.Scrabble.Board();
  
  // Scrabble Rack
  this.scrabbleRack = new Ext.ux.Scrabble.Rack();
  
  // Reset Button
  this.resetBtn = new Ext.Button({
    text:    'Reset',
    handler: function(){
      this.getScrabbleBoard().resetBoard();
    },
    scope:   this
  });
  
  // Create window for the game and show it on the document
  this.win = new Ext.Window({
    width:  599,
    title:  'Ext Scrabble',
    id:     'scrabble_game',
    cls:    'x-scrabble-game',
    items:  [this.getScrabbleBoard()],
    tbar:   [this.resetBtn],
    bbar:   [this.getScrabbleRack()]
  });
};

Ext.ux.Scrabble.Game.prototype = {
  
  /**
   * Starts the game by opening the window
   */
  launch: function() {
    this.win.show();
  },
  
  /**
   * Returns instance of the scrabble board
   * @return {Ext.ux.Scrabble.Board} Instance of the scrabble board
   */
  getScrabbleBoard: function() {
    return this.scrabbleBoard;
  },
  
  /**
   * Returns instance of the scrabble rack
   * @return {Ext.ux.Scrabble.Rack} Instance of the scrabble rack
   */
  getScrabbleRack: function() {
    return this.scrabbleRack;
  }
  
};