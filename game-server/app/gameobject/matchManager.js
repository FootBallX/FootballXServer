var utils = require('../util/utils');
var geometry = require('../util/Geometry/geometry');
var Point = require('../util/Geometry/Point');
var Matrix3 = require('../util/Geometry/Matrix3');
var Rect = require('../util/Geometry/Rect');
var matchDefs = require('../shared/matchDefs');
var matchMenuItem = require('../shared/matchMenuItem');
var userDao = require('../dao/userDao');
var Code = require('../shared/code');

var exp = module.exports;

var matchs = {};
var globalToken = 0;
var g_lastUpdateTime = 0;

var getBallPos = function (mc) {
    var players = mc.p[mc.attackSide].info.players
    var pos = players[mc.ball].position;
    return {x: pos.x, y: pos.y};
}

var getOtherSide = function (side) {
    if (side == 0) return 1;
    if (side == 1) return 0;

    console.log("wrong side!");

    return -1;
}


var isPointOnTheWay = function (p1, p2, p) {
    var bx = new Rect(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
    if (!bx.containsPoint(p)) {
        return false;
    }

    var vec = p2.sub(p1);
    var angle = vec.getAngle();

    var mat = new Matrix3();
    mat.rotation(-angle);

    var vP1 = p1.clone();
    var vP2 = p2.clone();
    var vP = p.clone();

    geometry.vec2Transform(vP1, mat);
    geometry.vec2Transform(vP2, mat);
    geometry.vec2Transform(vP, mat);

    if (vP.x < Math.min(vP1.x, vP2.x) || vP.x > Math.max(vP1.x, vP2.x)) {
        return false;
    }

    if (Math.abs(vP.y - vP1.y) > 10) {
        return false;
    }

    return true;
}


var updateDefendPlayerAroundBall = function (mc) {
    var p = mc.p[mc.attackSide].info;
    var op = mc.p[getOtherSide(mc.attackSide)].info;

    p.encounter.involePlayers = [mc.ball];
    op.encounter.involePlayers = [];
    var v1 = p.players[mc.ball].position;
    for (var i = 0; i < op.players.length; ++i) {
        var dist = v1.getLengthSq(op.players[i].position);
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
    var oplen1 = op.encounter.instructions.length;
    var oplen2 = op.encounter.involePlayers.length;
    if (plen1 == 1 && oplen1 == oplen2) {
        var m1 = matchDefs.MENU_TYPE_INSTRUCTIONS[p.encounter.menuType];
        var m2 = matchDefs.MENU_TYPE_INSTRUCTIONS[op.encounter.menuType];
        var ins;

        ins = p.encounter.instructions[0];
        if (!utils.arrayContains(m1, ins)) {
            return false;
        }

        for (var i = 0; i < oplen1; ++i) {
            ins = op.encounter.instructions[i];
            if (!utils.arrayContains(m2, ins)) {
                return false;
            }
        }
        return true;
    }

    return false;
}


var makeAtkSideRandomInstruction = function (atkPlayer) {
    var p = atkPlayer;
    var ec = p.encounter;

    // 攻防固定不多于一个指令
    if (p.encounter.menuType == matchDefs.MENU_TYPE.NONE || ec.instructions.length == 1) {
        return false;
    }

    ec.instructions = [];
    var m;
    var r;
    if (ec.involePlayers.length > 0) {
        m = matchDefs.MENU_TYPE_INSTRUCTIONS[ec.menuType];
        r = utils.getRandom(m.length);
        ec.instructions.push(m[r]);
    }

    return true;
}

var makeDefRandomInstructions = function (defPlayer) {
    var p = defPlayer;
    var ec = p.encounter;

    // 守方
    if (p.encounter.menuType == matchDefs.MENU_TYPE.NONE || ec.instructions.length == ec.involePlayers.length) {
        return false;
    }

    var m = matchDefs.MENU_TYPE_INSTRUCTIONS[ec.menuType];
    var r;
    var defLen = ec.involePlayers.length;
    while (ec.instructions.length < defLen) {
        r = utils.getRandom(m.length);
        ec.instructions.push(m[r]);
    }

    return true;
}


var getRandomBallTargets = function (mc) {
    var ballPos = getBallPos(mc);

    var xMin = ballPos.x - matchDefs.RandomBallRange.width / 2;
    var yMin = ballPos.y - matchDefs.RandomBallRange.height / 2;

    if (xMin < 0) {
        xMin = 0;
    }
    if (yMin < 0) {
        yMin = 0;
    }
    var xMax = xMin + matchDefs.RandomBallRange.width;
    var yMax = yMin + matchDefs.RandomBallRange.height;
    if (xMax > matchDefs.Pitch.width) {
        xMax = matchDefs.Pitch.width;
    }
    if (yMax > matchDefs.Pitch.height) {
        yMax = matchDefs.Pitch.height;
    }

    var newBallPos = {x: xMin + utils.getRandom(xMax - xMin), y: yMin + utils.getRandom(yMax - yMin)};

    var player = {
        newBallPos: newBallPos,
        playerNumber: -1,
        side: -1,
        distanceFromNewBallPos: 100000000
    };

    for (var i = 0; i < mc.p.length; ++i) {
        var encounter = mc.p[i].info.encounter;
        var team = mc.p[i].info.players;

        for (var j = 0; j < team.length; ++j) {
            if (!utils.arrayContains(encounter.involePlayers, j)) {     // 排除参与遭遇的球员
                var len = geometry.getLengthSq(team[j].position, newBallPos);
                if (player.distanceFromNewBallPos > len) {
                    player.playerNumber = j;
                    player.side = (i == mc.attackSide ? 0 : 1);
                    player.distanceFromNewBallPos = len;
                }
            }
        }
    }

    return player;
}

var checkAutoEncounterOnPass = function(p, op, ins)
{
    var p1 = p.players[p.encounter.involePlayers[0]].position;
    var p2 = p.players[p.encounter.involePlayers[1]].position;
    var atkPlayerNumber = p.encounter.involePlayers[0];

    var inter = false;
    // 从1开始，跳过门将
    for (var i = 1; i < op.players.length; ++i)
    {
        var involePlayers = op.encounter.involePlayers;
        var found = false;
        for (var j = 0; j < involePlayers.length; ++j)
        {
            if (involePlayers[j] == i)
            {
                found = true;
                break;
            }
        }

        if (!found)
        {
            console.log('isPointOnTheWay');
            if (isPointOnTheWay(p1, p2, op.players[i].position)){
                console.log('did on the way');
                var ins2 = matchMenuItem.MENU_ITEM.Block;
                matchMenuItem.CLEAR_ANIMATIONS();
                var result = matchMenuItem.MENU_FUNCS[ins2](p.players[atkPlayerNumber], op.players[i]);
                var animations = matchMenuItem.GET_ANIMATIONS();
                ins.instructions.push({side: 1, playerNumber: i, ins: ins2, result: result, animations: animations});
                var inter = false;
                switch (result) {
                    case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_FAIL:
                        break;
                    case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_SUCCESS:
                        ins.ballSide = 1;
                        ins.playerNumber = defPlayerNumber;
                        ins.ballPosX = op.players[defPlayerNumber].position.x;
                        ins.ballPosY = op.players[defPlayerNumber].position.y;
                        inter = true;
                        break;
                    case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_RANDOM_BALL:
                        var player = getRandomBallTargets(mc);
                        ins.ballSide = player.side;
                        ins.playerNumber = player.playerNumber;
                        ins.ballPosX = player.newBallPos.x;
                        ins.ballPosY = player.newBallPos.y;
                        inter = true;
                        break;
                }

                if (inter)
                {
                    break;
                }
            }
        }
    }

    return inter;
}

var processInstructions = function (mc, callbacks) {
    var p = mc.p[mc.attackSide].info;
    var op = mc.p[getOtherSide(mc.attackSide)].info;

    var ins = {
        instructions: [],
        result: matchMenuItem.MENU_ITEM_RETURN_CODE.RET_FAIL,
        ballSide: 0,
        playerNumber: 0,
        ballPosX: 0.0,
        ballPosY: 0.0
    };

    var atkPlayerNumber;
    var defPlayerNumber;
    var result;
    var animations;

    var ins1 = p.encounter.instructions[0];
    atkPlayerNumber = p.encounter.involePlayers[0];
    matchMenuItem.CLEAR_ANIMATIONS();
    matchMenuItem.MENU_FUNCS[ins1](p.players[atkPlayerNumber]);
    animations = matchMenuItem.GET_ANIMATIONS();

    result = matchMenuItem.MENU_ITEM_RETURN_CODE.RET_SUCCESS;
    ins.instructions.push({side: 0, playerNumber: atkPlayerNumber, ins: ins1, result: result, animations: animations});


    var inter = false;
    for (var i = 0; i < op.encounter.instructions.length; ++i) {
        var ins2 = op.encounter.instructions[i];
        defPlayerNumber = op.encounter.involePlayers[i];
        matchMenuItem.CLEAR_ANIMATIONS();
        result = matchMenuItem.MENU_FUNCS[ins2](p.players[atkPlayerNumber], op.players[defPlayerNumber]);
        animations = matchMenuItem.GET_ANIMATIONS();
        ins.instructions.push({side: 1, playerNumber: defPlayerNumber, ins: ins2, result: result, animations: animations});

        switch (result) {
            case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_FAIL:
                break;
            case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_SUCCESS:
                ins.ballSide = 1;
                ins.playerNumber = defPlayerNumber;
                ins.ballPosX = op.players[defPlayerNumber].position.x;
                ins.ballPosY = op.players[defPlayerNumber].position.y;
                inter = true;
                break;
            case matchMenuItem.MENU_ITEM_RETURN_CODE.RET_RANDOM_BALL:
                var player = getRandomBallTargets(mc);
                ins.ballSide = player.side;
                ins.playerNumber = player.playerNumber;
                ins.ballPosX = player.newBallPos.x;
                ins.ballPosY = player.newBallPos.y;
                inter = true;
                break;
        }

        if (inter == true) {
            break;
        }
    }

    if (false == inter) {
        console.log(p.encounter.instructions[0]);
        // 走到这里说明一切防守指令都失败
        switch (p.encounter.instructions[0]) {
            case matchMenuItem.MENU_ITEM.Pass:
                // 检查传球路线上是否有遭遇发送
            {
                console.log('check auto');
                if (checkAutoEncounterOnPass(p, op, ins)) {
                    console.log('blocked');
                }
                else {
                    // 一切OK，传球成功
                    ins.ballSide = 0;
                    ins.playerNumber = p.encounter.involePlayers[1];
                    ins.ballPosX = p.players[ins.playerNumber].position.x;
                    ins.ballPosY = p.players[ins.playerNumber].position.y;
                }
                break;
            }

            case matchMenuItem.MENU_ITEM.Shoot:
                break;
            case matchMenuItem.MENU_ITEM.Dribble:
                break;
            case matchMenuItem.MENU_ITEM.OneTwo:
                break;
        }
    }

    // 根据指令结果，更新服务器数据
    if (ins.ballSide == 1)      // 球权在防守方
    {
        mc.attackSide = mc.attackSide == 0 ? 1 : 0;
    }
    console.log('pass ball to : ' + ins.playerNumber);
    mc.ball = ins.playerNumber;

    console.log('instrunction done!!!!!!!!!!!!!')

    // 发送给客户端
    utils.invokeCallback(callbacks.sendInstructions, mc.p, ins);
    process.nextTick(syncAllTeamStates.bind(null, mc, callbacks.syncTeam));

    // 发送完毕后清空服务器指令状态
    p.encounter.instructions = [];
    p.encounter.involePlayers = [];
    op.encounter.instructions = [];
    op.encounter.involePlayers = [];
    mc.state = matchDefs.MATCH_STATE.WaitInstructionMovieEnd;
}


var syncAllTeamStates = function (mc, callback) {
    for (var i = 0; i < mc.p.length; ++i) {
        var msg = {
            side: i,
            ballPosPlayerId: (i == mc.attackSide ? mc.ball : -1),
            timeStamp: 0,
            teamPos: []
        };
        var players = mc.p[i].info.players;
        for (var j = 0; j < players.length; ++j) {
            msg.teamPos.push(players[j].position.x);
            msg.teamPos.push(players[j].position.y);
            msg.teamPos.push(0);
            msg.teamPos.push(0);
        }

        utils.invokeCallback(callback, msg, mc.p);
    }
}

var checkInstructionMovieEnd = function (mc, callbacks) {
    var ready = mc.p[0].info.ready && mc.p[1].info.ready;
    if (ready)  // 双方都完成播放指令动画了
    {
        console.log('resume match~~~~~~~');
        mc.p[0].info.ready = false;
        mc.p[1].info.ready = false;

        mc.pause = false;
        mc.state = matchDefs.MATCH_STATE.Normal;

        callbacks.resumeMatch(mc.p);
    }
}

var updateMatch = function (dt, mc, callbacks) {

    var p = mc.p[mc.attackSide].info;
    var op = mc.p[getOtherSide(mc.attackSide)].info;

    if (mc.state == matchDefs.MATCH_STATE.WaitInstruction) {
        p.waitInstructionTime -= dt;
        op.waitInstructionTime -= dt;

        if (p.waitInstructionTime <= 0) {
            if (makeAtkSideRandomInstruction(p)) {
                console.log('made atk');
                callbacks.instructionDone([mc.p[mc.attackSide]]);
            }
        }
        if (op.waitInstructionTime <= 0) {
            if (makeDefRandomInstructions(op)) {
                console.log('made def');
                callbacks.instructionDone([mc.p[getOtherSide(mc.attackSide)]]);
            }
        }

        if (checkInstructions(mc)) {
            console.log("checked    -----");
            processInstructions(mc, callbacks);
        }
    }
    else if (mc.state == matchDefs.MATCH_STATE.WaitInstructionMovieEnd) {
        checkInstructionMovieEnd(mc, callbacks);
    }


    if (mc.pause || mc.startTime == 0) {
        return;
    }

    if (mc.state == matchDefs.MATCH_STATE.Normal) {
        updateDefendPlayerAroundBall(mc);
        if (checkEncounterInDribble(mc, dt, callbacks.triggerMenu)) {
            p.waitInstructionTime = matchDefs.INSTRUCTION_WAIT_TIME;
            op.waitInstructionTime = matchDefs.INSTRUCTION_WAIT_TIME;
            mc.state = matchDefs.MATCH_STATE.WaitInstruction;
            mc.pause = true;
            return;
        }
    }
}


exp.init = function () {
}


var initPlayer = function (p) {

    var fid = utils.getRandom(matchDefs.FormationInitPosition.length)
    var np = {
        uid: p.uid,
        sid: p.sid,
        info: {
            ready: false,           // ready有两个作用，比赛未开始时候用于标记客户端可以开始比赛，比赛开始以后用以标记客户端播放指令动画完毕，可以恢复比赛
            waitInstructionTime: 0,
            score: 0,
            lastSyncTime: 0,
            encounter: {
                menuType: matchDefs.MENU_TYPE.NONE,
                involePlayers: [],
                instructions: []                        // 触发遭遇时候，玩家选择的指令，从客户端得到，数量等于参与遭遇的球员人数
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


    var k = utils.getRandom(2);
    var s = utils.getRandom(2);

    var mc = {
        p: (s == 0 ? [p1, p2] : [p2, p1]),
        ball: 0,
        attackSide: k,
        syncCount: 0,
        encounterTime: -1,
        token: token,
        createdTime: time,
        startTime: 0,
        pause: false,
        state: matchDefs.MATCH_STATE.None
    };

    initPlayerPositions(mc.p[0].info.players, mc.p[0].info.formationId, true);
    initPlayerPositions(mc.p[1].info.players, mc.p[1].info.formationId, false);

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
            var fmt = matchDefs.FormationInitPosition[fid][i];
            p.position = new Point(fmt.Position.x, fmt.Position.y);
            p.homePosition = new Point(fmt.HomePosition.x, fmt.HomePosition.y);
            p.aiClass = fmt.AIClass;
        }
        else {
            var fmt = matchDefs.FormationInitPosition[fid][i];
            p.position = new Point(matchDefs.Pitch.Width - fmt.Position.x, fmt.Position.y);
            p.homePosition = new Point(fmt.HomePosition.x, fmt.HomePosition.y);
            p.aiClass = fmt.AIClass;
        }
    }
}


// 检查Match状态，负责推送GameStart和比赛超时结束的消息
var checkMatchStatus = function (dt, mc, callbacks) {
    if (mc.startTime == 0)  // 比赛未开始
    {
        var ready = mc.p[0].info.ready && mc.p[1].info.ready;

        if (ready)  // 双方都Ready了
        {
            var t = utils.getTimeInUint32();
            t += 5000;

            mc.startTime = t;
            mc.lastUpdateTime = t;
            mc.state = matchDefs.MATCH_STATE.Normal;

            mc.p[0].info.ready = false;
            mc.p[1].info.ready = false;

            var msg = {startTime: t};
            callbacks.startMatch(mc.p, msg);
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


exp.getMatchInfo = function (token, callback) {
    var mc = matchs[token];

    var left = [];
    var right = [];

    for (var i = 0; i < mc.p[0].info.players.length; ++i) {
        var p0 = mc.p[0].info.players[i];
        var p1 = mc.p[1].info.players[i];
        left.push(p0);
        right.push(p1);
    }

    var msg = {leftUid: mc.p[0].uid, left: left, rightUid: mc.p[1].uid, right: right, kickOffSide: mc.attackSide, kickOffPlayer: 9};
    utils.invokeCallback(callback, null, msg);
}

exp.ready = function (token, uid, callback) {
    var mc = matchs[token];

    var i;
    for (i = 0; i < mc.p.length; ++i) {
        if (mc.p[i].uid == uid) {
            mc.p[i].info.ready = true;
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
        p[j].position.y = teamPos[i + 1];
    }

    p.lastSyncTime = timeStamp;

    mc.syncCount++;
}


// targetPlayer只在进攻方传球时用，用于标识接球队员编号
exp.menuCmd = function (token, uid, cmd, targetPlayer, callback) {
    var mc = matchs[token];
    var p;
    if (mc.p[0].uid == uid) {
        p = mc.p[0].info;
    }
    else if (mc.p[1].uid == uid) {
        p = mc.p[1].info;
    }

    var len = p.encounter.involePlayers.length;
    p.encounter.instructions.push(cmd);
    if (targetPlayer !== undefined && targetPlayer != null) {
        p.encounter.involePlayers.push(targetPlayer);
    }

    var countDown;
    if (p.encounter.instructions.length < len) {
        p.waitInstructionTime = matchDefs.INSTRUCTION_WAIT_TIME;
        countDown = matchDefs.INSTRUCTION_WAIT_TIME;
    }
    else {
        countDown = 0;
    }

    utils.invokeCallback(callback, null, countDown);
}


exp.setInstructionMovieEnd = function (token, uid, callback) {
    var mc = matchs[token];
    var pInfo;
    if (mc.p[0].uid == uid) {
        pInfo = mc.p[0].info;
    }
    else if (mc.p[1].uid == uid) {
        pInfo = mc.p[1].info;
    }

    console.log('MovieEnd: ' + uid);
    pInfo.ready = true;

    utils.invokeCallback(callback, null);
}