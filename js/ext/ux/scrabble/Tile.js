/**
 * @class Ext.ux.Scrabble.Tile
 * @extends Ext.Component
 * Description
 */
Ext.ux.Scrabble.Tile = function(config) {
  var config = config || {};
 
  Ext.applyIf(config, {
    cls: 'x-scrabble-tile'
  });
 
  Ext.ux.Scrabble.Tile.superclass.constructor.call(this, config);
};
Ext.extend(Ext.ux.Scrabble.Tile, Ext.Component, {
  
  /**
   * @property letter
   * @type String
   * The tiles letter
   */
  letter: null,
  
  /**
   * @property value
   * @type Number
   * The tiles value in points
   */
  value: null,
  
  /**
   * @property onBoard
   * @type Boolean
   * True if the tile has been placed on the board
   */
  onBoard: false,
  
  /**
   * @property droppedOnPlace
   * @type Ext.ux.Scrabble.Place
   * Link to the place the tile is placed on. Null if not placed
   */
  droppedOnPlace: null,
  
  /**
   * Adds drag functionality to the tile
   */
  initalizeDrag: function() {
    // Keep a reference to be used int the dragsource
    var tile = this;
    
    // Create the dragSource
    this.dragSource = new Ext.dd.DragSource(this.el, {
      ddGroup:     'tiles',
      
      getDragData: function() {
        return {
          tile: tile
        };
      },
      
      /**
       * Finds the offset of the click event relative to the card and sets this as the offset delta
       * for the ghost element so that the click point of the card is kept with the mouse pointer
       */
      autoOffset: function(x, y) {
        var tileXY = tile.getEl().getXY();
        
        var xDelta = x - tileXY[0] + 22;
        var yDelta = y - tileXY[1];
        
        this.setDelta(xDelta, yDelta);
      }
    });
  },
  
  /**
   * Changes the board status to the defined. Blank for toggle
   * @param {Boolean} onBoard True/false
   */
  changeBoardStatus: function(onBoard) {
    if(onBoard){
      // Check if it isn't already the same
      if(this.onBoard !== onBoard){
        this.onBoard = onBoard;
      }
      return;
    }
    
    // Toggle
    this.onBoard = (this.onBoard) ? this.onBoard = false : this.onBoard = true;
  },
  
  /**
   * Returns the tile to the scrabble rack
   */
  returnTile: function() {
    // Check if it isn't on the board (cannot return)
    if(!this.onBoard){
      return;
    }
    
    // Remove the tile from the scrabble board
    this.droppedOnPlace.remove(this);
    Scrabble.getScrabbleBoard().getPlacedTiles().remove(this);
    
    // Change dropped on status of the place
    this.droppedOnPlace.changeDroppedOnStatus(false);
    
    // Revert the dropped on place to null
    this.droppedOnPlace = null;
    
    // Change board status so we can drag again
    this.changeBoardStatus(false);
    
    // Add the tile back onto the rack and run doLayout
    Scrabble.getScrabbleRack().addTile({
      letter: this.letter,
      value:  this.value
    });
    Scrabble.getScrabbleRack().doLayout();
  },
  
  // private
  onRender: function(ct, position) {
    var ct = ct || Ext.getBody();
    
    Ext.ux.Scrabble.Tile.superclass.onRender.apply(this, arguments);
    
    // Create the place element
    this.el = ct.createChild({
      cls:  this.cls,
      html: '<span class="letter">' + this.letter + '</span><span class="value">' + this.value + '</span>'
    });
    
    // Make the tile unselectable
    this.el.unselectable();
    
    // Make it dbl clickable
    this.el.on('dblclick', this.returnTile, this);
    
    // Add drag functionality to the tile
    this.initalizeDrag();
  }
  
});