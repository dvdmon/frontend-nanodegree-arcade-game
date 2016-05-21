
// Set up Canvas width for calculating various events
var GAME_CANVAS = 505;

 // Create an array to hold the y coordinates for each of
 // the three rows for randomly reassigning a row for a given
 // bug once they go off the right side of the screen - see bellow
 var BUGROWS = new Array( 55,  140, 225);
var allStars = new Array();

 var Star = function() {
    this.sprite = 'images/Star.png';
    this.y = -5;
};
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



    // If the bug goes off the right side of the screen
    // this code will run only once to "reset" the bug and set
    // up a constant (new) speed, and a (potentially) new row
    if (this.x >= 505)
    {
        // Set the bug back to the left side of the screen
        this.x = 0;

        // Randomly choose a row to put the bug on
        this.y = BUGROWS[getRandomInt(0,3)];

        // Randomly set a speed (within a range) for the bug
        this.speed = getRandomInt(60, 300);

    }
    else
    {
        // Move the bug by increasing its x coordinate by it's
        // randomly generated speed property multiplied by dt param
        this.x += (this.speed * dt)
    }

    // Collision detection:
    // we need to get the x and y coordinates for both the enemy and
    //the player:
    var EnemyLeftEdge = this.x;
    var EnemyRightEdge = EnemyLeftEdge + (this.width/2);
    var PlayerLeftEdge = player.x;
    var PlayerRightEdge = PlayerLeftEdge + (player.width/2);

    var EnemyTopEdge = this.y
    var EnemyBottomEdge = EnemyTopEdge + (this.height/2);
    var PlayerTopEdge = player.y;
    var PlayerBottomEdge = PlayerTopEdge + (player.height/2);


    //if (PlayerleftEdge <= EnemyrightEdge && PlayerrightEdge >= EnemyleftEdge && PlayertopEdge >= EnemybottomEdge && PlayerbottomEdge <= EnemytopEdge)
    if (
//        PlayerTopEdge > EnemyTopEdge && PlayerTopEdge < EnemyBottomEdge && PlayerBottomEdge > EnemyTopEdge && PlayerBottomEdge < EnemyBottomEdge)
//        &&
//        PlayerLeftEdge < EnemyRightEdge && PlayerLeftEdge > EnemyLeftEdge && PlayerRightEdge > EnemyLeftEdge && PlayerRightEdge < EnemyRightEdge
          EnemyRightEdge >= PlayerLeftEdge && EnemyLeftEdge <= PlayerRightEdge && EnemyBottomEdge >= PlayerTopEdge && EnemyTopEdge <= PlayerBottomEdge

        )
    {
        player.reset();
        }


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
    this.startX = (GAME_CANVAS / 2) - (this.width / 2);
    this.startY = 370;

    var WATER_YCOORDS = 100;
    var SAND_YCOORDS =  380;
    var PLAYER_LEFT_BOUNDARY = 45;
    var PLAYER_RIGHT_BOUNDARY = 375;

    this.reset = function() {
        this.x = this.startX;
        this.y = this.startY;
    }


    this.update = function() {
        if (this.x < 40)
        {
            this.x = (GAME_CANVAS.width / 2) - (this.width / 2);
            this.y = 380;
        }
        //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    };
    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    };
    this.handleInput = function(keyCode) {
        switch (keyCode) {
          case 'left':
            var currentLeftX = this.x;

            if(currentLeftX > (PLAYER_LEFT_BOUNDARY))
            {
                this.x -= 40;
            } else
            {
                this.x = currentLeftX;
            }

            break;
          case  'up':
            var currentUpY = this.y;
            if(currentUpY > (WATER_YCOORDS))
            {
                this.y -= 40;
            } else
            {
                console.log('initial: ' + allStars.length);
                var newStar = new Star();
                newStar.x = allStars.length * 70;
                allStars.push(newStar);

                console.log('now: ' + allStars.length);
               this.reset();
            }

            break;
          case 'right':
            var currentRightX = this.x ;

            if(currentRightX < (PLAYER_RIGHT_BOUNDARY))
            {
                this.x += 40;
            } else
            {
                this.x = currentRightX;
            }
            break;

          case 'down':
            var currentDownY = this.y ;

            if(currentDownY < (SAND_YCOORDS))
            {
                this.y += 40;
            } else
            {
                this.y = currentDownY;
            }
            break;
        }
    };

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

var topBug  = new Enemy();
topBug.x = 0;
topBug.y = BUGROWS[0];
var middleBug = new Enemy();
middleBug.x = 0;
middleBug.y = BUGROWS[1];
var bottomBug = new Enemy();
bottomBug.x = 0;
bottomBug.y = BUGROWS[2];
//var allEnemies = new Array(topBug, middleBug, bottomBug);
var allEnemies = new Array(bottomBug, middleBug, topBug);
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

