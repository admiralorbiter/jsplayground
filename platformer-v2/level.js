import {Player} from "./player.js";
import {Coin} from "./objects/coin.js";
import {Lava} from "./objects/lava.js";
import Vec from "./helper/vec.js";

/*Demo Level*/
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

/*
    Used to map characters to their corresponding objects
    Trying to add new blocks/objects in the game, you need to add them here
*/
const levelChars = {
    ".": "empty", "#": "wall", "+": "lava",
    "@": Player, "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
};

/*
* Class Level: Logic generating game level 
*/
class Level {
    constructor(plan) {
        if(plan==undefined)plan=simpleLevelPlan;                            //defaults to demo level if no plan is passed
        let rows=plan.trim().split("\n").map(l => [...l]);                  //trim removes whitespace, splits at end of the line. each line goes into array  
        this.height=rows.length;
        this.width=rows[0].length;
        this.startActors = [];

        //Creates a grid of objects based on the level plan
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let type = levelChars[ch];
                if (typeof type === "string") return type;
                this.startActors.push(type.create(new Vec(x, y), ch));     //Objects are pushed onto the stack
                return "empty";
            });
        });
    }
}

/*
    Checks the collision of the player with the object
    Returns true if objects are touching allowing other functions to resolve the collision
*/
Level.prototype.touches = function(pos, size, type) {
    //Creates a bounding box around the object
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    //Checks if the object is touching by checking using the bounding box
    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
            let here = isOutside ? "wall" : this.rows[y][x];
            if (here == type) return true;
        }
    }
    return false;
};

export{Level, simpleLevelPlan};