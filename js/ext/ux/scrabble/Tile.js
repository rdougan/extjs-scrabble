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
      }
    });
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
    
    // Add drag functionality to the tile
    this.initalizeDrag();
  }
  
});