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
    this.player = Crafty.e('PlayerCharacter').at(1, 1);
    this.occupied[this.player.at().x][this.player.at().y] = true;
    
    
    // I saw that character maps are often used as a way to place images on a grid
    var map = [];
    map.push("LwwwwwwwwwswwwwwwwwwX");
    map.push("DpppppppppDpppppppppD");
    map.push("DplwwwwwrpbplwwwwwrpD");
    map.push("DpppppppppppppppppppD");
    map.push("DplwrptpkmgmeptplwrpD");
    map.push("DpppppDpppvpppDpppppD");
    map.push("YwwwXpowrpaplwupLwwwF");
    map.push("nnnnDpDpppppppDpDnnnn");
    map.push("wwwwQpbpLrnlXpbpYwwww");
    map.push("nnnnnpppDnnnDpppnnnnn");
    map.push("wwwwXptpYwwwFptpLwwww");
    map.push("nnnnDpDpppppppDpDnnnn");
    map.push("LwwwQpbplwswrpbpYwwwX");
    map.push("DpppppppppDpppppppppD");
    map.push("DpkgmmmmepbpkmmmmgepD");
    map.push("DppvpppppppppppppvppD");
    map.push("orpaplwwwwswwwwrpaplu");
    map.push("DpppppppppDpppppppppD");
    map.push("DplwwwwwrpbplwwwwwrpD");
    map.push("DpppppppppppppppppppD");
    map.push("YwwwwwwwwwwwwwwwwwwwF");
    
    for(var y = 0; y <map.length; y++){
        for(var x = 0; x <map[y].length; x++){
            
            var c = map[y].charAt(x);
            
            if(c == "L"){
                Crafty.e('tlc').at(x,y)
                this.occupied[x][y] = true;
            } 
            else if (c == "w"){
                Crafty.e('hrzntl').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "X") {
                Crafty.e('trc').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "D") {
                Crafty.e('vrtcl').at(x, y)
                this.occupied[x][y] = true;
                
            }
            else if (c == "p") {
                Crafty.e('Pellet').at(x, y);
            }
            else if (c == "s"){
                Crafty.e('splitdown').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "b"){
                Crafty.e('bottom').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "r"){
                Crafty.e('rcp').at(x, y)
                this.occupied[x][y] = true;
                
            }
            else if (c == "l"){
                Crafty.e('lcp').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "g"){
                Crafty.e('splitdgreen').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "m"){
                Crafty.e('hgreen').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "k"){
                Crafty.e('lcgreen').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "e"){
                Crafty.e('rcgreen').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "v"){
                Crafty.e('vgreen').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "a"){
                Crafty.e('bgreen').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "Y"){
                Crafty.e('blc').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "Q"){
                Crafty.e('brc').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "t"){
                Crafty.e('top').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "o"){
                Crafty.e('splitright').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "u"){
                Crafty.e('splitleft').at(x, y)
                this.occupied[x][y] = true;
            }
            else if (c == "F"){
                Crafty.e('brc').at(x, y)
                this.occupied[x][y] = true;
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
  'assets/wallsgate.png',
  'assets/door_knock_3x.mp3',
  'assets/pactiles.png',
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
        
        Crafty.sprite(20, 'assets/wallsgategreen.png', {

            splitdowngreen:[4,0],
            rcapgreen:[0,0],
            lcapgreen:[1,0],
            verticalgreen:[8,0],
            horizontalgreen:[9,0],
            bottomgreen:[3,0]
            
        });
        
         
        Crafty.sprite(20, 'assets/wallsandgatecopy.png', {
            top_left_corner: [10,0],
            top_right_corner: [11, 0],
            bottom_left_corner:[12,0],
            bottom_right_corner:[13,0],
            horizontal: [9, 0],
            vertical:[8,0],
            bottom_cap:[3,0],
            top_cap:[2,0],
            r_cap:[0,0],
            l_cap:[1,0],
            split_d:[4,0],
            split_r:[7,0],
            split_l:[6,0],
         
        });
    
        // Define the PC's sprite to be the first sprite in the third row of the
        //  animation sprite map
        Crafty.sprite(20, 'assets/pacman20.png', {
            spr_player: [12,1],
            spr_pellet: [14, 2],
            spr_rGhost: [2, 0],
            spr_bGhost: [0, 0],
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