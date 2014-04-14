var utils = require('../util/utils');

var exp = module.exports;

var players = {};

exp.addPlayer = function(opt) {
    if (players[opt.uid]) {
        return false;
    }

    players[opt.uid] = opt;

    return true;
};



exp.removePlayer = function(opt){
    if (!players[opt.uid]){
        return false;
    }

    delete players[opt.uid];

    return true;
}


exp.checkPair = function(callback)
{
    var p1, p2;
    var arr = new Array();
    var len = 0;
    for (var p in players)
    {
        arr.push(p);
    }

    if (arr.length >= 2)
    {
        p1 = players[arr.pop()];
        p2 = players[arr.pop()];

        utils.invokeCallback(callback, {uid:p1.uid, sid:p1.sid}, {uid:p2.uid, sid:p2.sid});

        delete players[p1.uid];
        delete players[p2.uid];
    }
}