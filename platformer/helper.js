import {Level} from "./level.js";
import {State} from "./state.js";
import {CanvasDisplay} from "./canvasDisplay.js";
import config from "./settings.config.js";
import {GAME_LEVELS} from "./levels.js";
let display;
let state;
let level_select;

function elt(name, attrs, ...children) {
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    for (let child of children) {
        dom.appendChild(child);
    }
    return dom;
}

const scale = 20;

function drawGrid(level) {
    return elt("table", {
        class: "background",
        style: `width: ${level.width * scale}px`
    }, ...level.rows.map(row =>
        elt("tr", {style: `height: ${scale}px`},
            ...row.map(type => elt("td", {class: type})))
    ));
}

function drawActor(actors) {
    return elt("div", {}, ...actors.map(actor => {
        let rect = elt("div", {class: `actor ${actor.type}`});
        rect.style.width = `${actor.size.x * scale}px`;
        rect.style.height = `${actor.size.y * scale}px`;
        rect.style.left = `${actor.pos.x * scale}px`;
        rect.style.top = `${actor.pos.y * scale}px`;
        return rect;
    }));
}

class DOMDisplay{
    constructor(parent, level){
        this.dom = elt("div", {class: "game"}, drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }

    clear(){this.dom.remove();}
}

DOMDisplay.prototype.syncState = function(state) {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = drawActor(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3;

    //viewport
    let left = this.dom.offsetLeft;
    let top = this.dom.offsetTop;

    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5))
                         .times(scale);

    if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin;
    } else if (center.x > left + width - margin) {
        this.dom.scrollLeft = center.x + margin - width;
    }

    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
    } else if (center.y > top + height - margin) {
        this.dom.scrollTop = center.y + margin - height;
    }
};

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

function runLevel(level, Display) {
    display = new Display(document.body, level);
    state = State.start(level);
    console.log(state);
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
async function runGame(plans, display, level) {
    if(level == undefined){
        for (let level = 0; level < plans.length;) {
            let status = await runLevel(new Level(plans[level]), display);
            if (status == "won") level++;
            if (status == "new_level"){
                level = level_select;
                console.log("new level", level);
                status = await runLevel(new Level(plans[level]), display);
            }
        }
        console.log("You've won!");
    }else{
        let status = await runLevel(new Level(plans[level]), display);
        if (status == "won") level++;
        if (status == "new_level") level = status.level_select;
    }
}

function onchange(e){
    // console.log(e.target.value);
    if(e.currentTarget.value != config.level){
        config.level = e.currentTarget.value;
        document.getElementById("level").innerHTML = "Level "+config.level.toString();
        // game = runGame(GAME_LEVELS, display);
        // CanvasDisplay.syncState(State.start(GAME_LEVELS[config.level]));
        console.log("level changed to ", config.level);
        // display.syncState(State.start(GAME_LEVELS[config.level]));
        // display.canvas.remove();
        state.status = "new_level";
        level_select = config.level-1;
        // runGame(GAME_LEVELS, CanvasDisplay, config.level-1);
    }
}
document.getElementById("level-select").addEventListener("change", onchange);

export{elt, DOMDisplay, drawGrid, drawActor, runAnimation, runGame, scale};