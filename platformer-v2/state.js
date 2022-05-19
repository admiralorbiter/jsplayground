class State {
    constructor(level, actors, status) {
        this.level = level;
        this.actors = actors;
        this.status = status;
        this.level_select;
    }

    static start(level){
        return new State(level, level.startActors, "playing");
    }

    get player(){
        return this.actors.find(a => a.type == "player");
    }
}

/*
    Todo: This function is how I should change the level by changing the status/state
*/
State.prototype.update = function(time, keys) {
    let actors = this.actors.map(actor => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);
    if (newState.status != "playing") return newState;
    let player = newState.player;
    if(this.level.touches(player.pos, player.size, "lava")){
        return new State(this.level, actors, "lost");
    }

    for(let actor of actors){
        if(actor != player && overlap(actor, player)){
            newState = actor.collide(newState);
        }
    }
    return newState;
}

function overlap(actor, other){
    return actor.pos.x + actor.size.x > other.pos.x &&
              actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                    actor.pos.y < other.pos.y + other.size.y;
}

export default State;