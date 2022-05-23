class tileStorage {
    constructor() {
        // this.pile = [];
        // for(let i=0; i<5; i++){
        //     for(let j=0; j<20; j++){
        //         this.pile.push(i);
        //     }
        // }
        this.reset();
    }

    get pileSize(){
        return this.pile.length;
    }

    reset(){
        this.pile = [];
        for(let i=0; i<5; i++){
            for(let j=0; j<20; j++){
                this.pile.push(i);
            }
        }
    }
}

tileStorage.prototype.drawTiles = function(n){
    if(this.pile.length < n){
        this.reset();
    }
    this.arr = [];
    for(let i=0; i<n; i++){
        let rand = Math.floor(Math.random() * this.pile.length);
        this.arr.push(parseInt(this.pile.splice(rand, 1)));
    }
    return this.arr;
}

export default tileStorage;