var utils = require('../util/utils');
var geometry = require('../util/geometry');
var matchDefs = require('../shared/matchDefs');
var matchMenuItem = require('../shared/matchMenuItem');
var userDao = require('../dao/userDao');
var Code = require('../shared/code');

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
    var p = mc.p[mc.attackSide].info;
    var op = mc.p[getOtherSide(mc.attackSide)].info;

    p.encounter.involePlayers = [mc.ball];
    op.encounter.involePlayers = [];
    var v1 = p.players[mc.ball].position;
    for (var i = 0; i < op.players.length; ++i) {
        var dist = geometry.getLengthSq(v1, op.players[i].position);
        if (dist < 1600)    // 40 * 40 （距离40以内）
        {
            op.encounter.involePlayers.push(i);
        }
    }
}

var checkEncounterInDribble = function (mc, dt, callback) {

    var u1 = mc.p[mc.attackSide];
    var u2 = mc.p[getOtherSide(mc.attackSide)];
    var p = u1.info;
    var op = u2.info;

    if (op.encounter.involePlayers.length == 0) {
        mc.encounterTime = -1;
    }
    else if (op.encounter.involePlayers.length >= 4) {
        p.encounter.menuType = matchDefs.MENU_TYPE.ENCOUNTER_ATK_G;
        op.encounter.menuType = matchDefs.MENU_TYPE.ENCOUTNER_DEF_G;
        p.encounter.instructions = [];
        op.encounter.instructions = [];
        utils.invokeCallback(callback, u1, u2, p.encounter.involePlayers, op.encounter.involePlayers);
        mc.encounterTime = -1;
        return true;
    }
    else if (op.encounter.involePlayers.length > 0) {
        if (mc.encounterTime < 0) {
            mc.encounterTime = 2000;        // 2 second
        }
        mc.encounterTime -= dt;
        if (mc.encounterTime < 0) {
            p.encounter.menuType = matchDefs.MENU_TYPE.ENCOUNTER_ATK_G;
            op.encounter.menuType = matchDefs.MENU_TYPE.ENCOUTNER_DEF_G;
            p.encounter.instructions = [];
            op.encounter.instructions = [];
            utils.invokeCallback(callback, u1, u2, p.encounter.involePlayers, op.encounter.involePlayers);
            return true;
        }
    }

    return false;
}


var checkEncounterInPenaltyArea = function (mc, callback) {
    // TODO: 进攻方对方禁区拿球，强制触发一次空中遭遇。仅当传球，二过一，随机球 刚刚结束，否则直接返回。

}


// 检查双方指令是否都发送完毕，并且合法
var checkInstructions = function (mc) {
    var p = mc.p[mc.attackSide].info;
    var op = mc.p[getOtherSide(mc.attackSide)].info;

    var plen1 = p.encounter.instructions.length;
    var plen2 = p.encounter.involePlayers.length;
    var oplen1 = op.encounter.instructions.length;
    var oplen2 = op.encounter.involePlayers.length;
    if (plen1 == plen2 && oplen1 == oplen2) {
        console.log("1");
        var m1 = matchDefs.MENU_TYPE_INSTRUCTIONS[p.encounter.menuType];
        var m2 = matchDefs.MENU_TYPE_INSTRUCTIONS[op.encounter.menuType];
        var ins;
        var i;
        for (i = 0; i < plen1; ++i) {
            ins = p.encounter.instructions[i];
            console.log(ins);
            if (!arrayContains(m1, ins)) {
                return false;
            }
        }

        for (i = 0; i < oplen1; ++i) {
            ins = op.encounter.instructions[i];
            if (!arrayContains(m2, ins)) {
                return false;
            }
        }
        return true;
    }

    return false;
}


var makeRandomInstructions = function (mc) {
    var p = mc.p[mc.attackSide].info;
    var op = mc.p[getOtherSide(mc.attackSide)].info;

    if (p.encounter.menuType == matchDefs.MENU_TYPE.NONE || op.encounter.menuType == matchDefs.MENU_TYPE.NONE) {
        return false;
    }

    for (var i = 0; i < mc.p.length; ++i) {
        var ec = mc.p[i].info.encounter;
        var defLen = ec.involePlayers.length;
        if (ec.instructions.length != defLen) {
            ec.instructions = [];
            var m = matchDefs.MENU_TYPE_INSTRUCTIONS[ec.menuType];
            for (var i = 0; i < defLen; ++i) {
                var r = utils.getRandom(m.length);
                ec.instructions.push(m[r]);
            }
        }
    }
    return true;
}


var processInstructions = function (mc, callback) {
    var p = mc.p[mc.attackSide].info;
    var op = mc.p[getOtherSide(mc.attackSide)].info;

    var ins = {
        instructions: [],
        result: matchMenuItem.MENU_ITEM_RETURN_CODE.RET_SUCCESS,
        ballSide: 0,
        playerNumber: 0,
        ballPosX: 0.0,
        ballPosY: 0.0
    };

    var atkPlayerNumber;
    var defPlayerNumber;

    for (var i = 0; i < p.encounter.instructions.length; ++i) {
        var ins1 = p.encounter.instructions[i];
        atkPlayerNumber = p.encounter.involePlayers[i];
        matchMenuItem.MENU_FUNCS[ins1](p.players[atkPlayerNumber]);
        ins.instructions.push({side: 0, playerNumber: atkPlayerNumber, ins: ins1});
    }

    var inter = false;
    for (var i = 0; i < op.encounter.instructions.length; ++i) {
        var ins2 = op.encounter.instructions[i];
        defPlayerNumber = op.encounter.involePlayers[i];
        var result = matchMenuItem.MENU_FUNCS[ins2](p.players[atkPlayerNumber], op.players[defPlayerNumber]);
        ins.instructions.push({side: 1, playerNumber: defPlayerNumber, ins: ins2});

        switch (result) {
            case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_FAIL:
                break;
            case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_SUCCESS:
                ins.result = result;
                ins.ballSide = 1;
                ins.playerNumber = defPlayerNumber;
                ins.ballPosX = op.players[defPlayerNumber].position.x;
                ins.ballPosY = op.players[defPlayerNumber].position.y;
                inter = true;
                break;
            case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_RANDOM_BALL:
                // TODO: 计算随机球落点
                inter = true;
                break;
        }

        if (inter == true) {
            break;
        }
    }

    if (inter) {
        // 走到这里说明一切防守指令都失败
        switch (p.encounter.instructions[0]) {
            case matchMenuItem.MENU_ITEM.Pass:
                break;
            case matchMenuItem.MENU_ITEM.Shoot:
                break;
            case matchMenuItem.MENU_ITEM.Dribble:
                break;
            case matchMenuItem.MENU_ITEM.OneTwo:
                break;
        }
    }

    // TODO: 根据指令结果，更新服务器数据

    console.log('instrunction done!!!!!!!!!!!!!')

    // 发送给客户端
    utils.invokeCallback(callback, mc.p, ins);

    // 发送完毕后清空服务器指令状态
    p.encounter.instructions = [];
    p.encounter.involePlayers = [];
    op.encounter.instructions = [];
    op.encounter.involePlayers = [];
    mc.state = matchDefs.MATCH_STATE.WaitInstructionMovieEnd;
}

var updateMatch = function (dt, mc, callbacks) {

    if (mc.state == matchDefs.MATCH_STATE.WaitInstruction) {
        mc.waitInstructionTime -= dt;
        if (mc.waitInstructionTime > 0) {
            if (checkInstructions(mc)) {
                console.log("checked    -----");
                processInstructions(mc, callbacks.sendInstructions);
            }
        }
        else {
            if (makeRandomInstructions(mc)) {
                console.log("made    -----");
                processInstructions(mc, callbacks.sendInstructions);
            }
        }
    }

    if (mc.pause || mc.startTime == 0) {
        return;
    }

    if (mc.state == matchDefs.MATCH_STATE.Normal) {
        updateDefendPlayerAroundBall(mc);
        if (checkEncounterInDribble(mc, dt, callbacks.triggerMenu)) {
            mc.waitInstructionTime = matchDefs.INSTRUCTION_WAIT_TIME;   // 20秒等待指令时间
            mc.state = matchDefs.MATCH_STATE.WaitInstruction;
            mc.pause = true;
            return;
        }
    }
}


exp.init = function () {
}

var arrayContains = function (arr, item) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i] === item) {
            return true;
        }
    }

    return false;
}

var initPlayer = function (p) {

    var fid = utils.getRandom(matchDefs.FormationInitPosition.length)
    var np = {
        uid: p.uid,
        sid: p.sid,
        info: {
            ready: false,
            score: 0,
            lastSyncTime: 0,
            encounter: {
                menuType: matchDefs.MENU_TYPE.NONE,
                involePlayers: [],
                instructions: [],                        // 触发遭遇时候，玩家选择的指令，从客户端得到，数量等于参与遭遇的球员人数
//                instructionResults:[]                   // 指令的计算结果，目前只有成功，失败，随机球3种
            },
            formationId: fid,                              // TODO: 阵型编号，从数据库读取（Player表中）
            players: p.players
        }
    };

    return np;
}

exp.createMatch = function (p1, p2, time, callback) {
    // TODO: token生成算法
    var token = ++globalToken;

    if (matchs[token]) {
        utils.invokeCallback(callback, new Error('wrong match token'));
        return;
    }

    p1 = initPlayer(p1);
    p2 = initPlayer(p2);

    var mc = {
        p: [p1, p2],
        ball: 0,
        attackSide: 0,
        syncCount: 0,
        encounterTime: -1,
        token: token,
        createdTime: time,
        startTime: 0,
        waitInstructionTime: 0,
        pause: false,
        state: matchDefs.MATCH_STATE.None
    };

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


var initPlayerPositions = function (players, fid, isLeft) {

    for (var i = 0; i < players.length; ++i) {
        var p = players[i];
        if (!!isLeft) {
            p.position.x = matchDefs.FormationInitPosition[fid][i].x;
            p.position.y = matchDefs.FormationInitPosition[fid][i].y;
        }
        else {
            p.position.x = matchDefs.Pitch.Width - matchDefs.FormationInitPosition[fid][i].x;
            p.position.y = matchDefs.FormationInitPosition[fid][i].y;
        }
    }
}

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
            mc.state = matchDefs.MATCH_STATE.Normal;

            initPlayerPositions(mc.p[0].info.players, mc.p[0].info.formationId, s == 0);
            initPlayerPositions(mc.p[1].info.players, mc.p[1].info.formationId, s == 1);

            var left = {
                uid: mc.p[0].uid,
                teamPos: []
            }

            var right = {
                uid: mc.p[1].uid,
                teamPos: []
            }

            for (var i = 0; i < mc.p[0].info.players.length; ++i) {
                left.teamPos.push(mc.p[0].info.players[i].position.x);
                left.teamPos.push(mc.p[0].info.players[i].position.y);
                right.teamPos.push(mc.p[1].info.players[i].position.x);
                right.teamPos.push(mc.p[1].info.players[i].position.y);
            }
            callbacks.startMatch(mc.p, left, right, k, t);
        }
    }
    else {
        // TODO: 比赛中，要检查超时，适时销毁比赛对象
    }
}


exp.update = function (callbacks) {

    var dt = 0;
    var ct = utils.getTimeInUint32();
    if (g_lastUpdateTime > 0) {
        dt = ct - g_lastUpdateTime;
    }
    g_lastUpdateTime = ct;

    for (var i in matchs) {
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
        p = mc.p[0].info.players;
        if (mc.attackSide == 0) {
            attack = true;
        }
    }
    else if (mc.p[1].uid == uid) {
        p = mc.p[1].info.players;
        if (mc.attackSide == 1) {
            attack = true;
        }
    }
    else {
        console.error("uid error");
        console.error(uid);
    }

    if (attack) {
        mc.ball = ballPos;
    }

    var i = 0;
    var j = 0;
    for (i = 0, j = 0; i < teamPos.length; i += 4, ++j) {

        p[j].position.x = teamPos[i];
        p[j].position.y = teamPos[i];
    }

    p.lastSyncTime = timeStamp;

    mc.syncCount++;
}


// targetPlayer只在进攻方传球时用，用于标识接球队员编号
exp.menuCmd = function (token, uid, cmd, targetPlayer, callback) {
    var mc = matchs[token];
    var p;
    if (mc.p[0].uid == uid) {
        p = mc.p[0].info.encounter;
    }
    else if (mc.p[1].uid == uid) {
        p = mc.p[1].info.encounter;
    }

    p.instructions.push(cmd);

    var countDown;
    if (p.instructions.length < p.involePlayers.length) {
        mc.waitInstructionTime = matchDefs.INSTRUCTION_WAIT_TIME;
        countDown = matchDefs.INSTRUCTION_WAIT_TIME;
    }
    else {
        countDown = 0;
    }

    utils.invokeCallback(callback, null, countDown);
}