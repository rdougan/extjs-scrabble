Ext.ns('ScrabbleApp');

Ext.onReady(function() {
  var scrabble = new Ext.ux.Scrabble.Game();
  
  scrabble.launch();
});