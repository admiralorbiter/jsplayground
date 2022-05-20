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
    //Todo: Add selection for which levels to play
    //Change this to decide which group of levels to play
    let gameLevels = GAME_LEVELS_TEST;
    //Todo: Add selection for which display method to use
    let display = CanvasDisplay;

    // Initializes the Level Title to the current level
    document.getElementById("level").innerHTML = "Level "+config.level.toString();

    // Initializes the Level Selector based on the number of levels
    for(let i=0; i<gameLevels.length; i++){
        console.log("level", i);
        $("#level-select").append($("<option></option>").attr("value", i).text("Level "+i.toString()));
    }

    // Begins setup based on selected game levels and display method
    setup(gameLevels, display, config.level);
}

/*
    Setup: allows for starting level configuration in the settings file. Ex: level: 1
    Note that level_select is the last variable and can be left out when calling runGame
*/
async function setup(plans, display, level_select) {
        let level=0;
        if(level_select != level)level=level_select;                        //checks for level_select
        await runGame(plans, display, level);                               //runs the game in async waiting for game to finish
        //Todo: add stuff here to tell user their results
}

/*
    Runs the game while the current level is within range of the gameLevels number
    Note: new game status like pause, save, load will probably need to be resolved here
*/
async function runGame(plans, display, level) {
    //Checks current level below the number of levels in the game
    while(level < plans.length){
        console.log("starting level", level);                               //testing purposes        
        document.getElementById("level").innerHTML = "Level "+level;        //Changes title based on the level          
        let status = await runLevel(new Level(plans[level]), display);      //runs the level waiting for it to finish
        if (status == "won")level=level+1;                                  //if status is won, go to next level by incrementing by one
        if (status == "new_level"){                                         //if user picked a new level, set level to selected value
            console.log("new level", level_select);                         //testing purposes
            level=parseInt(level_select);                                   //parseInt is used to convert string to int so 1+1=2 and not 11
        }
    }
}

/*
    Runs the level and returns the status of the level
    Note (for students): The return statements are to break out of the function, the resolve is the true return value
    Note: new game status like pause, save, load will probably need to be added here
*/
function runLevel(level, display){
    display = new display(document.body, level);                            //creates display on the dom body
    state = State.start(level);                                             //Initializes state based on level
    let ending = 1;                                                         //Defines the 1 second interval for ending the level
    //Runs the animation until the status is changed
    return new Promise(resolve => {
        runAnimation(time => {
                    state = state.update(time, arrowKeys);
                    display.syncState(state);
                    
                    if (state.status == "playing") {
                        return true;
                    } else if (ending > 0) {                                //First branch for status change
                        ending -= time;                                     //Waits one second to let user see change before moving on
                        return true;
                    } else {                                                //Second Branch if status has changed (only after 1 second)
                        display.clear();                                    //clears the display    
                        resolve(state.status);                              //resolves the promise returning the status
                        return false;
                    }
        });
    });
}

/*
    Animation Function
    Expects a time difference as the argument and draws a single frame
    Note: When frame function returns false, the animation stops
*/
function runAnimation(frameFunc) {
    let lastTime = null;
    let fps = 100;                                                        //sets the maximum frame step of 100 milliseconds (1/10 second)
    function frame(time) {
        if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, fps) / 1000;
            if (frameFunc(timeStep) === false) return;
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

//This function is to update the document based on change to the level-select component in index.html
function onchange(e){
    //If the user selects a new level, set the level to the selected value
    if(e.currentTarget.value != e.level){
        state.status = "new_level";                                         //sets the status to new level
        level_select = e.currentTarget.value;                               //sets the level_select to the selected value
    }
}
//Adds event listeners to the level-select component to update based on change
document.getElementById("level-select").addEventListener("change", onchange);

//This function is used to track key presses
function trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
        if (keys.includes(event.key)) {
            down[event.key] = event.type == "keydown";                      //if the key is in the keys array, set the key to true or false
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