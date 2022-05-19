import Vec from "../helper/vec.js";

/*
Coin Class 
Includes position, base position, and wobble for animation effect
Once all coins are collected, move to the next level
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

Coin.prototype.update = function(time){
    let wobble = this.wobble + time * wobbleSpeed;
    let wobblePos = Math.sin(wobble) * wobbleDist;
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
}

export {Coin};