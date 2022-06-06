import Game from "./game.js"
import {Player} from "./player.js";
import tileStorage from "./tileStorage.js";

let player = new Player();
let opp = new Player();
let actors = [player, opp];
let tile_storage = new tileStorage();
let game = new Game(actors, tile_storage);

let playerTiles=[];
let pAction = 0;
let oppTiles=[];
let oAction = 0;
let turn = 0;

// test_length();
test_score();

function generateTiles(){
    let tiles = [];
    let test=0;
    game.drawFactories();
    for(let i=0; i<game.factories.length; i++){
        game.factories[i].sort();
        // tiles.push(game.factories[i]);
        test=0;
        while(game.factories[i].length!=0){
            let x = game.factories[i][0];
            let t = [];
            while(game.factories[i][0]==x && game.factories[i][0]!=undefined){
                t.push(x);
                game.factories[i].shift();
                // console.log(t);
            }
            tiles.push(t);
            // console.log(game.factories);
        }
    }
    // console.log(tiles);
    // console.log(game.factories);
    return tiles;
}

function test_length(){
    let biggest = 0;
    let smallest = 100;
    let sum=0;
    let count=10000;
    for(let i=0; i<count; i++){
        let tiles = generateTiles();
        if(tiles.length>biggest)biggest=tiles.length;
        if(tiles.length<smallest)smallest=tiles.length;
        sum+=tiles.length;
    }
    console.log(`Biggest: ${biggest}`);
    console.log(`Smallest: ${smallest}`);
    console.log(`Average: ${sum/count}`);
}

function test_score(){
    let tiles = generateTiles();
    //cycle through all combinations of tiles
    let p = [];
    for(let hold=0; hold<tiles.length; hold++){
        for(let shift=0; shift<tiles.length; shift++){
            p = [];
            p.push(tiles[hold]);
            for(let i=0; i<tiles.length/2; i++){
                p.push(tiles[(hold+i+shift)%tiles.length]);
                // console.log(tiles[(hold+i+shift)%tiles.length], i+hold+shift);
            }
            //send this to a function to calculate score
            let score = calculateScore(p);
            // console.log(p);
        }
    }
    console.log(tiles);
}

function calculateScore(tiles){
    console.log(JSON.stringify(tiles));
}
// game.pile.shift();

// for(let pileBreak=0; pileBreak<5; pileBreak++){
//     for(let p1=0; p1<5; p1++){
//         for( let p2=0; p2<5; p2++){
//             game.drawFactories();
//             while(game.factories.length!=0 && game.pile.length!=0){
//                 if(turn%2==0){
//                     pickTiles(playerTiles, pileBreak, p1);
//                 }else{
//                     pickTiles(oppTiles, oAction);
//                 }
//                 turn++;
//             }
//         }
//     }
// }

// game.drawFactories();
// for(let pileBreak=0; pileBreak<5; pileBreak++){
//     for(let p1=0; p1<5; p1++){
//         for( let p2=0; p2<5; p2++){
//             turn=0;
//             game.drawFactories();
//             while(game.factories.length!=0 || game.pile.length!=0){
//                 if(turn%2==0){
//                     pickTiles(playerTiles, pileBreak, p1);
//                 }else{
//                     pickTiles(oppTiles, pileBreak, p2);
//                 }
//                 turn++;
//             }
//         }
//     }
// }

// while(game.factories.length!=0 && game.pile.length!=0){
//     if(turn%2==0){
//         pickTiles(playerTiles, 0, 0);
//     }else{
//         pickTiles(oppTiles, oAction);
//     }
//     turn++;
// }

//NOTE DRAW FIRST FACTORY AND JUST CHANGE ORDER OF FACTORIES EACH ITERATION
function pickTiles(arr, pileBreak, pNum){
    if(pileBreak>=turn && game.pile.length!=0){
        if(pAction%pNum==0){
            //draw pile
            console.log("Draw Pile");
            drawPile();
            
        }else{
            if(game.factories.length!=0){
                // console.log("Draw Factory");
                drawFactories();
            }else{
                console.log("Draw Pile");
                drawPile();
            }
        }
    }else{
        // console.log("Draw Factory");
        if(game.factories.length!=0)
            drawFactories();
        else
            drawPile();
    }
}

function drawPile(){
    // console.log(game.pile);
    let rand_color = game.pile[Math.floor(Math.random() * game.pile.length)];
    let tiles = game.pile.filter(tile => tile == rand_color);

}

function drawFactories(){
    // console.log(game.factories);     
    let rand_color = game.factories[0][Math.floor(Math.random() * game.factories[0].length)];
    let taken_tiles = game.factories[0].filter(tile => tile == rand_color);
    let pile_tiles = game.factories[0].filter(tile => tile != rand_color);
    game.pile.push(...pile_tiles);
    game.factories.splice(0, 1);
}