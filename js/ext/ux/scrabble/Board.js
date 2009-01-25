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
    'undo',
    
    /**
     * @event checkaxis
     * Fires when the board needs to be checked for a valid word
     * on the X or Y axis
     */
    'checkaxis'
  );
  
  // Add event listeners
  this.on('newgame',    this.resetBoard, this, true);
  this.on('submitword', this.submitWord, this);
  this.on('undo',       this.resetBoard, this);
  this.on('checkaxis',  this.checkAxis,  this);
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
  
  rowOnX: false,
  rowOnY: false,
  
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
   * Method which submits a word so it can be checked if it
   * is valid, and if it is valid how many points it is worth.
   */
  submitWord: function() {
    var placedTiles = this.getPlacedTiles();
    
    // We need to check if the user has only placed 1 tile on the board, as
    // that move is not valid. If it is not valid, return a message to the
    // user using the status bar.
    // TODO: Check if the tile is on the center
    if(placedTiles.length < 2) {
      return Ext.Msg.show({
        title:   'Ext Scrabble',
        msg:     'You have placed only 1 or no tiles on the board.',
        buttons: Ext.Msg.OK
      })
    };
    
    // We must now fire off an event which will check if there are
    // any valid words on the X and Y axis
    if(!this.fireEvent('checkaxis', this)) {
      return Ext.Msg.show({
        title:   'Ext Scrabble',
        msg:     'You have not placed any tiles in a row. Your word must run horizontally or vertically across the scrabble board.',
        buttons: Ext.Msg.OK
      });
    };
    
    // Loop through the tiles and get the letters
    var letters = [];
    Ext.each(placedTiles, function(tile) {
      // check which direction we are looking for
      if(this.rowOnX) { var dir = tile.droppedOnPlace.placeX; }
      if(this.rowOnY) { var dir = tile.droppedOnPlace.placeY; }
      
      letters[dir] = tile.letter;
    }, this);
    
    var word = letters.join('');
    
    // Now we have the word, we need to validate it
    // TODO validate
    return Ext.Msg.show({
      title:   'Ext Scrabble',
      msg:     '<strong>' + word + '</strong> is a valid word!',
      buttons: Ext.Msg.OK
    });
  },
  
  /**
   * Validates the X and Y axis of the board to check if there is
   * any valid word placements on the board.
   * @param {Array} placedTiles An array of the placed tiles which
  *                             are currently on the board.
   */
  checkAxis: function() {
    var placedTiles = this.getPlacedTiles();
    
    // Variables containing the first X + Y
    var firstX = null;
    var firstY = null;
    
    var isX = true;
    var isY = true;
    
    // Firslty, lets loop through each of the tiles and check if
    // there is a word on the X axis. There must be more than 1
    // tile or it will error out.
    Ext.each(placedTiles, function(tile) {
      var placeX = tile.droppedOnPlace.placeY;
    
      // If the first X tile has not been set, set it and return so we
      // can continue the loop.
      if(!firstX) {
        firstX = placeX;
        return;
      };
    
      // If the nth tile is not on the same X axis as the first tile, error
      // out as it is not a valid word. return false means the ext.each will
      // stop looping.
      if(firstX != placeX) {
        isX = false;
        return false;
      };
    
      // We have gotten this far so the word must be on the X axis.
      this.rowOnX = true;
      isX = true;
    }, this);
    
    // // Now we must loop through the Y axis to see if there is a word there.
    Ext.each(placedTiles, function(tile) {
      var placeY = tile.droppedOnPlace.placeX;
      
      // If the first Y axis tile hasn't been set, set it and return.
      if(!firstY) {
        firstY = placeY;
        return;
      };
      
      // If the nth tile is not on the same axis as the first tile, it must
      // not be a valid word. return false means the ext.each will stop
      // looping.
      if(firstY != placeY) {
        isY = false;
        return false;
      };
      
      // Looks like the word is on the Y axis
      this.rowOnY = true;
      isY = true;
    }, this);
    
    // // Check if the word is on the X or Y axis and return true/false
    if (isX || isY) {
      return true;
    } else {
      return false;
    };
  },
  
  /**
   * Uses the dictionary to check if a word is valid or not
   * @param {String} word The word which needs to be validated
   * @return {Boolean} True/valid to validate status
   * TODO: Change this to use some kind of API so we don't have to load a large
   *       file full of words.
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
  
  /**
   * Gets the status bar for the scrabble window and returns it
   * @return {String} Status Bar
   */
  getStatusBar: function() {
    return Ext.getCmp('scrabble-statusbar');
  },
  
  // private
  onRender: function(ct, position) {
    Ext.ux.Scrabble.Board.superclass.onRender.apply(this, arguments);
    
    this.generateBoard();
  }
  
});