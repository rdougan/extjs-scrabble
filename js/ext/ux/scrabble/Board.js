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
  
  // Add custom events
  this.addEvents(
    /**
     * @event newgame
     * Fires when the use wants to start a new game
     */
    'newgame',
    
    /**
     * @event submitword
     * Fires when the user submits a word
     */
    'submitword',
    
    /**
     * @event undo
     * Fires when the user wants to undo their moves
     */
    'undo'
  );
  
  // Add event listeners
  this.on('newgame',    this.resetBoard, this, true);
  this.on('submitword', this.submitWord, this);
  this.on('undo',       this.resetBoard, this);
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
   * @property placedTiles
   * @type Array
   * Array of placed Ext.ux.Scrabble.Tile's
   */
  placedTiles: [],
  
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
   * @param {Boolean} dealTiles Do you want to deal tiles too (full game reset)
   *                            Defaults to false
   */
  resetBoard: function(dealTiles) {
    // Remove all the items
    if (this.items) {
      this.items.each(function(item) {
        // Check if the place has a tile inside it
        if(item.droppedOn){          
          // Return the tile
          var tile = item.items.items[0].returnTile();
        }
        this.remove(item);
      }, this);
    };
    
    // Regenerate the items
    this.generateBoard();
    
    // doLayout to position everything
    this.doLayout();
    
    // Deal tiles if full reset
    if(dealTiles) {
      // Show different tiles
      Scrabble.getScrabbleRack().dealTiles();
    }
  },
  
  /**
   * Submits a word and checks if it is valid
   */
  submitWord: function() {
    var placedTiles = this.getPlacedTiles();
    
    // Check if any tiles have been placed
    if(placedTiles.length < 2) {
      // No tiles on the board- return a message to the user
      return Ext.Msg.show({
        title:   'Ext Scrabble',
        msg:     'You have placed only 1 or no tiles on the board.',
        buttons: Ext.Msg.OK
      })
    };
    
    // Variables containing the first X + Y
    var firstX = null;
    var firstY = null;
    
    var rowOnX = false;
    var rowOnY = false;
    
    // Loop through X
    Ext.each(placedTiles, function(tile) {
      var placeX = tile.droppedOnPlace.placeY;
      
      // Check if this is the first tile
      if(!firstX) {
        firstX = placeX;
        return;
      };
      
      // Now check if the tile has the same X as first tile
      if(firstX != placeX) {
        rowOnX = false;
        return;
      };
      
      // Seems like X is correct
      rowOnX = true;
    }, this);
    
    // Loop through Y
    Ext.each(placedTiles, function(tile) {
      var placeY = tile.droppedOnPlace.placeX;
      
      // Check if this is the first tile
      if(!firstY) {
        firstY = placeY;
        return;
      };
      
      // Now check if the tile has the same Y as first tile
      if(firstY != placeY) {
        rowOnY = false;
        return;
      };
      
      // Seems like Y is correct
      rowOnY = true;
    }, this);
    
    // No rows so error out
    if(!(rowOnX || rowOnY)){
      return Ext.Msg.show({
        title:   'Ext Scrabble',
        msg:     'You have not placed any tiles in a row. They must run horizontally or vertically.',
        buttons: Ext.Msg.OK
      })
    }
    
    // Loop through the tiles and get the letters
    var letters = [];
    Ext.each(placedTiles, function(tile) {
      // check which direction we are looking for
      if(rowOnX){ var dir = tile.droppedOnPlace.placeX; }
      if(rowOnY){ var dir = tile.droppedOnPlace.placeY; }
      
      letters[dir] = tile.letter;
    }, this);
    
    var word = letters.join('');
    
    if(this.validateWord(word)) {
      console.log('VALID! ' + word);
    } else {
      console.log('fail');
    }
  },
  
  /**
   * Uses the dictionary to check if a word is valid or not
   * @param {String} word The word which needs to be validated
   * @return {Boolean} True/valid to validate status
   */
  validateWord: function(word) {
    if(Dictionary.indexOf(word) == -1){
      return false;
    } else {
      return true;
    }
  },
  
  /**
   * Checks if there are any placed tiles on the board and returns
   * them to the user
   * @return {Array} Returns an array of tiles which have been
   *                 placed on the board
   */
  getPlacedTiles: function() {
    return this.placedTiles;
  },
  
  // private
  onRender: function(ct, position) {
    Ext.ux.Scrabble.Board.superclass.onRender.apply(this, arguments);
    
    this.generateBoard();
  }
  
});