import Vec from "../helper/vec.js";
import State from "../state.js";

/*
* Lava Class
* Once the player touches the lava, the game is over. Reset them to the start of the level
* Note: There are different version of lava allowing for different lava types
* Ex: Some lava is stationary, some is moving or dripping from the ceiling
* @param pos: position of the lava
* @param speed: speed of the lava
* @param reset: position to reset the lava to
*/
class Lava{
    constructor(pos, speed, reset){
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
    }

    get type(){return "lava";}

    //Creates the lava based on the level character
    //Each lava is a different speed and reset position
    //This is only for lava that is moving. A string is used for stationary lava
    static create(pos, ch){
        if (ch === "="){
            return new Lava(pos, new Vec(2, 0));
        } else if (ch === "|"){
            return new Lava(pos, new Vec(0, 2));
        } else if (ch == "v"){
            //This lava will flow then reset at the original position
            return new Lava(pos, new Vec(0, 3), pos);
        }
    }
}

//Sets the lava size
Lava.prototype.size = new Vec(1, 1);

//Logic for how to change state if there is a collision
//Changes status to lost that is resolved in index.js
Lava.prototype.collide = function(state){
    return new State(state.level, state.actors, "lost");
}

//Logic for update for moving lava
Lava.prototype.update = function(time, state){
    let newPos = this.pos.plus(this.speed.times(time));                     //Calculates the new position
    if(!state.level.touches(newPos, this.size, "wall")){                    //If not touching a wall, set the new position
        return new Lava(newPos, this.speed, this.reset);
    } else if(this.reset){
        return new Lava(this.reset, this.speed, this.reset);                //Dripping lava will reset to the original position if touching a wall
    } else {
        return new Lava(this.pos, this.speed.times(-1));                    //Bouncing lava will reverse direction if touching a wall
    }
}

export {Lava};