/*
    Vector class for simple vector calculations
*/
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(vec) {
        return new Vec(this.x + vec.x, this.y + vec.y);
    }

    minus(vec) {
        return new Vec(this.x - vec.x, this.y - vec.y);
    }

    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
      }
}

export default Vec;