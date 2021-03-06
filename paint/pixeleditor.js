import {PictureCanvas}  from "./picturecanvas.js";
// import {PictureCanvas} from "./test.js";
import {elt} from "./helper.js";

class PixelEditor{
    constructor(state, config){
        let {tools, controls, dispatch} = config;
        this.state = state;

        this.canvas = new PictureCanvas(state.picture, pos => {
            let tool = tools[this.state.tool];
            let onMove = tool(pos, this.state, dispatch);
            if (onMove) return pos => onMove(pos, this.state);
        });

        this.controls = controls.map(Control => new Control(state, config));
        this.dom = elt("div", {}, this.canvas.dom, elt("br"),
            ...this.controls.reduce((a, c) => a.concat(c.dom), []));
    }
    syncState(state){
        this.state = state;
        this.canvas.syncState(state.picture);
        for(let control of this.controls) control.syncState(state);
    }
}

export { PixelEditor };