
// Set up Canvas width for calculating various events
var GAME_CANVAS_WIDTH = 505;

// Create an array to hold the y coordinates for each of
// the three rows for randomly reassigning a row for a given
// bug once they go off the right side of the screen - see bellow
var BUGROWS = [55,140,225];

// Set up various x and y coordinates that define boundaries that
// will be used to check where the player can go and will allow for
// the awarding of a star - if the water is reached:
var WATER_YCOORDS = 100;
var SAND_YCOORDS =  380;
var PLAYER_LEFT_BOUNDARY = 45;
var PLAYER_RIGHT_BOUNDARY = 375;


// create array to hold stars
var allStars = [];

//Constructor for new star objects
var Star = function() {
    // all star objects will have the same sprite image (for now)
    // and exist on the same horizontal line on top of the water.
    this.sprite = 'images/Star.png';
    this.y = -5;
};

//Set up prototype method for rendering new stars
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    this.y = 0;
    this.height = 171;
    this.width = 101;

    // set up an initial random speed within a specific range
    // this will be used later un the update to generate the
    // real speed
    this.speed = getRandomInt(60, 300);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x >= GAME_CANVAS_WIDTH)
    {
        // If the bug goes off the right side of the screen
        // this code will run only once to "reset" the bug and set
        // up a constant (new) speed, and a (potentially) new row
        this.reset();
    }
    else
    {
        // Move the bug by increasing its x coordinate by it's
        // randomly generated speed property multiplied by dt param
        this.x += (this.speed * dt);
    }

    // Collision detection:
    // we need to get the x and y coordinates for both the enemy and
    // the player these variables are for making what we are examining
    // and compairing easier to understand:
    var enemyLeftEdge = this.x;
    var enemyRightEdge = enemyLeftEdge + (this.width/2);
    var playerLeftEdge = player.x;
    var playerRightEdge = playerLeftEdge + (player.width/2);
    var enemyTopEdge = this.y;
    var enemyBottomEdge = enemyTopEdge + (this.height/2);
    var playerTopEdge = player.y;
    var playerBottomEdge = playerTopEdge + (player.height/2);

    // use the bounding box method to determine if there is a
    // collision between this enemy and the player:
    if (enemyRightEdge >= playerLeftEdge && enemyLeftEdge <= playerRightEdge && enemyBottomEdge >= playerTopEdge && enemyTopEdge <= playerBottomEdge) {
        // reset the player to the starting position if they've hit one of the bugs:
        player.reset();
    }
};

// reset the bug once it's progressed to the end (right side)
// of the screen:
Enemy.prototype.reset = function() {
    // Set the bug back to the left side of the screen
    this.x = 0;

   // Randomly choose a row to put the bug on
   this.y = BUGROWS[getRandomInt(0,3)];

   // Randomly set a speed (within a range) for the bug
   this.speed = getRandomInt(60, 300);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    this.x = 0;
    this.y = 0;
    this.sprite = 'images/char-boy.png';
    this.width = 101;
    this.height = 171;
    this.startX = (GAME_CANVAS_WIDTH/ 2) - (this.width / 2);
    this.startY = 370;


    // Since there is only ever one player per game, there doesn't
    // seem to be a need for the reset funtion to be created as a method
    // on the prototype.  This method will simply bring the player back to
    // the initial x/y coords based on the properties set up when
    // instantiating the object:
    this.reset = function() {
        this.x = this.startX;
        this.y = this.startY;
    };

    // again, no need for a prototype method, the update methond here will
    this.update = function() {
        if (this.x < 40)
        {
            this.x = (GAME_CANVAS_WIDTH / 2) - (this.width / 2);
            this.y = 380;
        }
    };

    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    };

    this.handleInput = function(keyCode) {
        switch (keyCode) {
          case 'left':
            if(this.x > PLAYER_LEFT_BOUNDARY) {
                this.x -= 40;
            }
            break;
          case  'up':
            if (this.y > WATER_YCOORDS) {
                this.y -= 40;
            } else {
                var newStar = new Star();
                newStar.x = allStars.length * 70;
                allStars.push(newStar);
                this.reset();
            }
            break;
          case 'right':
            if (this.x < PLAYER_RIGHT_BOUNDARY) {
                this.x += 40;
            }
            break;
          case 'down':
            if (this.y < SAND_YCOORDS) {
                this.y += 40;
            }
            break;
        }
    };

};


// Now instantiate your objects.
var topBug  = new Enemy();
topBug.x = 0;
topBug.y = BUGROWS[0];
var middleBug = new Enemy();
middleBug.x = 0;
middleBug.y = BUGROWS[1];
var bottomBug = new Enemy();
bottomBug.x = 0;
bottomBug.y = BUGROWS[2];

// Place all enemy objects in an array called allEnemies
var allEnemies = [bottomBug, middleBug, topBug];

// Place the player object in a variable called player
var player = new Player();
player.reset();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// function to generate random whole numbers within a specific range.
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

