// Defining global ignores for linter
/*global Crafty*/
/*global Game*/

Game = {
    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width: 21,
        height: 21,
        tile: {
            width: 20,
            height: 20
        }
    },

    // The total width of the game screen. Since our grid takes up the entire screen
    //  this is just the width of a tile times the width of the grid
    width: function () {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height: function () {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    // Initialize and start our game
    start: function () {
        // Start crafty and set a background color so that we can see it's working
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(0, 0, 0)');

        // Simply start the "Loading" scene to get things going
        Crafty.scene('Loading');
    }
};

$text_css = {
    'size': '24px',
    'family': 'Arial',
    'color': 'red',
    'text-align': 'center'
};