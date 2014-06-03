var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../shared/code');
var MM = require('../../../gameobject/matchManager');
var utils = require('../../../util/utils');
var schedule = require('../../../../node_modules/pomelo/node_modules/pomelo-scheduler/lib/schedule');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
    this.cs = app.get('channelService');
    MM.init();

    var trigger = {
        period : 1000
    };

    var callbacks = {
        triggerMenu:onTriggerMenu.bind(this),
        startMatch:onStartMatch.bind(this),
        sendInstructions:onSendInstructions.bind(this),
        syncTeam:onSyncTeam.bind(this),
        instructionDone:onInstructionDone.bind(this),
        resumeMatch:onResumeMatch.bind(this)
    };

    schedule.scheduleJob(trigger, triggerUpdate, callbacks);
};


var onInstructionDone = function(users) {
    // 当玩家超时，没有发送指令的时候，会随机生成指令，然后通知玩家不能再选择指令了。
    this.cs.pushMessageByUids("instructionsDone", {}, users, function (err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });
}

var onResumeMatch = function(users, msg) {
    this.cs.pushMessageByUids("resumeMatch", msg, users, function (err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });
}

var triggerUpdate = function(callbacks) {
    MM.update(callbacks);
}

var onStartMatch = function(users, msg) {
    this.cs.pushMessageByUids("startMatch", msg, users, function (err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });
}

// user     玩家uid
// menuType 菜单类型
// playerNumbers    数组，参与的球员号码
var onTriggerMenu = function(user1, user2, attackPlayerNumbers, defendPlayerNumbers) {
    var self = this;
    var msg1 =  {menuType:user1.info.encounter.menuType, attackPlayers:attackPlayerNumbers, defendplayers:defendPlayerNumbers};
    console.log(msg1);
    self.cs.pushMessageByUids("triggerMenu", msg1, [user1], function(err){
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });

    var msg2 =  {menuType:user2.info.encounter.menuType, attackPlayers:attackPlayerNumbers, defendplayers:defendPlayerNumbers};
    console.log(msg2);
    self.cs.pushMessageByUids("triggerMenu", msg2, [user2], function(err){
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });

}


var onSendInstructions = function(users, ins) {
    var self = this;

    self.cs.pushMessageByUids("instructions", ins, users, function(err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });
}


var onSyncTeam = function(msg, users) {
    var self = this;
    self.cs.pushMessageByUids("sync", msg, users, function (err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });
}



var pro = Handler.prototype;

pro.getMatchInfo = function(msg, session, next) {
    var self = this;
    var t = session.get('matchToken');

    MM.getMatchInfo(t, function(err, msg) {
        if (err) {
            next(err);
            return;
        }

        next(null, msg);
    });
}


pro.ready = function (msg, session, next) {

    var self = this;
    var t = session.get('matchToken');

    MM.ready(t, session.uid, function (err) {

        if (err) {
            next(null, {code: Code.FAIL});
            return;
        }

        next(null, {code: Code.OK});
    });
};



// notify message
pro.sync = function (msg, session, next) {
    var self = this;
    var t = session.get('matchToken');

    MM.syncPlayerPos(t, session.uid, msg.teamPos, msg.ballPosPlayerId, msg.timeStamp);
    var user = MM.getOpponent(t, session.uid);
    if (!user) {
        s.kick(session.uid, null);
        return;
    }

    self.cs.pushMessageByUids("sync", msg, [user], function (err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });

    next(null);
};


pro.menuCmd = function (msg, session, next) {
    var self = this;
    var t = session.get('matchToken');
    MM.menuCmd(t, session.uid, msg.cmd, msg.targetPlayerId, function (err, countDown) {
        next(null, {countDown: countDown});
    });
}


pro.time = function (msg, session, next) {
    var t = utils.getTimeInUint32();

    msg['sTime'] = t;
    next(null, msg);

}



pro.instructionMovieEnd = function (msg, session, next) {
    var self = this;
    var t = session.get('matchToken');

    MM.setInstructionMovieEnd(t, session.uid, function(err){
        next(err, {});
    });
}
