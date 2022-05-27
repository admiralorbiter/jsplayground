import Vec from "./vec.js";
import {getRandomInt, findCol} from "./util.js";

class Player{
    constructor(){
        this.board = [[0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]];
        this.tile_board = [[undefined],[undefined, undefined],[undefined, undefined, undefined],[undefined, undefined, undefined, undefined],[undefined, undefined, undefined, undefined, undefined]];
        this.score = 0;
        this.penaltyCount = 0;
        this.first = 0;
    }
}

Player.prototype.type = function(pos){
    return this.board[pos.x][pos.y];
}

Player.prototype.turn = function(factories, pile){
    //Randomly pick a tile from the tile storage
    let p = pile.length> 1 ? 1: 0; //factors in if there is anything in the pile. if there is adds that as an option
    let rand = getRandomInt(0, factories.length+p);
    // console.log(rand+" "+factories.length+" "+p);
    //Branch if actor picks from pile
    if(rand == factories.length){
        let rand_color = pile[Math.floor(Math.random() * pile.length)];
        let tiles = pile.filter(tile => tile == rand_color);
        // console.log("C: "+rand_color);
        // console.log("P: "+pile);  

        if(pile[0]==-1){
            this.first = -1;
            this.penaltyCount++;
            pile.shift();
        }

        //TODO: Need to make this truly random. start by checking for possible rows that can take all the tiles, pick random
        //If that can't be done, check for rows that can take some tiles, pick random
        //Finally if that cant' be done, add it to the penalties.
        let found = false;
        for(let i=this.tile_board.length-1; i>=0; i--){
            if(this.tile_board[i][0] == undefined){
                for(let j=0; j<tiles.length; j++){
                    this.tile_board[i][j] = tiles[j];
                }
                found = true;
                break;
            }
            if(found)break;
        }

        if(!found){
            this.penaltyCount++;
            console.log("Penalty");
        }

        for(let i=0; i<tiles.length; i++){
            let index = pile.indexOf(tiles[i]);
            pile.splice(index, 1);
        }
    }else{
        let rand_color = factories[rand][Math.floor(Math.random() * factories[rand].length)];
        let taken_tiles = factories[rand].filter(tile => tile == rand_color);
        let pile_tiles = factories[rand].filter(tile => tile != rand_color);
        //TODO: Need to make this truly random. start by checking for possible rows that can take all the tiles, pick random
        //If that can't be done, check for rows that can take some tiles, pick random
        //Finally if that cant' be done, add it to the penalties.
        // console.log(factories[rand]);
        let found = false;
        for(let i=this.tile_board.length-1; i>=0; i--){
            if(this.tile_board[i][0] == undefined || this.tile_board[i][0] == rand_color){
                // console.log("L: "+this.tile_board[i].length);
                for(let j=0; j<taken_tiles.length; j++){//need to shorten this to only apply to empty spots
                    //also needs to add it to the end of the row
                    if(j<this.tile_board[i].length){
                        this.tile_board[i][j] = taken_tiles[j];
                    }
                }
                found = true;
                break;
            }else if(this.tile_board[i][0] == rand_color){//if the first tile is the same color as the one we are trying to add
                // for(let j=0; j<taken_tiles.length; j++){
                //     //also needs to add it to the end of the row
                //     if(j<this.tile_board[i].length){
                //         this.tile_board[i][j] = taken_tiles[j];
                //     }
                // }
            }
            if(found)break;
        }
        if(!found){
            this.penaltyCount++;
            console.log("Penalty");
        }
        pile.push(...pile_tiles);
        // console.log(taken_tiles);
        // console.log(pile_tiles);
        // console.log(this.tile_board);
        factories.splice(rand, 1);
    }
    // console.log(JSON.parse(JSON.stringify(this.tile_board)));
}

Player.prototype.processTileBoard = function(){
    let tiles = [];
    for(let i=0; i<this.tile_board.length; i++){
        let trigged=false;
        for(let j=0; j<this.tile_board[i].length; j++){
            if(this.tile_board[i][j] == undefined){
                trigged = true;
            }
        }
        //means the row is full
        if(!trigged){
            //NEED TO MAP TO WHAT THEW BOARD LOOKS LIKE
            let j = findCol(i, this.tile_board[i][0]);
            this.board[i][j] = 1;
            for(let j=0; j<this.tile_board[i].length; j++){
                this.tile_board[i][j] = undefined;
            }
            // console.log(i+" - "+this.tile_board[i][0]);
            // console.log(findCol(i, this.tile_board[i][0]));
            // this.board[i][j] = 1;
            // for(let j=0; j<this.tile_board[i].length; j++){
            //     this.tile_board[i][j] = undefined;
            // }
        }
    }
    return tiles;
}

Player.prototype.checkEndCondition = function(){
    let end = false;
    for(let i=0; i<this.board.length; i++){
        let trigger = true;
        for(let j=0; j<this.board[i].length; j++){
            if(this.board[i][j] == 0){
                trigger = false;
                break;
            }
        }
        if(trigger){
            end = true;
            break;
        }
    }
    return end;
}

Player.prototype.test = function(pos){
    pos = new Vec(0,0);
    console.log(this.type(pos));
}

export {Player};