Ext.ns('ScrabbleApp');

Ext.onReady(function() {
  Scrabble = new Ext.ux.Scrabble.Game();
  
  Scrabble.launch();
});