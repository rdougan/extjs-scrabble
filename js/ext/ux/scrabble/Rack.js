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
 
 // Call the doLayout method when adding tiles to the rack
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