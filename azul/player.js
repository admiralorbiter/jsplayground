import Vec from "./vec.js";

class Player{
    constructor(){
        this.board = [[0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]];
        this.tile_board = [[undefined],[undefined, undefined],[undefined, undefined, undefined],[undefined, undefined, undefined, undefined],[undefined, undefined, undefined, undefined, undefined]];
        this.score = 0;
        this.penaltyCount = 0;
    }
}

Player.prototype.type = function(pos){
    return this.board[pos.x][pos.y];
}

Player.prototype.turn = function(factories, pile){
    //Randomly pick a tile from the tile storage
    let p = pile.length> 1 ? 1: 0; //factors in if there is anything in the pile. if there is adds that as an option
    let rand = Math.floor(Math.random() * factories.length+p);
    //Need to refactor this so it just calls one function
    if(rand == factories.length){
        let rand_color = pile[rand][Math.floor(Math.random() * pile[rand].length)];
        let tiles = pile[rand].filter(tile => tile == rand_color);
        //TODO: Need to make this truly random. start by checking for possible rows that can take all the tiles, pick random
        //If that can't be done, check for rows that can take some tiles, pick random
        //Finally if that cant' be done, add it to the penalties.
        for(let i=this.tile_board.length-1; i>=0; i--){
            if(this.tile_board[i][0] == undefined){
                for(let j=0; j<tiles.length; j++){
                    this.tile_board[i][j] = tiles[j];
                }
                break;
            }
        }

    }else{
        let rand_color = factories[rand][Math.floor(Math.random() * factories[rand].length)];
        let tiles = factories[rand].filter(tile => tile == rand_color);
        //TODO: Need to make this truly random. start by checking for possible rows that can take all the tiles, pick random
        //If that can't be done, check for rows that can take some tiles, pick random
        //Finally if that cant' be done, add it to the penalties.
        console.log(factories[rand]);
        for(let i=this.tile_board.length-1; i>=0; i--){
            if(this.tile_board[i][0] == undefined){
                for(let j=0; j<tiles.length; j++){
                    this.tile_board[i][j] = tiles[j];
                }
                break;
            }
        }
        console.log(this.tile_board);
    }

    factories.splice(rand, 1);
}

Player.prototype.test = function(pos){
    pos = new Vec(0,0);
    console.log(this.type(pos));
}

export {Player};