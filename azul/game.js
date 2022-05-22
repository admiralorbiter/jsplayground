import tileStorage from "./tileStorage.js";

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

export default Game;