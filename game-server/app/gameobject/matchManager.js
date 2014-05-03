var utils = require('../util/utils');
var geometry = require('../util/geometry');

var exp = module.exports;

var matchs = {};

var globalToken = 0;

var getOtherSide = function (side) {
    if (side == 0) return 1;
    if (side == 1) return 0;

    console.log("wrong side!");

    return -1;
}

exp.updateMatch = function (token, callback) {
    var currentTime = utils.getTimeInUint32();

    var mc = matchs[token];
    if (mc) {
        var dt = currentTime - mc.lastUpdateTime;
        if (dt >= 1000) {
            mc.lastUpdateTime = currentTime;
            var p = mc.p[mc.attackSide];
            var op = mc.p[getOtherSide(mc.attackSide)];
            var v1 = p.position[mc.ball];
            var defplayer = [];
            for (var i = 0; i < op.position.length; ++i) {
                var dist = geometry.getLengthSq(v1, op.position[i]);
                if (dist < 1600)    // 40 * 40 （距离40以内）
                {
                    defplayer.push(i);
                }
            }

            if (defplayer.length == 0) {
                mc.encounterTime = -1;
            }
            else if (defplayer.length >= 4) {
                utils.invokeCallback(callback, null, mc.ball, defplayer);
                mc.encounterTime = -1;
            }
            else if (defplayer.length > 0) {
                if (mc.encounterTime < 0) {
                    mc.encounterTime = 2000;        // 2 second
                }
                mc.encounterTime -= dt;
                if (mc.encounterTime < 0) {
                    utils.invokeCallback(callback, null, mc.ball, defplayer);
                }
            }
        }
    }
}


exp.createMatch = function (p1, p2, time, callback) {
    // TODO: token生成算法
    var token = ++globalToken;

    if (matchs[token]) {
        utils.invokeCallback(callback, new Error('wrong match token'));
        return;
    }

    p1['ready'] = false;
    p1['position'] = [];
    p1['lastSyncTime'] = 0;
    p1['score'] = 0;
    p2['ready'] = false;
    p2['position'] = [];
    p2['lastSyncTime'] = 0;
    p2['score'] = 0;

    var mc = {p: [p1, p2], ball: 0, attackSide: 0, syncCount: 0, encounterTime: -1, lastUpdateTime: 0, token: token, createdTime: time, startTime: 0};

    matchs[token] = mc;

    utils.invokeCallback(callback, null, token);
}


exp.destroyMatch = function (token, callback) {
    var p;
    var mc = matchs[token];
    if (mc) {
        delete matchs[token];
        utils.invokeCallback(callback, null, mc.p);

        return;
    }

    utils.invokeCallback(callback, null, null);
}


exp.update = function (dt, callback) {
    // TODO: 检查超时比赛
}


exp.checkToken = function (token, callback) {
    if (matchs[token]) {
        utils.invokeCallback(callback, null);
        return;
    }

    utils.invokeCallback(callback, new Error('invalid token'));
}


exp.ready = function (token, uid, callback) {
    var mc = matchs[token];

    var i;
    var readyCount = 0;
    for (i = 0; i < mc.p.length; ++i) {
        if (mc.p[i].uid == uid) {
            mc.p[i].ready = true;
            readyCount++;
        }
        else if (!!mc.p[i].ready) {
            readyCount++;
        }
    }


    if (readyCount >= 2) {

        var t = utils.getTimeInUint32();
        t += 5000;
        var k = utils.getRandom(2);
        var s = utils.getRandom(2);

        console.log(k + ' : ' + s);

        if (s == 0) {
            mc.p.reverse();
        }

        mc.attackSide = k;
        mc.startTime = t;
        mc.lastUpdateTime = t;

        utils.invokeCallback(callback, null, true, mc.p, k, t);

        return;
    }

    utils.invokeCallback(callback, null, false);
}


exp.getOpponent = function (token, uid, callback) {
    var mc = matchs[token];
    var p;
    if (mc.p[0].uid == uid) {
        p = mc.p[1];
    }
    else if (mc.p[1].uid == uid) {
        p = mc.p[0];
    }
    else {
        utils.invokeCallback(callback, new Error('uid error!'));
        return;
    }

    utils.invokeCallback(callback, null, [p]);
}


exp.syncPlayerPos = function (token, uid, teamPos, ballPos, timeStamp, callback) {
    var mc = matchs[token];
    var p;
    var attack = false;
    if (mc.p[0].uid == uid) {
        p = mc.p[0];
        if (mc.attackSide == 0) {
            attack = true;
        }
    }
    else if (mc.p[1].uid == uid) {
        p = mc.p[1];
        if (mc.attackSide == 1) {
            attack = true;
        }
    }

    if (attack) {
        mc.ball = ballPos;
    }

    var i = 0;
    p.position = [];
    for (i = 0; i < teamPos.length; i += 4) {
        p.position.push({x: teamPos[i], y: teamPos[i + 1]});
    }

    p.lastSyncTime = timeStamp;

    mc.syncCount++;

    utils.invokeCallback(callback, null);
}
