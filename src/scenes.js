// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function () {
    // A 2D array to keep track of all occupied tiles
    this.occupied = new Array(Game.map_grid.width);
    for (var i = 0; i < Game.map_grid.width; i++) {
        this.occupied[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.occupied[i][y] = false;
        }
    }

    // Player character, placed at 5, 5 on our grid
    this.player = Crafty.e('PlayerCharacter').at(5, 5);
    this.occupied[this.player.at().x][this.player.at().y] = true;

    // Place a wall at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

            if (at_edge) {
                // Place a wall entity at the current tile
                Crafty.e('Wall').at(x, y)
                this.occupied[x][y] = true;
            }
        }
    }

    // Generate pellets on the map in random locations
    var max_pellets = 100;
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Math.random() < 0.09) {
                if (Crafty('Pellet').length < max_pellets && !this.occupied[x][y]) {
                    Crafty.e('Pellet').at(x, y);
                }
            }
        }
    }

    // Play a ringing sound to indicate the start of the journey
    Crafty.audio.play('ring');

    // Show the victory screen once all pellets are visisted
    this.show_victory = this.bind('PelletVisited', function () {
        if (!Crafty('Pellet').length) {
            Crafty.scene('Victory');
        }
    });
}, function () {
    // Remove our event binding from above so that we don't
    //  end up having multiple redundant event watchers after
    //  multiple restarts of the game
    this.unbind('PelletVisited', this.show_victory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function () {
    // Display some text in celebration of the victory
    Crafty.e('2D, DOM, Text')
        .text('All pellets visited!')
        .attr({
            x: 0,
            y: Game.height() / 2 - 24,
            w: Game.width()
        })
        .textFont($text_css);

    // Give'em a round of applause!
    Crafty.audio.play('applause');

    // After a short delay, watch for the player to press a key, then restart
    // the game when a key is pressed
    var delay = true;
    setTimeout(function () {
        delay = false;
    }, 5000);
    this.restart_game = function () {
        if (!delay) {
            Crafty.scene('Game');
        }
    };
    Crafty.bind('KeyDown', this.restart_game);
}, function () {
    // Remove our event binding from above so that we don't
    //  end up having multiple redundant event watchers after
    //  multiple restarts of the game
    this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function () {
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
        .text('Loading; please wait...')
        .attr({
            x: 0,
            y: Game.height() / 2 - 24,
            w: Game.width()
        })
        .textFont($text_css);

    // Load our sprite map image
    Crafty.load([
  'assets/16x16_forest_2.gif',
  'assets/pacman20.png',
  'assets/door_knock_3x.mp3',
  'assets/door_knock_3x.ogg',
  'assets/door_knock_3x.aac',
  'assets/board_room_applause.mp3',
  'assets/board_room_applause.ogg',
  'assets/board_room_applause.aac',
  'assets/candy_dish_lid.mp3',
  'assets/candy_dish_lid.ogg',
  'assets/candy_dish_lid.aac'
  ], function () {
        // Once the images are loaded...

        // Define the individual sprites in the image
        // Each one (spr_wall, etc.) becomes a component
        // These components' names are prefixed with "spr_"
        //  to remind us that they simply cause the entity
        //  to be drawn with a certain sprite
        Crafty.sprite(10, 'assets/pactiles.png', {
            spr_wall: [4, 0],
        });

        // Define the PC's sprite to be the first sprite in the third row of the
        //  animation sprite map
        Crafty.sprite(20, 'assets/pacman20.png', {
            spr_player: [12,1],
            spr_pellet: [14, 2],
        });

        // Define our sounds for later use
        Crafty.audio.add({
            knock: ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
            applause: ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
            ring: ['assets/candy_dish_lid.mp3', 'assets/candy_dish_lid.ogg', 'assets/candy_dish_lid.aac']
        });

        // Now that our sprites are ready to draw, start the game
        Crafty.scene('Game');
    });
});