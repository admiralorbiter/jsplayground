import {Player} from "./player.js";
import {Coin} from "./coin.js";
import {Lava} from "./lava.js";
import {Vec} from "./vec.js";
import {DOMDisplay} from "./helper.js";

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

const levelChars = {
    ".": "empty", "#": "wall", "+": "lava",
    "@": Player, "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
    };

class Level {
    constructor(plan) {
        let rows=plan.trim().split("\n").map(l => [...l]);//trim removes whitespace, splits at end of the line. each line goes into array
        this.height=rows.length;
        this.width=rows[0].length;
        this.startActors = [];

        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let type = levelChars[ch];
                if (typeof type === "string") return type;
                this.startActors.push(type.create(new Vec(x, y), ch));
                return "empty";
            });
        });
    }
}

Level.prototype.touches = function(pos, size, type) {
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

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