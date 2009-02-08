Ext.ns('ScrabbleApp');

Ext.onReady(function() {
  Scrabble = new Ext.ux.Scrabble.Game();
  
  Scrabble.launch();
});

Ext.ns('Ext.ux.Scrabble');

Ext.ux.Scrabble.Game = function() {
  // Scrabble Board
  this.scrabbleBoard = new Ext.ux.Scrabble.Board();
  
  // Scrabble Rack
  this.scrabbleRack = new Ext.ux.Scrabble.Rack();
  
  // Create window for the game and show it on the document
  this.win = new Ext.Window({
    width:       599,
    title:       'Ext Scrabble',
    id:          'scrabble_game',
    cls:         'x-scrabble-game',
    closable:    false,
    constrain:   true,
    resizable:   false,
    buttonAlign: 'center',
    items:       [this.getScrabbleBoard()],
    bbar:        [this.getScrabbleRack()],
    tbar:        [
      {
        text:    'New Game',
        handler: function(){
          Ext.Msg.show({
            title:   'Are you sure?',
            msg:     'Are you sure you want to start a new game?',
            buttons: Ext.Msg.YESNO,
            icon:    Ext.MessageBox.QUESTION,
            fn: function(btn){
              if(btn == 'yes') {
                this.getScrabbleBoard().fireEvent('newgame', this);
              }
            },
            scope: this
          });
        },
        scope: this
      },
      '-',
      {
        text:    'Help',
        handler: this.showHelp,
        scope:   this
      },
      '->'
    ],
    buttons:     [
      {
        text: 'Submit Word',
        handler: function() {
          this.getScrabbleBoard().fireEvent('submitword');
        },
        scope:   this
      },{
        text:    'Undo',
        handler: function() {
          this.getScrabbleBoard().fireEvent('undo');
        },
        scope:   this
      }
    ]
  });
};

Ext.ux.Scrabble.Game.prototype = {
  
  /**
   * @property helpWindow
   * @type Ext.Window
   * Help window
   */
  helpWindow: null,
  
  /**
   * @property started
   * @type Boolean
   * Know if the game has started or not
   */
  started: false,
  
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
  },
  
  /**
   * Opens a window showing help for scrabble
   */
  showHelp: function() {
    if (!this.helpWindow) {
      this.helpWindow = new Ext.Window({
        constrain: true,
        title:     'Help',
        width:     400,
        height:    300,
        layout:    'fit',
        items: [
          {
            border: false,
            cls:    'x-scrabble-help',
            html:   new Ext.Template(
              '<h1>Instructions</h1>',
              '<ul>',
                '<li>- Drag tiles onto the board</li>',
                '<li>- Double click tiles to undo single tile move</li>',
              '</ul>',
              
              '<h1>Scoring</h1>',
              '<p>Blah blah</p>'
            )
          }
        ],
        closeAction: 'hide'
      });
    };
    
    this.helpWindow.show();
  },
  
};

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

/**
 * @class Ext.ux.Scrabble.Rack
 * @extends Ext.Component
 * Description
 */
Ext.ux.Scrabble.Rack = function(config) {
  var config = config || {};
  
  Ext.applyIf(config, {
    id:     'scrabble_rack',
    cls:    'x-scrabble-rack',
    border: false
  });
 
 Ext.ux.Scrabble.Rack.superclass.constructor.call(this, config);
 
 // Add listeners
 this.on('add', this.doLayout, this);
};
Ext.extend(Ext.ux.Scrabble.Rack, Ext.Panel, {
  
  /**
   * @property tiles
   * @type Array
   * Array of tiles for scrabble along with their letters and values
   */
  tiles: [
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'a', value:1 },
    { letter:'b', value:3 },
    { letter:'b', value:3 },
    { letter:'c', value:3 },
    { letter:'c', value:3 },
    { letter:'d', value:2 },
    { letter:'d', value:2 },
    { letter:'d', value:2 },
    { letter:'d', value:2 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'e', value:1 },
    { letter:'f', value:4 },
    { letter:'f', value:4 },
    { letter:'g', value:2 },
    { letter:'g', value:2 },
    { letter:'g', value:2 },
    { letter:'h', value:4 },
    { letter:'h', value:4 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'i', value:1 },
    { letter:'j', value:8 },
    { letter:'k', value:5 },
    { letter:'l', value:1 },
    { letter:'l', value:1 },
    { letter:'l', value:1 },
    { letter:'l', value:1 },
    { letter:'m', value:3 },
    { letter:'m', value:3 },
    { letter:'n', value:1 },
    { letter:'n', value:1 },
    { letter:'n', value:1 },
    { letter:'n', value:1 },
    { letter:'n', value:1 },
    { letter:'n', value:1 },
    { letter:'o', value:1 },
    { letter:'o', value:1 },
    { letter:'o', value:1 },
    { letter:'o', value:1 },
    { letter:'o', value:1 },
    { letter:'o', value:1 },
    { letter:'o', value:1 },
    { letter:'o', value:1 },
    { letter:'p', value:3 },
    { letter:'p', value:3 },
    { letter:'q', value:10 },
    { letter:'r', value:1 },
    { letter:'r', value:1 },
    { letter:'r', value:1 },
    { letter:'r', value:1 },
    { letter:'r', value:1 },
    { letter:'r', value:1 },
    { letter:'s', value:1 },
    { letter:'s', value:1 },
    { letter:'s', value:1 },
    { letter:'s', value:1 },
    { letter:'t', value:1 },
    { letter:'t', value:1 },
    { letter:'t', value:1 },
    { letter:'t', value:1 },
    { letter:'t', value:1 },
    { letter:'t', value:1 },
    { letter:'u', value:1 },
    { letter:'u', value:1 },
    { letter:'u', value:1 },
    { letter:'u', value:1 },
    { letter:'v', value:4 },
    { letter:'v', value:4 },
    { letter:'w', value:4 },
    { letter:'w', value:4 },
    { letter:'x', value:8 },
    { letter:'y', value:4 },
    { letter:'y', value:4 },
    { letter:'z', value:10 },
    { letter:'&nbsp;',  value:0 },
    { letter:'&nbsp;',  value:0 }
  ],
  
  /**
   * @property usedTiles
   * @type Array
   * An array of used tile numbers (0-99)
   */
  usedTiles: [],
  
  /**
   * Randomizes the tiles and deals 7 to the user
   */
  dealTiles: function() {
    // Remove all the items
    if (this.items) {
      this.items.each(function(item) { this.remove(item); }, this);
    };
    
    // Loop through each of the 7 tiles
    for (var i=0; i < 7; i++) {
      // Generate a random number
      var randomNumber = Math.floor(Math.random() * 99);
      
      // Get the tile
      var tile = this.tiles[randomNumber];
      
      // Check if the tile has been used, and if it
      // has make i-1 and re-run the for loop
      if(this.usedTiles.indexOf(tile) != -1) {
        i = i-1;
      }else{
        // it isn't a duplicate, so lets add it to the usedTiles
        // array
        this.usedTiles[randomNumber] = tile;
        
        // Now add it
        this.addTile(tile);
      }
    };
  },
  
  /**
   * Creates a new instance of a Ext.ux.Scrabble.Tile and adds it to the rack
   * @param {Object} config Tile config with letter and value properties
   */
  addTile: function(config) {
    var tile = new Ext.ux.Scrabble.Tile(config);
    
    // Add the tile to the rack
    this.add(tile);
  },
  
  // private
  onRender: function(ct, position) {
    Ext.ux.Scrabble.Rack.superclass.onRender.apply(this, arguments);
    
    // Deal the tiles onto the scrabble rack
    this.dealTiles();
  }
  
});

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

/**
 * @class Ext.ux.Scrabble.Word
 * @extends Ext.Component
 * Description
 */
Ext.ux.Scrabble.Word = function(config) {
  var config = config || {};
  
  Ext.applyIf(config, {
    
  });
 
  Ext.ux.Scrabble.Word.superclass.constructor.call(this, config);
};
Ext.extend(Ext.ux.Scrabble.Word, Ext.Component, {
  
});

