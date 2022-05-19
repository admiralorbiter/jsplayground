import config from "./settings.config.js";
import State from "./state.js";
import {GAME_LEVELS} from "./levels.js";
import {CanvasDisplay} from "./canvasDisplay.js";
import {Level} from "./level.js";

/*
    Main Function used to initialize and start the game
*/
function main() {
    // Changes the Level Title to the current level
    document.getElementById("level").innerHTML = "Level "+config.level.toString();
    setup(GAME_LEVELS, CanvasDisplay);
}

/*
    Setup for the game in case the level is selected.
    Note that level_select is the last variable and can be left out when calling runGame
*/
function setup(plans, display, level_select){
    if(level == undefined){
        for(let level=0; level<plans.length;){
            runGame(plans, display, level);
        }
    }else{
        runGame(plans, display, level_select);
    }
}

/*
    Runs the game.
*/
async function runGame(plans, display, level) {
    let status = await runLevel(new Level(plans[level]), display);
    if (status == "won") level++;
    if (status == "new_level"){
        level = level_select;
        console.log("new level", level);
        status = await runLevel(new Level(plans[level]), display);
    }
}

function runLevel(level, display){
    display = new display(document.body, level);
    let state = State.start(level);
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