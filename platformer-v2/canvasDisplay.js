import config from "./settings.config.js";

class CanvasDisplay{
    constructor(parent, level){
        let scale = config.scale;
        this.canvas = document.createElement("canvas");             //create a canvas element
        this.canvas.width = Math.min(600, level.width * scale);     //set the width of the canvas to the width of the level
        this.canvas.height = Math.min(450, level.height * scale);   //set the height of the canvas to the height of the level
        parent.appendChild(this.canvas);                            //append the canvas to the parent element
        this.cx = this.canvas.getContext("2d");                     //creates object for 2d rendering

        this.flipPlayer = false;                                    //class variable to keep track of player direction ToDo: make this a a player variable

        this.viewport = {                                           //create a viewport object based on canvas and scale size
            left: 0,
            top: 0,
            width: this.canvas.width / scale,
            height: this.canvas.height / scale
        };
    }

    clear(){                                                        //clear the canvas
        this.canvas.remove();
    }
}

export {CanvasDisplay};