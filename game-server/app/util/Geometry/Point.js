
var Point= function(x, y)
{
    if (x === undefined)
    {
        this.x = 0;
    }
    else
    {
        this.x = x;
    }

    if (y === undefined)
    {
        this.y = 0;
    }
    else
    {
        this.y = y;
    }
}

module.exports = Point;
var pro = Point.prototype;


// @returns the angle in radians between this vector and the x axis
pro.getAngle = function()
{
    return Math.atan2(this.y, this.x);
};


pro.cross = function(v2) {
    var v1 = this;
    return v1.x * v2.y - v2.x * v1.y;
};



pro.dot = function(v2) {
    var v1 = this;
    return v1.x * v2.x + v1.y * v2.y;
}



pro.getLengthSq = function(v2) {
    var v1 = this;
    return (v2.x-v1.x) * (v2.x-v1.x) + (v2.y-v1.y) * (v2.y-v1.y);
}


pro.add = function(v2) {
    var v1 = this;
    return new Point(v1.x + v2.x, v1.y + v2.y);
}


pro.sub = function(v2) {
    var v1 = this;
    return new Point(v1.x - v2.x, v1.y - v2.y);
}


pro.multi = function(s) {
    var v1 = this;
    return new Point(v1.x * s, v1.y * s);
}


pro.clone = function() {
    return new Point(this.x, this.y);
}