var Rect = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}

module.exports = Rect;
var pro = Rect.prototype;


pro.containsPoint = function (point) {
    var bRet = false;

    if (point.x >= this.getMinX() && point.x <= this.getMaxX()
        && point.y >= this.getMinY() && point.y <= this.getMaxY()) {
        bRet = true;
    }

    return bRet;
}


pro.getMaxX = function () {
    return this.x + this.width;
}

pro.getMidX = function () {
    return this.x + this.width / 2.0;
}

pro.getMinX = function () {
    return this.x;
}

pro.getMaxY = function () {
    return this.y + this.height;
}

pro.getMidY = function () {
    return this.y + this.height / 2.0;
}

pro.getMinY = function () {
    return this.y;
}