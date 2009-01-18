/**
 * @class Ext.ux.Scrabble.Board
 * @extends Ext.Component
 * A Ext.ux.Scrabble board
 */
Ext.ux.Scrabble.Board = function(config) {
  var config = config || {};
 
  Ext.applyIf(config, {
    id:     'scrabble_board',
    cls:    'x-scrabble-board',
    border: false
  });
 
  Ext.ux.Scrabble.Board.superclass.constructor.call(this, config);
};
Ext.extend(Ext.ux.Scrabble.Board, Ext.Panel, {
  
  /**
   * @property boardXPlaces
   * @type Number
   * The amount of places there is on the board horizontally
   */
  boardXPlaces: 15,
  
  /**
   * @property boardYPlaces
   * @type Number
   * The amount of places there is on the board vertically
   */
  boardYPlaces: 15,
  
  /**
   * Generates the neccesary place elements for the scrabble board
   */
  generateBoard: function() {
    // Loop through the Y axis first
    for (var a=1; a < this.boardYPlaces + 1; a++) {
      // Now loop through the X axis
      for (var b=1; b < this.boardXPlaces + 1; b++) {
        // Create a new scrabble place on the board
        this.add(new Ext.ux.Scrabble.Place({
          placeY:   a,
          placeX:   b
        }));
      };
    };
  },
  
  /**
   * Removes all places from the board
   */
  resetBoard: function() {
    // Remove all the items
    if (this.items) {
      this.items.each(function(item) { this.remove(item); }, this);
    };
    
    // Regenerate the items
    this.generateBoard();
    
    this.doLayout();
  },
  
  // private
  onRender: function(ct, position) {
    Ext.ux.Scrabble.Board.superclass.onRender.apply(this, arguments);
    
    this.generateBoard();
  }
  
});