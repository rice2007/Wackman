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
    }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function () {
        this.requires('2D, Canvas, Grid');
    },
});

// generic initialization method could be made

//Blue
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

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
    init: function () {
        this.requires('Actor, Multiway, Collision, spr_player, SpriteAnimation')
        //            .fourway(2)
        this.multiway(2, {
            UP_ARROW: -90,
            DOWN_ARROW: 90,
            RIGHT_ARROW: 0,
            LEFT_ARROW: 180
        })
            .stopOnSolids()
            .onHit('Pellet', this.visitPellet)
        // These next lines define our four animations
        //  each call to .animate specifies:
        //  - the name of the animation
        //  - the x and y coordinates within the sprite
        //     map at which the animation set begins
        //  - the number of animation frames *in addition to* the first one
        .reel('PlayerMovingUp', 300, 11, 2, 2)
            .reel('PlayerMovingRight', 300, 11, 1, 2)
            .reel('PlayerMovingDown', 300, 11, 3, 2)
            .reel('PlayerMovingLeft', 300, 11, 0, 2);
        // Watch for a change of direction and switch animations accordingly
        var animation_speed = 4;
        var lastKeyEvent = {
            key: Crafty.keys.RIGHT_ARROW
        };


        this.animate('PlayerMovingRight', -1)
       // Crafty.trigger("KeyDown", lastKeyEvent)
        // Crafty.trigger("KeyUp", lastKeyEvent)

        Crafty.bind("KeyDown", function (e) {
//            Crafty.trigger("KeyDown", lastKeyEvent)
        });




        this.bind('NewDirection', function (data) {
            if (data.x > 0) {
                this.animate('PlayerMovingRight', -1);
                lastKeyEvent = {
                    key: Crafty.keys.RIGHT_ARROW
                };
            } else if (data.x < 0) {
                this.animate('PlayerMovingLeft', -1);
                lastKeyEvent = {
                    key: Crafty.keys.LEFT_ARROW
                };
            } else if (data.y > 0) {
                this.animate('PlayerMovingDown', -1);
                lastKeyEvent = {
                    key: Crafty.keys.DOWN_ARROW
                };
            } else if (data.y < 0) {
                this.animate('PlayerMovingUp', -1);
                lastKeyEvent = {
                    key: Crafty.keys.UP_ARROW
                };
            } else {
                this.pauseAnimation();
            }
        });

    },

    // Registers a stop-movement function to be called when
    //  this entity hits an entity with the "Solid" component
    stopOnSolids: function () {
        this.onHit('Solid', this.stopMovement);

        return this;
    },

    // Stops the movement
    stopMovement: function () {
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
    },

    // Respond to this player visiting a pellet
    visitPellet: function (data) {
        villlage = data[0].obj;
        villlage.visit();
    }
});

// A pellet is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Pellet', {
    init: function () {
        this.requires('Actor, spr_pellet');
    },

    // Process a visitation with this pellet
    visit: function () {
        this.destroy();
        Crafty.audio.play('knock');
        Crafty.trigger('PelletVisited', this);
    }
});