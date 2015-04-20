// Defining global ignores for linter
/*global Crafty*/
/*global Game*/
var score = 0; //current score
var highscore = []; //highscore
// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    init: function () {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        });
    },

    // Locate this entity at the given position on the grid
    at: function (x, y) {
        if (x === undefined && y === undefined) {
            return {
                x: this.x / Game.map_grid.tile.width,
                y: this.y / Game.map_grid.tile.height
            };
        } else {
            this.attr({
                x: x * Game.map_grid.tile.width,
                y: y * Game.map_grid.tile.height
            });
            return this;
        }
    },

});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function () {
        this.requires('2D, Canvas, Grid');
    },
});

// generic initialization method could be made
// each of the following crafty game objects inherit from the actor
// crafty game object. The Actor game object above inherits from the
// 2D class, Canvas Class, and Grid Class. Each map piece below inherits from 
// the solid class additionally.
Crafty.c('bottom', {
    init: function () {
        this.requires('Actor, Solid, bottom_cap');
    },
});
Crafty.c('top', {
    init: function () {
        this.requires('Actor, Solid, top_cap');
    },
});
Crafty.c('tlc', {
    init: function () {
        this.requires('Actor, Solid, top_left_corner');
    },
});
Crafty.c('trc', {
    init: function () {
        this.requires('Actor, Solid, top_right_corner');
    },
});
Crafty.c('blc', {
    init: function () {
        this.requires('Actor, Solid, bottom_left_corner');
    },
});
Crafty.c('brc', {
    init: function () {
        this.requires('Actor, Solid, bottom_right_corner');
    },
});
Crafty.c('hrzntl', {
    init: function () {
        this.requires('Actor, Solid, horizontal');
    },
});
Crafty.c('vrtcl', {
    init: function () {
        this.requires('Actor, Solid, vertical');
    },
});
Crafty.c('bcp', {
    init: function () {
        this.requires('Actor, Solid, bottom_cap');
    },
});
Crafty.c('tcp', {
    init: function () {
        this.requires('Actor, Solid, top_cap');
    },
});
Crafty.c('rcp', {
    init: function () {
        this.requires('Actor, Solid, r_cap');
    },
});
Crafty.c('lcp', {
    init: function () {
        this.requires('Actor, Solid, l_cap');
    },
});
Crafty.c('splitdown', {
    init: function () {
        this.requires('Actor, Solid, split_d');
    },
});
Crafty.c('splitright', {
    init: function () {
        this.requires('Actor, Solid, split_r');
    },
});
Crafty.c('splitleft', {
    init: function () {
        this.requires('Actor, Solid, split_l');
    },
});
//green
Crafty.c('splitdgreen', {
    init: function () {
        this.requires('Actor, Solid, splitdowngreen');
    },
});
Crafty.c('rcgreen', {
    init: function () {
        this.requires('Actor, Solid, rcapgreen');
    },
});
Crafty.c('lcgreen', {
    init: function () {
        this.requires('Actor, Solid, lcapgreen');
    },
});
Crafty.c('hgreen', {
    init: function () {
        this.requires('Actor, Solid, horizontalgreen');
    },
});
Crafty.c('vgreen', {
    init: function () {
        this.requires('Actor, Solid, verticalgreen');
    },
});
Crafty.c('bgreen', {
    init: function () {
        this.requires('Actor, Solid, bottomgreen');
    },
});

// This creates the pacman player
// pacman inherits from the actor class, collision class, and SpriteAnimation class
// the spr_player image is passed for the sprite animation to use.
Crafty.c('PlayerCharacter', {
    speed: 2,
    keypressed: Crafty.keys.RIGHT_ARROW,
    direction: null,

    init: function () {
        //this.requires method show which crafty classes are inherited.
        this.requires('Actor, Collision, spr_player, SpriteAnimation')
            .attr({
                x: 200,
                y: 300
            })
 
        //when pacman with another game object
        //execute the function that is passed as an argument.
        //Onhit method is inherited from the Collision class
        .onHit('Pellet', this.visitPellet)
            .onHit('Ghost', this.die)
            .onHit('Ghost1', this.die)

        //binding the 'keydown' event to this object
        //needed so the user can control pacman
        //saving the button that was pressed into a variable was
        //critical for smooth navigation.
        //when an arrow key is pressed it is passed to the trymove function
        //that function tries to move in the direction of the key was pressed 
        //until there is an opening in the maze that will allow it to go in that
        //direction
        .bind('KeyDown', function (e) {
            if (e.keyCode !== this.direction) {

                if (e.keyCode === Crafty.keys.LEFT_ARROW ||
                    e.keyCode === Crafty.keys.RIGHT_ARROW ||
                    e.keyCode === Crafty.keys.UP_ARROW ||
                    e.keyCode === Crafty.keys.DOWN_ARROW) {
                    //update the variable
                    this.keypressed = e.keyCode;
                }
            }
        })

        //Binding the 'enterframe' event to this object was critical
        //for constant movement.
        //The function passed to 'bind' is executed continuously, (like a game run loop)
        //not just when a key is pressed like the 'KeyDown' event above.
        //Saving the button that was pressed into a variable in the 'KeyDown' event Handler 
        //allowed much smoother navigation.
        //When an arrow key is pressed it is passed to the trymove function
        //that function tries to move pacman in the direction of the key that was pressed 
        //until there is an opening in the maze that will allow it to go in that
        //direction.
        //It will continue to go in that direction until another key is pressed. 
        .bind("EnterFrame", function () {
            var flag = false;
            if (this.keypressed !== null) {
                flag = this.tryMove(this.keypressed);
            }
            //if it hit a wall when trying to turn.. move in the same direction
            //that pacman was moving before it hit the wall.
            if (!flag) {
                flag = this.tryMove(this.direction);
            } else {
                this.direction = this.keypressed;
                this.keypressed = null;
                this.update();
            }
        });
    },
    // Respond to this player visiting a pellet
    visitPellet: function (data) {
        villlage = data[0].obj;
        villlage.visit();
    },

    // tells the crafty game engine what animation
    // to play depending on pacman's direction
    update: function () {

        if (this.direction === Crafty.keys.DOWN_ARROW) {
            this.reel('PlayerMovingDown', 300, 11, 3, 2)
                .animate('PlayerMovingDown', -1);
        } else if (this.direction === Crafty.keys.UP_ARROW) {
            this.reel('PlayerMovingUp', 300, 11, 2, 2)
                .animate('PlayerMovingUp', -1);
        } else if (this.direction === Crafty.keys.LEFT_ARROW) {
            this.reel('PlayerMovingLeft', 300, 11, 0, 2)
                .animate('PlayerMovingLeft', -1);
        } else if (this.direction === Crafty.keys.RIGHT_ARROW) {
            this.reel('PlayerMovingRight', 300, 11, 1, 2)
                .animate('PlayerMovingRight', -1);
        }
    },

    getX: function () {
        return Math.round(this.x / 20);
    },
    getY: function () {
        return Math.round(this.y / 20);
    },

    tryMove: function (d) {

        var ex = this.x,
            why = this.y;

        //update pacamn's (x, y) coordinate
        // according to the key that was passed.
        if (d === Crafty.keys.DOWN_ARROW) {
            this.y += this.speed;
        } else if (d === Crafty.keys.UP_ARROW) {
            this.y -= this.speed;
        } else if (d === Crafty.keys.LEFT_ARROW) {
            this.x -= this.speed;
        } else if (d === Crafty.keys.RIGHT_ARROW) {
            this.x += this.speed;
        }

        // if pacman hits a wall then change its 
        //(x, y) coordinate back to its original position
        if (this.hit('bottom') || this.hit('top') || this.hit('tlc') || this.hit('trc') || this.hit('blc') || this.hit('brc') || this.hit('hrzntl') || this.hit('vrtcl') || this.hit('bcp') || this.hit('tcp') || this.hit('rcp') || this.hit('lcp') || this.hit('splitdown') || this.hit('splitright') || this.hit('splitleft') || this.hit('splitdgreen') || this.hit('rcgreen') || this.hit('lcgreen') || this.hit('hgreen') || this.hit('vgreen') || this.hit('bgreen')) {
            //set pacman's (x, y) attributes to the its orginal (x, y) coordinate
            //before it hit the wall
            this.attr({
                x: ex,
                y: why
            });
            return false;
        } else {
            return true;
        }
    },

    // Stores scores and lives to local storage for accuracy.
    // Resets score on death.
    // Loads correct scene in accordance with remaining lives.
    die: function () {
        if (sessionStorage.getItem('currentScore') < score) {
            sessionStorage.setItem('currentScore', score);
        }
        score = 0;
        if (sessionStorage.getItem('livesStore') == 0) {
            Crafty.scene('Fail');
        } else {
            Crafty.scene('Game');
        }
    }
});

Crafty.c('Ghost', {
    speed: 2,
    key: 'l',

    init: function () {
        this.requires('2D, Canvas, Grid, Collision, spr_bGhost')
            .attr({
                x: 380,
                y: 20
            })
        //Binding the 'Enterframe' event to the ghost object
        //allows us to add behavior to it 
        .bind("EnterFrame", function () {
            var originalX = this.x,
                originalY = this.y;

            if (this.key == 'd') {
                this.y += this.speed;
            } else if (this.key == 'u') {
                this.y -= this.speed;
            } else if (this.key == 'l') {
                this.x -= this.speed;
            } else if (this.key == 'r') {
                this.x += this.speed;
            }

            //Did the ghost hit a wall?
            if (this.hit('bottom') || this.hit('top') || this.hit('tlc') || this.hit('trc') || this.hit('blc') || this.hit('brc') || this.hit('hrzntl') || this.hit('vrtcl') || this.hit('bcp') || this.hit('tcp') || this.hit('rcp') || this.hit('lcp') || this.hit('splitdown') || this.hit('splitright') || this.hit('splitleft') || this.hit('splitdgreen') || this.hit('rcgreen') || this.hit('lcgreen') || this.hit('hgreen') || this.hit('vgreen') || this.hit('bgreen')) {
                //set its (x, y) coordinate back to its original position
                this.attr({
                    x: originalX,
                    y: originalY
                });

                //when a ghost hits a wall.. Generate a random number between
                //0 and 10. Test to see what range the number was in and assign 
                //this.key another value. If that new direction still hits a wall
                //then this process will be repeated.
                var i = Math.random() * 10;
                if (i < 3) {
                    this.key = 'r';
                } else if (i >= 3 && i <= 5) {
                    this.key = 'u';
                } else if (i > 5 && i < 8) {
                    this.key = 'l';
                } else if (i >= 8) {
                    this.key = 'd';
                }
            }
        });
    },

    getX: function () {
        return Math.round(this.x / 20);
    },
    getY: function () {
        return Math.round(this.y / 20);
    },
});

Crafty.c('Ghost1', {
    speed: 2,
    key: 'l',

    init: function () {

        this.requires('2D, Canvas, Grid, Collision, spr_rGhost')
            .attr({
                x: 20,
                y: 20
            })
            
            .bind("EnterFrame", function () {
                var originalX = this.x,
                    originalY = this.y;

                if (this.key == 'd') {
                    this.y += this.speed;
                } else if (this.key == 'u') {
                    this.y -= this.speed;
                } else if (this.key == 'l') {
                    this.x -= this.speed;
                } else if (this.key == 'r') {
                    this.x += this.speed;
                }

                if (this.hit('bottom') || this.hit('top') || this.hit('tlc') || this.hit('trc') || this.hit('blc') || this.hit('brc') || this.hit('hrzntl') || this.hit('vrtcl') || this.hit('bcp') || this.hit('tcp') || this.hit('rcp') || this.hit('lcp') || this.hit('splitdown') || this.hit('splitright') || this.hit('splitleft') || this.hit('splitdgreen') || this.hit('rcgreen') || this.hit('lcgreen') || this.hit('hgreen') || this.hit('vgreen') || this.hit('bgreen')) {
                    this.attr({
                        x: originalX,
                        y: originalY
                    });

                    var i = Math.random() * 10;
                    if (i < 3) {
                        this.key = 'r';
                    } else if (i >= 3 && i <= 5) {
                        this.key = 'u';
                    } else if (i > 5 && i < 8) {
                        this.key = 'l';
                    } else if (i >= 8) {
                        this.key = 'd';
                    }
                }
            });
    },

    getX: function () {
        return Math.round(this.x / 20);
    },
    getY: function () {
        return Math.round(this.y / 20);
    },
});

// A pellet is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Pellet', {
    init: function () {
        this.requires('Actor, spr_pellet');
    },

    // Process a visitation with this pellet
    visit: function () {
        this.destroy();
        score = score + 10;
        document.getElementById("scoreID").innerHTML = "Score: " + score;
        Crafty.audio.play('knock');
        Crafty.trigger('PelletVisited', this);
    }
});