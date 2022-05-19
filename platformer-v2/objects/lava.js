import Vec from "../helper/vec.js";

/*
Lava Class
Once the player touches the lava, the game is over. Reset them to the start of the level
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

Lava.prototype.update = function(time, state){
    let newPos = this.pos.plus(this.speed.times(time));
    if(!state.level.touches(newPos, this.size, "wall")){
        return new Lava(newPos, this.speed, this.reset);
    } else if(this.reset){
        return new Lava(this.reset, this.speed, this.reset);
    } else {
        return new Lava(this.pos, this.speed.times(-1));
    }
}

export {Lava};