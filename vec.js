class vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    plus(vec){
        return new vector(this.x + vec.x, this.y + vec.y);
    }

    minus(vec){
        return new vector(this.x - vec.x, this.y - vec.y);
    }

    get length(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

const vec = new vector(1,2);
console.log(vec.plus(new vector(2,3)));
console.log(vec.minus(new vector(2,3)));