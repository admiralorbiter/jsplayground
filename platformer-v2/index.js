import config from "./settings.config.js";
import State from "./state.js";
import {GAME_LEVELS, GAME_LEVELS_TEST} from "./levels.js";
import {CanvasDisplay} from "./canvasDisplay.js";
import {Level} from "./level.js";

let state;
let level_select;

/*
    Main Function used to initialize and start the game
*/
function main() {
    // Changes the Level Title to the current level
    let gameLevels = GAME_LEVELS_TEST;
    document.getElementById("level").innerHTML = "Level "+config.level.toString();
    for(let i=0; i<gameLevels.length; i++){
        console.log("level", i);
        $("#level-select").append($("<option></option>").attr("value", i).text("Level "+i.toString()));
    }

    setup(gameLevels, CanvasDisplay);
}

/*
    Setup for the game in case the level is selected.
    Note that level_select is the last variable and can be left out when calling runGame
*/
async function setup(plans, display, level_select){
    if(level_select == undefined){
        for(let level=0; level<plans.length;){
           await runGame(plans, display, level);
           console.log("level", level);
        }
    }else{
       await runGame(plans, display, level_select);
    }
}

/*
    Runs the game.
*/
async function runGame(plans, display, level) {
    while(level < plans.length){
        console.log("starting level", level);
        let status = await runLevel(new Level(plans[level]), display);
        console.log("status", status);
        if (status == "won"){
            level=level+1;
            // status=await runLevel(new Level(plans[level + 1]), display);
        }
        if (status == "new_level"){
            console.log("new level", level_select);
            // status = await runLevel(new Level(plans[level_select]), display);
            level=parseInt(level_select);
        }
    }
    console.log("You've won!");
    console.log("level", level);
}

function runLevel(level, display){
    display = new display(document.body, level);
    state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
        runAnimation(time => {
                    state = state.update(time, arrowKeys);
                    display.syncState(state);
                    
                    if (state.status == "playing") {
                        return true;
                    } else if (ending > 0) {
                        ending -= time;
                        return true;
                    } else {
                        display.clear();
                        resolve(state.status);
                        return false;
                    }
        });
    });
}

function runAnimation(frameFunc) {
    let lastTime = null;
    function frame(time) {
        if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            if (frameFunc(timeStep) === false) return;
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function onchange(e){
    if(e.currentTarget.value != e.level){
        document.getElementById("level").innerHTML = "Level "+config.level.toString();
        state.status = "new_level";
        level_select = e.currentTarget.value;
    }
}
document.getElementById("level-select").addEventListener("change", onchange);

function trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
        if (keys.includes(event.key)) {
            down[event.key] = event.type == "keydown";
            event.preventDefault();
        }else{
            console.log("invalid key ", event.key);
        }
    }
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    return down;
}

const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

main();