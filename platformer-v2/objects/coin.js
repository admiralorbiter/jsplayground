import Vec from "../helper/vec.js";
import State from "../state.js";
import {wobbleSpeed, wobbleDist} from "../settings.config.js";

/*
* Coin Class 
* Includes position, base position, and wobble for animation effect
* Once all coins are collected, move to the next level
* @param pos: position of the coin
* @param basePos: base position of the coin
* @param wobble: wobble of the coin
*/
class Coin{
    constructor(pos, basePos, wobble){
        this.pos = pos;
        this.basePos = basePos;
        this.wobble = wobble;
    }

    get type(){return "coin";}

    //Sets position then randomly generates the wobble magnitude
    static create(pos){
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
    }
}

//Sets coin size
Coin.prototype.size = new Vec(0.6, 0.6);

//Logic for how to change state if there is a collision
Coin.prototype.collide = function(state){
    let filtered = state.actors.filter(a => a !== this);                    //Filters out the coin that is colliding
    let status = state.status;                                              //Sets the status to the current status
    if(!filtered.some(a => a.type === "coin")) status = "won";              //If there are no more coins, change status to won
    return new State(state.level, filtered, status);                        //Returns the new state without old coin
}

//Logic for update for the coin
//Changes the wobble of the coin
Coin.prototype.update = function(time){
    let wobble = this.wobble + time * wobbleSpeed;
    let wobblePos = Math.sin(wobble) * wobbleDist;
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
}

export {Coin};