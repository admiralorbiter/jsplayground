import {Player} from "./player.js";
import tileStorage from "./tileStorage.js";
import Game from "./game.js";

let player = new Player();
let opp = new Player();
let actors = [player, opp];
let tile_storage = new tileStorage();
let game = new Game(actors, tile_storage);
let turn = 0;
game.drawFactories();
console.log(game.factories);
if(turn == 0){
    //player turn
    player.turn(game.factories, game.pile);
}else if(turn == 1){
    //opp turn
}
turn = (turn + 1) % 2;
console.log(game.factories);

//check conditions

