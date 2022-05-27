function drawFactoriesAndPile(game){
    document.getElementById("factories").innerHTML = "";
    let t = "";
    for(let i=0; i<game.factories.length; i++){
        let tr = "<tr id='row"+i+"'>";
        tr += "<td> Row "+i+": </td>";
        tr += "<td id='col1'>" + game.factories[i][0] + "</td>";
        tr += "<td id='col2'>" + game.factories[i][1] + "</td>";
        tr += "<td id='col3'>" + game.factories[i][2] + "</td>";
        tr += "<td id='col4'>" + game.factories[i][3] + "</td>";
        t += tr + "</tr>";
    }
    let tr = "<tr id='pile'><td>Pile</td>";
    for(let i=0; i<game.pile.length; i++){
        tr += "<td id='p"+i+"'>" + game.pile[i] + "</td>";
        // getColor(game.pile[i], document.getElementById("p"+(i)));
    }
    t += tr + "</tr>";
    document.getElementById("factories").innerHTML += t;

    for(let i=0; i<game.pile.length; i++){
        // console.log(document.getElementById("p"+(i)).innerHTML);
        getColor(game.pile[i], document.getElementById("p"+(i)));
    }

    for(let i=0; i<game.factories.length; i++){
        changeTextColor(i, 1);
        changeTextColor(i, 2);
        changeTextColor(i, 3);
        changeTextColor(i, 4);
    }
}

function drawActor(id, player){
    document.getElementById(id).innerHTML = "";
    let s = id+"<br>";
    for(let i=0; i<player.tile_board.length; i++){
        s += player.tile_board[i] + "<br>";
    }
    document.getElementById(id).innerHTML += s;
    s = "Board: <br>";
    for(let i=0; i<player.board.length; i++){
        s += player.board[i] + "<br>";
    }
    document.getElementById(id).innerHTML += s;
    
}

function changeTextColor(i, j){
    let r = "row"+(i);
    let c = "#col"+(j);
    // console.log(i, j);
    let m = document.getElementById(r).querySelector(c);
    // console.log(getColor(m.innerHTML, m));
    getColor(m.innerHTML, m);

    // col[(i+offset)%5] = getColor(i, document.getElementById(value));
    // let m = document.getElementById("row1").querySelector("#col1");
    // console.log(document.getElementById("row1").querySelector("#col1").innerHTML);
    // console.log(getColor(m.innerHTML, m));
}

function getColor(value, doc){
    if(value==0)return doc.style.color = "blue";
    else if(value==1)return doc.style.color = "yellow";
    else if(value==2)return doc.style.color = "red";
    else if(value==3)return doc.style.color = "black";
    else if(value==4)return doc.style.color = "white";
}
export {drawFactoriesAndPile, drawActor};