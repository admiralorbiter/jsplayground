import {Player} from "./player.js";
import tileStorage from "./tileStorage.js";
import Game from "./game.js";
import {drawFactoriesAndPile, drawActor} from "./graphics.js";

let player = new Player();
let opp = new Player();
let actors = [player, opp];
let tile_storage = new tileStorage();
let game = new Game(actors, tile_storage);
let turn = 0;
let actions =0; //TESTING ONLY
game.drawFactories();
let status = game.checkStatus();

drawFactoriesAndPile(game);

while(status == "playing"){
    document.getElementById("title").innerHTML = "Status: " + status;
    drawFactoriesAndPile(game);
    if(turn == 0){
        //player turn
        player.turn(game.factories, game.pile);
        drawActor("player", player);
        
    }else if(turn == 1){
        //opp turn
        opp.turn(game.factories, game.pile);
        drawActor("opponent", opp);
    }
    turn = (turn + 1) % 2;
    // console.log(game.factories);
    status = game.checkStatus(actions);
    actions++;
    await delay();
    // console.log(status+ " "+actions+ " "+turn);
}
document.getElementById("title").innerHTML = "Status: " + status;
actors.forEach(actor => {if(actor.checkEndCondition())status="game_over"});
actors.forEach(actor => actor.processTileBoard());
// actors.forEach(actor => console.log("A: "+actor.board));
drawActor("player", player);
drawActor("opponent", opp);
document.getElementById("title").innerHTML = "Status: " + status;
// for(let i=0; i<this.players.length; i++){
//     if(this.players[i].checkEndCondition()==true)status="game_over";
// }

drawFactoriesAndPile(game);

async function delay() {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

//check conditions

