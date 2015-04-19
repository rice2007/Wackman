// Defining global ignores for linter
/*global Crafty*/
/*global Game*/

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
    
    speed: 2,
    keypressed: Crafty.keys.RIGHT_ARROW,
    direction: null,
    
        init: function () {
			
            this.requires('Actor, Collision, spr_player, SpriteAnimation')
            .attr({
                x:200,
                y:300
            })
     
            .onHit('Pellet', this.visitPellet)
            .onHit('Ghost', this.die)

        // These next lines define our four animations
        //  each call to .animate specifies:
        //  - the name of the animation
        //  - the x and y coordinates within the sprite
        //     map at which the animation set begins
        //  - the number of animation frames *in addition to* the first one
                
            .bind('KeyDown', function (e) {
                
                if(e.keyCode !== this.direction) {
                    
                    if (e.keyCode === Crafty.keys.LEFT_ARROW ||
                            e.keyCode === Crafty.keys.RIGHT_ARROW ||
                            e.keyCode === Crafty.keys.UP_ARROW ||
                            e.keyCode === Crafty.keys.DOWN_ARROW) {
                                //update the variable
                                this.keypressed = e.keyCode;
                        }
                }
            
            })
            .bind("EnterFrame", function() {
           
                var flag = false;
                
                if (this.keypressed !== null) {
                    
                    flag = this.tryMove(this.keypressed);
                }
                if (!flag) {
                    
                    falg = this.tryMove(this.direction);
				    
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
    
    tryMove: function (direction) {
        
        var ex = this.x,
            why = this.y;
		
        if(direction === Crafty.keys.DOWN_ARROW) {
            this.y += this.speed;   
        } else if (direction === Crafty.keys.UP_ARROW) {
            this.y -= this.speed;
        } else if (direction === Crafty.keys.LEFT_ARROW) {
            this.x -= this.speed;
        } else if (direction === Crafty.keys.RIGHT_ARROW) {
            this.x += this.speed;
		}
		
		if (this.hit('bottom') || this.hit('top') || this.hit('tlc') || this.hit('trc') || this.hit('blc')
			|| this.hit('brc') || this.hit('hrzntl') || this.hit ('vrtcl') || this.hit('bcp') || this.hit('tcp')
			|| this.hit('rcp') || this.hit('lcp') || this.hit('splitdown') || this.hit('splitright') || this.hit('splitleft')
			|| this.hit('splitdgreen') || this.hit('rcgreen') || this.hit('lcgreen') || this.hit('hgreen') || this.hit('vgreen')
			|| this.hit('bgreen')){
			
            this.attr({
			     x: ex,
                 y: why
             });
			
            return false;
        } else {
		
          return true;
		}
	},
		 
       
    die: function() {
        Crafty.scene('Fail');
    }
});

Crafty.c('Ghost', {
    
    speed: 2,
    key: 'l',
   
        init: function () {
			
            this.requires('2D, Canvas, Grid, Collision, spr_bGhost')
            .attr({
                x:380,
                y:20
            })
			.bind("EnterFrame", function() {
				
				var originalX = this.x,
            	originalY = this.y;
				
				if(this.key == 'd') {
					this.y += this.speed;   
				} else if (this.key == 'u') {
					this.y -= this.speed;
				} else if (this.key == 'l') {
					this.x -= this.speed;
				} else if (this.key == 'r') {
					this.x += this.speed;
				}
				
				if (this.hit('bottom') || this.hit('top') || this.hit('tlc') || this.hit('trc') || this.hit('blc')
					|| this.hit('brc') || this.hit('hrzntl') || this.hit ('vrtcl') || this.hit('bcp') || this.hit('tcp')
					|| this.hit('rcp') || this.hit('lcp') || this.hit('splitdown') || this.hit('splitright') || this.hit('splitleft')
					|| this.hit('splitdgreen') || this.hit('rcgreen') || this.hit('lcgreen') || this.hit('hgreen') || this.hit('vgreen')
					|| this.hit('bgreen')){
					
					this.attr({
						x: originalX,
                 		y: originalY
             		});
					
					var i = Math.random() * 10;
					
					if ( i < 3) {
						this.key = 'r';
					} else if (i >= 3 && i <=5) {
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
			
            this.requires('2D, Canvas, Grid, Collision, spr_bGhost')
            .attr({
                x:20,
                y:20
            })
			.bind("EnterFrame", function() {
				
				var originalX = this.x,
            	originalY = this.y;
				
				if(this.key == 'd') {
					this.y += this.speed;   
				} else if (this.key == 'u') {
					this.y -= this.speed;
				} else if (this.key == 'l') {
					this.x -= this.speed;
				} else if (this.key == 'r') {
					this.x += this.speed;
				}
				
				if (this.hit('bottom') || this.hit('top') || this.hit('tlc') || this.hit('trc') || this.hit('blc')
					|| this.hit('brc') || this.hit('hrzntl') || this.hit ('vrtcl') || this.hit('bcp') || this.hit('tcp')
					|| this.hit('rcp') || this.hit('lcp') || this.hit('splitdown') || this.hit('splitright') || this.hit('splitleft')
					|| this.hit('splitdgreen') || this.hit('rcgreen') || this.hit('lcgreen') || this.hit('hgreen') || this.hit('vgreen')
					|| this.hit('bgreen')){
					
					this.attr({
						x: originalX,
                 		y: originalY
             		});
					
					var i = Math.random() * 10;
					
					if ( i < 3) {
						this.key = 'r';
					} else if (i >= 3 && i <=5) {
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
        Crafty.audio.play('knock');
        Crafty.trigger('PelletVisited', this);
    }
});


Crafty.c('RedMove', {
    init: function() {
        Crafty.rg.move('w', 20);
    }
});