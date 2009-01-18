/**
 * @class Ext.ux.Scrabble.Place
 * @extends Ext.Component
 * A place on a scrabble board where a piece can sit
 */
Ext.ux.Scrabble.Place = function(config) {
  var config = config || {};
  
  if(!config.placeX || !config.placeY) {
    return;
  }
  
  Ext.applyIf(config, {
    cls:  'x-scrabble-place',
    type: 'normal'
  });
  
  // Setup the places ID
  this.id = 'place-' + config.placeX + '-' + config.placeY;
  
  Ext.ux.Scrabble.Place.superclass.constructor.call(this, config);
  
  this.on('add', this.doLayout, this);
};
Ext.extend(Ext.ux.Scrabble.Place, Ext.Container, {
  
  /**
   * @property placeX
   * @type Number
   * The places X position
   */
  placeX: null,
  
  /**
   * @property placeY
   * @type Number
   * The places Y position
   */
  placeY: null,
  
  /**
   * @property type
   * @type String
   * The type of the place- normal, triple-word etc
   */
  type: null,
  
  /**
   * @property droppedOn
   * @type Boolean
   * True if the place has been dropped on
   */
  droppedOn: false,
  
  /**
   * @property tripleWordScorePositions
   * @type Array
   * Defines where each of the triple word score places are on the scrabble
   * board.
   * x/y
   */
  tripleWordScorePositions: [
    { x:1,  y:1 },
    { x:8,  y:1 },
    { x:15, y:1 },
    { x:1,  y:8 },
    { x:15, y:8 },
    { x:1,  y:15 },
    { x:8,  y:15 },
    { x:15, y:15 }
  ],
  
  /**
   * @property tripleWordScoreCls
   * @type String
   * The triple word score css class
   */
  tripleWordScoreCls: 'triple-word',
  
  /**
   * @property doubleWordScorePositions
   * @type Array
   * Defines where each of the double word score places are on the scrabble
   * board.
   * x/y
   */
  doubleWordScorePositions: [
    { x:2,  y:2  },
    { x:2,  y:14 },
    { x:3,  y:3  },
    { x:3,  y:13 },
    { x:4,  y:4  },
    { x:4,  y:12 },
    { x:5,  y:5  },
    { x:5,  y:11 },
    { x:11, y:5  },
    { x:11, y:11 },
    { x:12, y:4  },
    { x:12, y:12 },
    { x:13, y:3  },
    { x:13, y:13 },
    { x:14, y:2  },
    { x:14, y:14 }
  ],
  
  /**
   * @property doubleWordScoreCls
   * @type String
   * The double word score css class
   */
  doubleWordScoreCls: 'double-word',
  
  /**
   * @property tripleLetterScorePositions
   * @type Array
   * Defines where each of the triple letter score places are on the scrabble
   * board.
   * x/y
   */
  tripleLetterScorePositions: [
    { x:6,  y:2 },
    { x:10, y:2 },
    { x:2,  y:6 },
    { x:6,  y:6 },
    { x:10, y:6 },
    { x:14, y:6 },
    { x:2,  y:10 },
    { x:6,  y:10 },
    { x:10, y:10 },
    { x:14, y:10 },
    { x:6,  y:14 },
    { x:10, y:14 }
  ],
  
  /**
   * @property tripleLetterScoreCls
   * @type String
   * The triple letter score css class
   */
  tripleLetterScoreCls: 'triple-letter',
  
  /**
   * @property doubleLetterScorePositions
   * @type Array
   * Defines where each of the double letter score places are on the scrabble
   * board.
   * x/y
   */
  doubleLetterScorePositions: [
    { x:4,  y:1  },
    { x:12, y:1 },
    { x:7,  y:3 },
    { x:9,  y:3 },
    { x:1,  y:4 },
    { x:8,  y:4 },
    { x:15, y:4 },
    { x:3,  y:7 },
    { x:7,  y:7 },
    { x:9,  y:7 },
    { x:13, y:7 },
    { x:4,  y:8 },
    { x:12, y:8 },
    { x:3,  y:9 },
    { x:7,  y:9 },
    { x:9,  y:9 },
    { x:13, y:9 },
    { x:1,  y:12 },
    { x:8,  y:12 },
    { x:15, y:12 },
    { x:7,  y:13 },
    { x:9,  y:13 },
    { x:4,  y:15 },
    { x:12, y:15 }
  ],
  
  /**
   * @property doubleLetterScoreCls
   * @type String
   * The double letter score css class
   */
  doubleLetterScoreCls: 'double-letter',
  
  /**
   * @property centerPosition
   * @type Array
   * Defines where each of the center place is on the scrabble
   * board.
   * x/y
   */
  centerPosition: [
    { x:8,  y:8 }
  ],
  
  /**
   * @property centerCls
   * @type String
   * The center css class
   */
  centerCls: 'center',
  
  /**
   * Checks if the place is special and returns a css class if needed
   * @return {String} CSS Class
   */
  placeChecker: function() {
    // Loop through each of the triple word score positions first
    Ext.each(this.tripleWordScorePositions, function(element) {
      if(this.placeX == element.x){
        if(this.placeY == element.y){
          this.el.addClass(this.tripleWordScoreCls);
          this.type = this.tripleWordScoreCls;
          return;
        }
      }
    }, this);
    
    // Loop through each of the double word score positions first
    Ext.each(this.doubleWordScorePositions, function(element) {
      if(this.placeX == element.x){
        if(this.placeY == element.y){
          this.el.addClass(this.doubleWordScoreCls);
          this.type = this.doubleWordScoreCls;
          return;
        }
      }
    }, this);
    
    // Loop through each of the triple letter score positions first
    Ext.each(this.tripleLetterScorePositions, function(element) {
      if(this.placeX == element.x){
        if(this.placeY == element.y){
          this.el.addClass(this.tripleLetterScoreCls);
          this.type = this.tripleLetterScoreCls;
          return;
        }
      }
    }, this);
    
    // Loop through each of the double letter score positions first
    Ext.each(this.doubleLetterScorePositions, function(element) {
      if(this.placeX == element.x){
        if(this.placeY == element.y){
          this.el.addClass(this.doubleLetterScoreCls);
          this.type = this.doubleLetterScoreCls;
          return;
        }
      }
    }, this);
    
    // Loop through the center position
    Ext.each(this.centerPosition, function(element) {
      if(this.placeX == element.x){
        if(this.placeY == element.y){
          this.el.addClass(this.centerCls);
          this.type = this.centerCls;
          return;
        }
      }
    }, this);
  },
  
  /**
   * Adds dropable functionality to each place. This allows us to
   * drop a tile onto a piece.
   */
  initalizeDrop: function() {
    // Reference to use in dropTarget
    var place = this;
    
    this.dropZone = new Ext.dd.DropTarget(this.el, {
      ddGroup: 'tiles',
      notifyOver: function(source, e, data) {
        if (place.dropAllowed(data.tile)) {
          return Ext.dd.DropTarget.prototype.dropAllowed;
        } else {
          return Ext.dd.DropTarget.prototype.dropNotAllowed;
        };
      },
      
      notifyDrop: function(source, e, data) {
        if (place.dropAllowed(data.tile)) {
          return place.droppedTile(place, data.tile);
        } else {
          return false;
        }
      }
    });
  },
  
  /**
   * Checks if the tile can be dropped onto the tile
   * @param {Ext.ux.Scrabble.Tile} tile The tile which wants to be dropped
   */
  dropAllowed: function(tile) {
    if(this.droppedOn) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Change the dropped on status of the place. Leave blank to toggle
   * @param {Boolean} droppedOn The current dropped on status
   */
  changeDroppedOnStatus: function(droppedOn) {
    if(droppedOn){
      // Check if it isn't already the same
      if(this.droppedOn !== droppedOn){
        this.droppedOn = droppedOn;
      }
      return;
    }
    
    // Toggle
    this.droppedOn = (this.droppedOn) ? this.droppedOn = false : this.droppedOn = true;
  },
  
  /**
   * Function description
   * @param {Ext.ux.Scrabble.Place} place The place where the tile was dropped
   * @param {Ext.ux.Scrabble.Tile} tile The tile which was dropped
   */
  droppedTile: function(place, tile) {
    var newPlace = place;
    var oldPlace = tile.droppedOnPlace;
    
    // Check if it is already dropped on
    if (tile.droppedOnPlace) {
      // Remove the previous reference of the tile frm the placed tiles property
      // on the scrabble board
      Scrabble.getScrabbleBoard().getPlacedTiles().remove(tile);
      
      // Disable the place from being dropable
      oldPlace.changeDroppedOnStatus(false);
    };
    
    // Disable the place from being dropable
    newPlace.changeDroppedOnStatus(true);
    
    // Move the tile into the place
    newPlace.add(tile);
    
    // Change the onBoard status of the tile
    tile.changeBoardStatus(true);
    
    // Add a link from the tile to the place
    tile.droppedOnPlace = newPlace;
    
    // Add a reference of the tile into the placed tiles property
    // on the scrabble board
    Scrabble.getScrabbleBoard().getPlacedTiles().push(tile);
    
    return true;
  },
  
  // private
  onRender: function(ct, position) {
    var ct = ct || Ext.getBody();
    
    Ext.ux.Scrabble.Place.superclass.onRender.apply(this, arguments);
    
    // Create the place element
    this.el = ct.createChild({
      id:  this.id,
      cls: this.cls
    });
    
    // Check if it is special
    this.placeChecker();
    
    // Make it dropable
    this.initalizeDrop();
  }
  
});