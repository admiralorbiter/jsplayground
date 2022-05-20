/*
*   Class State: Keeps track of the state of the game
*   Level Object, Actor Array, Status, Level Select
*   @param level: Level object
*   @param actors: Array of Actor objects
*   @param status: String of the status of the game
*/
class State {
    constructor(level, actors, status) {
        this.level = level;
        this.actors = actors;
        this.status = status;
        this.level_select;
    }

    //Creates initial state based on level
    static start(level){
        return new State(level, level.startActors, "playing");
    }

    //Get player actor
    get player(){
        return this.actors.find(a => a.type == "player");
    }
}

/*
*  Update the state of the game
*/
State.prototype.update = function(time, keys) {
    let actors = this.actors.map(actor => actor.update(time, this, keys));  //Use map function to update each actor
    let newState = new State(this.level, actors, this.status);              //Create new state based in case of any changes
    if (newState.status != "playing") return newState;                      //If the status is not playing, return the new state
    let player = newState.player;                                           //Get the player actor using class method get player for new state
    if(this.level.touches(player.pos, player.size, "lava")){                //If the player is in lava, set the status to lost
        return new State(this.level, actors, "lost");
    }

    //Goes through each actor and checks if it is overlapping with any other actor
    for(let actor of actors){
        if(actor != player && overlap(actor, player)){
            newState = actor.collide(newState);                             //If it is overlapping, resolve via collide method on the actor
        }
    }
    return newState;                                                        //Return the new state
}

//Helper function to check if two actors overlap
function overlap(actor, other){
    return actor.pos.x + actor.size.x > other.pos.x &&
              actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                    actor.pos.y < other.pos.y + other.size.y;
}

export default State;