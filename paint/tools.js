function draw(pos, state, dispatch){
    function drawPixel({x, y}, state){
        let drawn = {x, y, color: state.color};
        dispatch({picture: state.picture.draw([drawn])});
    }
    drawPixel(pos, state);
    return drawPixel;
}

function rectangle(start, state, dispatch){
    function drawRectangle(pos){
        let xState = Math.min(start.x, pos.x);
        let yState = Math.min(start.y, pos.y);
        let xEnd = Math.max(start.x, pos.x);
        let yEnd = Math.max(start.y, pos.y);
        let drawn = [];
        for(let y = yState; y <= yEnd; y++){
            for(let x = xState; x <= xEnd; x++){
                drawn.push({x, y, color: state.color});
            }
        }
        dispatch({picture: state.picture.draw(drawn)});
    }
    drawRectangle(start);
    return drawRectangle;
}

const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function fill({x, y}, state, dispatch){
    let targetColor = state.picture.pixels(x, y);
    let drawn = [{x, y, color: state.color}];
    for(let done = 0; done < drawn.length; done++){
        for(let {dx, dy} of around){
            let x = drawn[done].x + dx, y = drawn[done].y + dy;
            if(x >= 0 && x < state.picture.width && y >= 0 && y < state.picture.height &&
                state.picture.pixels(x, y) == targetColor && !drawn.some(({x, y}) => x == x && y == y)){
                drawn.push({x, y, color: state.color});
            }
        }
    }
    dispatch({picture: state.picture.draw(drawn)});
}

function pick(pos, state, dispatch){
    dispatch({color: state.picture.pixels(pos.x, pos.y)});
}

export { draw, rectangle, fill, pick };