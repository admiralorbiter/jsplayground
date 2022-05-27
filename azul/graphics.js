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
    let tr = "<tr><td>Pile</td>";
    for(let i=0; i<game.pile.length; i++){
        tr += "<td>" + game.pile[i] + "</td>";
    }
    t += tr + "</tr>";
    document.getElementById("factories").innerHTML += t;

    changeTextColor();
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

// function changeTextColor(id, col){
//     switch(col){
//         case 0:
//             document.getElementById(id).style.color = "red";
//             break;
//         case 1:
//             document.getElementById(id).style.color = "red";
//             break;
//         case 2:
//             document.getElementById(id).style.color = "red";
//             break;
//         case 3:
//             document.getElementById(id).style.color = "red";
//             break;
//         case 4:
//             document.getElementById(id).style.color = "red";
//             break;
// }

function changeTextColor(){
    let offset=0;
    let value = "row1";
    if(value=="row1") offset=0;
    else if(value=="row2") offset=1;
    else if(value=="row3") offset=2;
    else if(value=="row4") offset=3;
    else if(value=="pile") offset=4;
    
    // col[(i+offset)%5] = getColor(i, document.getElementById(value));
    console.log(document.getElementById("row1").querySelector("#col1").innerHTML);
}

function getColor(value, doc){
    if(value==0)return doc.style.color = "blue";
    else if(value==1)return doc.style.color = "yellow";
    else if(value==2)return doc.style.color = "red";
    else if(value==3)return doc.style.color = "black";
    else if(value==4)return doc.style.color = "white";
}
export {drawFactoriesAndPile, drawActor};