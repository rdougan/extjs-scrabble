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