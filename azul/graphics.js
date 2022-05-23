function drawFactoriesAndPile(game){
    document.getElementById("factories").innerHTML = "";
    let t = "";
    for(let i=0; i<game.factories.length; i++){
        let tr = "<tr>";
        tr += "<td>" + game.factories[i][0] + "</td>";
        tr += "<td>" + game.factories[i][1] + "</td>";
        tr += "<td>" + game.factories[i][2] + "</td>";
        tr += "<td>" + game.factories[i][3] + "</td>";
        t += tr + "</tr>";
    }
    let tr = "<tr><td>Pile</td>";
    for(let i=0; i<game.pile.length; i++){
        tr += "<td>" + game.pile[i] + "</td>";
    }
    t += tr + "</tr>";
    document.getElementById("factories").innerHTML += t;
}

function drawActor(id, player){
    document.getElementById(id).innerHTML = "";
    let s = id+"<br>";
    for(let i=0; i<player.tile_board.length; i++){
        s += player.tile_board[i] + "<br>";
    }
    document.getElementById(id).innerHTML += s;
}

export {drawFactoriesAndPile, drawActor};