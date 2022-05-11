const {buildGraph} = require("./graph");
// "use strict";

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];
//convert the list of roads to a data structure that, for each place, tells us what can be reached from there.
// function buildGraph(edges) {
//     let graph = Object.create(null);
//     function addEdge(from, to) {
//         if (graph[from] == null) {
//             graph[from] = [to];
//         } else {
//             graph[from].push(to);
//         }
//     }
//     for (let [from, to] of edges.map(r => r.split("-"))) {
//         addEdge(from, to);
//         addEdge(to, from);
//     }
//     return graph;
// }

const roadGraph = buildGraph(roads);

class VillageState{
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return {place: destination, address: p.address};
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

function runRobot(state, robot, memory, showMoves=false) {
    for(let turn=0;;turn++){
        if(state.parcels.length == 0){
            if(showMoves)console.log(`Done in ${turn} turns`);
            return turn;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        if(showMoves)console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
};

// console.log("Random Robot");
// runRobot(VillageState.random(), randomRobot);

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

// console.log("Follows a predefined route");
// runRobot(VillageState.random(), routeRobot, []);

function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++) {
        let {at, route} = work[i];
        for (let place of graph[at]) {
            if (place == to) return route.concat(place);
            if (!work.some(w => w.at == place)) {
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return {direction: route[0], memory: route.slice(1)};
}

// console.log("Follows a goal-oriented route");
// runRobot(VillageState.random(), goalOrientedRobot, []);

function compareRobots(robot1, memory1, robot2, memory2) {
    let robot1turn=runRobot(VillageState.random(100), robot1, memory1);
    let robot2turn=runRobot(VillageState.random(100), robot2, memory2);

    console.log(`Robot 1 finished in ${robot1turn} turns`);
    console.log(`Robot 2 finished in ${robot2turn} turns`);
}

// compareRobots(goalOrientedRobot, [], randomRobot, []);

function simulateRobots(){
    let memory1 = [];
    let memory2 = [];
    let memory3 = [];
    let robot1 = randomRobot;
    let robot2 = goalOrientedRobot;
    let robot3 = routeRobot;

    //Run once during initialization
    let robot1turn = runRobot(VillageState.random(100), robot1, memory1);
    let robot2turn = runRobot(VillageState.random(100), robot2, memory2);
    let robot3turn = runRobot(VillageState.random(100), robot3, memory3);
    
    let turns=1;

    //Run 100 more times
    for(let i=0;i<100;i++){
        robot1turn += runRobot(VillageState.random(100), robot1, memory1);
        robot2turn += runRobot(VillageState.random(100), robot2, memory2);
        robot3turn += runRobot(VillageState.random(100), robot3, memory3);
        turns++;
    }

    // console.log(robot1turn, robot2turn, robot3turn);

    //Print the average number of turns
    console.log("Comparing 3 Simple Robot Algorithms")
    console.log("Robot 1 does random moves");
    console.log("Robot 2 will follow a predeteremind path until it is finished");
    console.log("Robot 3 will try and find the shortest route.")
    console.log("Each robot is given 100 parcels and the algorithm is run over 100 times. It then calculates the average");
    console.log("---------------------------------------------")
    console.log(`Robot 1 finished in average ${Number.parseFloat(robot1turn/turns).toFixed(0)} turns`);
    console.log(`Robot 2 finished in average  ${Number.parseFloat(robot2turn/turns).toFixed(0)} turns`);
    console.log(`Robot 3 finished in average  ${Number.parseFloat(robot3turn/turns).toFixed(0)} turns`);
}

simulateRobots();
