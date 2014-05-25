
var Matrix3 = function()
{
    this.mat = new Array(9);
    for (var i = 0; i < 9; ++i)
    {
        this.mat[i] = 0;
    }
}

module.exports = Matrix3;
var pro = Matrix3.prototype;

pro.rotation = function (radians)
{
    /*
     |  cos(A)  -sin(A)   0  |
     M = |  sin(A)   cos(A)   0  |
     |  0        0        1  |
     */

    var mat = this;

    mat[0] = Math.cos(radians);
    mat[1] = Math.sin(radians);
    mat[2] = 0.0;

    mat[3] = -Math.sin(radians);
    mat[4] = Math.cos(radians);
    mat[5] = 0.0;

    mat[6] = 0.0;
    mat[7] = 0.0;
    mat[8] = 1.0;
}