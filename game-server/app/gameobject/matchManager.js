var utils = require('../util/utils');
var geometry = require('../util/geometry');
var matchDefs = require('../shared/matchDefs');

var exp = module.exports;

var matchs = {};
var globalToken = 0;
var g_lastUpdateTime = 0;

var getOtherSide = function (side) {
    if (side == 0) return 1;
    if (side == 1) return 0;

    console.log("wrong side!");

    return -1;
}


var updateDefendPlayerAroundBall = function (mc) {
    mc.defplayer = [];
    var p = mc.p[mc.attackSide];
    var op = mc.p[getOtherSide(mc.attackSide)];
    var v1 = p.position[mc.ball];
    for (var i = 0; i < op.position.length; ++i) {
        var dist = geometry.getLengthSq(v1, op.position[i]);
        if (dist < 1600)    // 40 * 40 （距离40以内）
        {
            mc.defplayer.push(i);
        }
    }
}

var checkEncounterInDribble = function (mc, dt, callback) {

    if (mc.defplayer.length == 0) {
        mc.encounterTime = -1;
    }
    else if (mc.defplayer.length >= 4) {
        var u1 = mc.p[mc.attackSide];
        var u2 = mc.p[getOtherSide(mc.attackSide)];

        u1.menuType = matchDefs.MENU_TYPE.ENCOUNTER_ATK_G;
        u2.menuType = matchDefs.MENU_TYPE.ENCOUTNER_DEF_G;
        utils.invokeCallback(callback, u1, u2, [mc.ball], mc.defplayer);
        mc.encounterTime = -1;
        return true;
    }
    else if (mc.defplayer.length > 0) {
        if (mc.encounterTime < 0) {
            mc.encounterTime = 2000;        // 2 second
        }
        mc.encounterTime -= dt;
        if (mc.encounterTime < 0) {
            var u1 = mc.p[mc.attackSide];
            var u2 = mc.p[getOtherSide(mc.attackSide)];

            u1.menuType = matchDefs.MENU_TYPE.ENCOUNTER_ATK_G;
            u2.menuType = matchDefs.MENU_TYPE.ENCOUTNER_DEF_G;
            utils.invokeCallback(callback, u1, u2, [mc.ball], mc.defplayer);
            return true;
        }
    }

    return false;
}


var checkEncounterInPenaltyArea = function (mc, callback) {
    // TODO: 进攻方对方禁区拿球，强制触发一次空中遭遇。仅当传球，二过一，随机球 刚刚结束，否则直接返回。

}

var updateMatch = function (dt, mc, callbacks) {

    mc.pauseTime -= dt;
    if (mc.pauseTime > 0)
    {
        return;
    }

    if (mc.p[0].position === undefined || mc.p[1].position === undefined ||
        mc.p[0].length == 0 || mc.p[1].length == 0)
    {
        return;
    }

    updateDefendPlayerAroundBall(mc);
    if (checkEncounterInDribble(mc, dt, callbacks.triggerMenu)) {
        mc.pauseTime = 20 * 1000;   // 20秒暂停时间
        return;
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
    p1['menu'] = matchDefs.MENU_TYPE.NONE;
    p2['ready'] = false;
    p2['position'] = [];
    p2['lastSyncTime'] = 0;
    p2['score'] = 0;
    p2['menu'] = matchDefs.MENU_TYPE.NONE;

    var mc = {p: [p1, p2], ball: 0, attackSide: 0, syncCount: 0, encounterTime: -1, token: token, createdTime: time, startTime: 0, pauseTime : 0};

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


//exp.update = function (dt, callback) {
//    // TODO: 检查超时比赛
//}

// 检查Match状态，负责推送GameStart和比赛超时结束的消息
var checkMatchStatus = function (dt, mc, callbacks) {
    if (mc.startTime == 0)  // 比赛未开始
    {
        var ready = false;
        for (var i in mc.p) {
            ready |= mc.p[i].ready;
        }

        if (ready)  // 双方都Ready了
        {
            var t = utils.getTimeInUint32();
            t += 5000;
            var k = utils.getRandom(2);
            var s = utils.getRandom(2);

            if (s == 0) {
                mc.p.reverse();
            }

            mc.attackSide = k;
            mc.startTime = t;
            mc.lastUpdateTime = t;

            callbacks.startMatch(mc.p, k, t);
        }
    }
    else
    {
        // TODO: 比赛中，要检查超时，适时销毁比赛对象
    }
}


exp.update = function (callbacks) {

    var dt = 0;
    var ct = utils.getTimeInUint32();
    if (g_lastUpdateTime > 0)
    {
        dt = ct - g_lastUpdateTime;
    }
    g_lastUpdateTime = ct;

    for (var i in matchs)
    {
        var mc = matchs[i];
        checkMatchStatus(dt, mc, callbacks);
        updateMatch(dt, mc, callbacks);
    }
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
    for (i = 0; i < mc.p.length; ++i) {
        if (mc.p[i].uid == uid) {
            mc.p[i].ready = true;
            break;
        }
    }

    utils.invokeCallback(callback, null);
}


exp.getOpponent = function (token, uid) {
    var mc = matchs[token];
    var p;
    if (mc.p[0].uid == uid) {
        p = mc.p[1];
    }
    else if (mc.p[1].uid == uid) {
        p = mc.p[0];
    }
    else {
        console.error("can't find opponent for uid: " + uid);
        return null;
    }

    return p;
}


exp.syncPlayerPos = function (token, uid, teamPos, ballPos, timeStamp) {
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
}
