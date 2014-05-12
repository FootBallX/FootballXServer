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
        sendInstructions:onSendInstructions.bind(this)
    };

    schedule.scheduleJob(trigger, triggerUpdate, callbacks);
};


var triggerUpdate = function(callbacks) {
    MM.update(callbacks);
}

var onStartMatch = function(users, left, right, kickSide, startTime) {
    this.cs.pushMessageByUids("startMatch", {left: left, right: right, kickOffSide: kickSide, startTime: startTime}, users, function (err) {
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


var onSendInstructions = function(users, atkIns, defIns) {
    var self = this;

    var msg = {atkIns:atkIns.instructions, atkRes:atkIns.instructionResults, defIns:defIns.instructions, defRes:defIns.instructionResults};
    self.cs.pushMessageByUids("instructions", msg, users, function(err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });
}



var pro = Handler.prototype;

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
    var users = MM.getOpponent(t, session.uid);
    if (!users) {
        s.kick(session.uid, null);
        return;
    }

    self.cs.pushMessageByUids("sync", msg, [users], function (err) {
        if (err) {
            console.log("err: ");
            console.log(err);
        }
    });


    next(null);
};


pro.menuCmd = function (msg, session, next) {
    var t = session.get('matchToken');

    MM.menuCmd(t, session.uid, msg.cmds, null, function(err){
       next(null);
    });
}


pro.time = function (msg, session, next) {
    var t = utils.getTimeInUint32();

    msg['sTime'] = t;
    next(null, msg);

}