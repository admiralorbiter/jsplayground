import tileStorage from "./tileStorage.js";
import {Player} from "./player.js";

class Game{
    constructor(players, tileStorage){
        this.players = players;
        this.tileStorage = tileStorage;

        this.factories = [];
        this.factorNum=0;
        this.pile = [-1];
        if(this.players.length == 2){
           this.factorNum=5;
        }else if(this.players.length == 3){
            this.factorNum=7;
        }else if(this.players.length == 4){
            this.factorNum=9;
        }
    }

    drawFactories(){
        this.factories = [];
        for(let i=0; i<this.factorNum; i++){
            this.factories.push(this.tileStorage.drawTiles(4));
        }
        return this.factories;
    }
}

Game.prototype.checkStatus = function(turn){
    let status = "playing";
    if(this.factories.length == 0){
        if(this.pile.length == 0){
            // test();
            console.log("game over");
            return "round_over";
        }
    }
    // console.log(turn);
    if(turn>=20)return "game_over"; //TESTING ONLY - only to do turn>=20 because sometimes it skips 20 if it is gameover due to the above branch
    return status;
}

export default Game;