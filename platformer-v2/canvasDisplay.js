import config from "./settings.config.js";
import {flipHorizontally} from "./helper/utils.js";

/*
* Class CanvasDisplay: Display the game state in a canvas
* @param parent - the parent element
* @param level - the level object
*/
class CanvasDisplay{
    constructor(parent, level){
        this.scale = config.scale;
        this.canvas = document.createElement("canvas");                     //create a canvas element
        this.canvas.width = Math.min(600, level.width * this.scale);        //set the width of the canvas to the width of the level
        this.canvas.height = Math.min(450, level.height * this.scale);      //set the height of the canvas to the height of the level
        parent.appendChild(this.canvas);                                    //append the canvas to the parent element
        this.cx = this.canvas.getContext("2d");                             //creates object for 2d rendering

        this.flipPlayer = false;                                            //class variable to keep track of player direction ToDo: make this a a player variable

        this.viewport = {                                                   //create a viewport object based on canvas and scale size
            left: 0,
            top: 0,
            width: this.canvas.width / this.scale,
            height: this.canvas.height / this.scale
        };

        //Sprites are done though a traditional sprite sheet with multiple sprites on one image
        this.otherSprites = document.createElement("img");                  //create an image element to hold the other sprites
        this.otherSprites.src = "img/sprites.png";                          //set the source of the image to the sprites image
        this.playerSprites = document.createElement("img");                 //create an image element to hold the player sprites
        this.playerSprites.src = "img/player.png";                          //set the source of the image to the player sprites image
        this.playerXOverlap = 4;                                            //Used because sprites slightly wider than player
    }

    clear(){                                                                //clear the canvas
        this.canvas.remove();
    }
}

//Syncs based on the state
CanvasDisplay.prototype.syncState = function(state) {
    this.updateViewport(state);                                             //Updates viewport based on player position
    this.clearDisplay(state.status);                                        //clears display based on status
    this.drawBackground(state.level);                                       //draws background based on viewport
    this.drawActors(state.actors);                                          //draws actors based on viewport
};

//Updates the viewport based on the player position
CanvasDisplay.prototype.updateViewport = function(state) {
    let view = this.viewport, margin = view.width/3;
    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5));

    if(center.x < view.left + margin) {
        view.left = Math.max(center.x - margin, 0);
    } else if(center.x > view.left + view.width - margin) {
        view.left = Math.min(center.x + margin - view.width,
            state.level.width - view.width);
    }

    if(center.y < view.top + margin) {
        view.top = Math.max(center.y - margin, 0);
    } else if(center.y > view.top + view.height - margin) {
        view.top = Math.min(center.y + margin - view.height,
            state.level.height - view.height);
    }
};

//Technically changes tint of background before another function clears the canvas
CanvasDisplay.prototype.clearDisplay = function(status) {
    if(status=="won") {
        this.cx.fillStyle = "rgb(68,191,255)";                              //lighter blue
    } else if(status=="lost") {
        this.cx.fillStyle = "rgb(44,136,214)";                              //darker blue
    } else {
        this.cx.fillStyle = "rgb(52,166,251)";
    }
    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

//Draws the background based on the viewport and level object
CanvasDisplay.prototype.drawBackground = function(level) {
    let {left, top, width, height} = this.viewport;
    let xStart = Math.floor(left);
    let xEnd = Math.ceil(left + width);
    let yStart = Math.floor(top);
    let yEnd = Math.ceil(top + height);

    for(let y = yStart; y < yEnd; y++) {
        for(let x = xStart; x < xEnd; x++) {
            let tile = level.rows[y][x];
            if(tile == "empty") continue;
            let screenX = (x - left) * this.scale;                          //converts x position to screen x position  
            let screenY = (y - top) * this.scale;                           //converts y position to screen y position
            let tileX = tile == "lava" ? this.scale : 0;
            this.cx.drawImage(this.otherSprites, tileX, 0, this.scale, this.scale, screenX, screenY, this.scale, this.scale);
        }
    }
};

//Draws the actors based on the viewport and level object
//Note: Actor means any object via player/enemies/coins etc
CanvasDisplay.prototype.drawActors = function(actors) {
    for(let actor of actors) {
        let width = actor.size.x * this.scale;
        let height = actor.size.y * this.scale;
        let x = (actor.pos.x - this.viewport.left) * this.scale;        //converts x position to screen x position
        let y = (actor.pos.y - this.viewport.top) * this.scale          //converts y position to screen y position
        if(actor.type == "player") {
            this.drawPlayer(actor, x, y, width, height);                //draws player
        } else {
            let tileX = (actor.type == "coin" ? 2 : 1) * this.scale;
            this.cx.drawImage(this.otherSprites, tileX, 0, this.scale, this.scale, x, y, width, height);
        }
    }
};

//Draws the player based on the viewport and level object
//Note: x, y are calculated in draw actors based on viewport/scale
CanvasDisplay.prototype.drawPlayer = function(player, x, y, width, height) {
    width += this.playerXOverlap * 2;
    x -= this.playerXOverlap;
    if(player.speed.x != 0) {
        this.flipPlayer = player.speed.x < 0;                               //calculates the direction the player is facing
    }

    let tile = 8;                                                           //First 8 tiles are the player moving animation
    if(player.speed.y != 0) {                                               //If player is in air, use the jumping animation
        tile = 9;                                                           //9 is the player jumping animation
    } else if(player.speed.x != 0) {                                        //If player is moving, use the moving animation
        tile = Math.floor(Date.now() / 60) % 8;
    }

    this.cx.save();

    if(this.flipPlayer) {
        flipHorizontally(this.cx, x + width/2);                             //If player is flip use helper function to flip horizontally
    }
    let tileX = tile * width;                                               
    this.cx.drawImage(this.playerSprites, tileX, 0, this.scale, this.scale, x, y, width, height);
    this.cx.restore();
};

export {CanvasDisplay};