import Vec from "./helper/vec.js";
import {playerXSpeed, gravity, jumpSpeed} from "./settings.config.js";

/*
* Class Player: Logic for the player
* @param pos: position of the player
* @param speed: speed of the player
*/
class Player{
    constructor(pos, speed){
        this.pos = pos;
        this.speed = speed;
    }

    get type(){return "player";}

    //Player is 1.5 squares tall, so initial position set half a square above placement
    static create(pos){
        return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
    }
}

//Sets player size. Note the player is .8 wide which is why there is an offset for player collision
Player.prototype.size = new Vec(0.8, 1.5);

//Player update function
Player.prototype.update = function(time, state, keys){
    //Calculates x speed based on right/left arrow key presses
    let xSpeed = 0;
    if(keys.ArrowLeft) xSpeed -= playerXSpeed;
    if(keys.ArrowRight) xSpeed += playerXSpeed;

    //Calculates new position, saving it in a variable
    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0));

    //Checks if the player is touching a wall, if not set the new positions
    if(!state.level.touches(movedX, this.size, "wall")){
        pos = movedX;
    }

    //Calculates y speed based on gravity and new position
    let ySpeed = this.speed.y + time * gravity;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    if(!state.level.touches(movedY, this.size, "wall")){                    //If not touching a wall, set the new position
        pos = movedY;
    } else if(keys.ArrowUp && ySpeed > 0){                                  //If jump key pressed and speed is positive (player going up), set new speed
        ySpeed = -jumpSpeed;
    }else{
        ySpeed = 0;
    }
    return new Player(pos, new Vec(xSpeed, ySpeed));
}


export {Player};