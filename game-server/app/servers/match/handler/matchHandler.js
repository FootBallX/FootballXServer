var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../shared/code');
var MM = require('../../../gameobject/matchManager');
var utils = require('../../../util/utils');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
    this.cs = app.get('channelService');
};


var pro = Handler.prototype;

pro.ready = function (msg, session, next) {

    var self = this;
    var t = session.get('matchToken');

    MM.ready(t, session.uid, function (err, start, users, kickSide, startTime) {

        if (err) {
            next(null, {code: Code.FAIL});
            return;
        }

        next(null, {code: Code.OK});

        if (start) {
            self.cs.pushMessageByUids("startMatch", {code: Code.OK, left: users[0].uid, right: users[1].uid, kickOffSide: kickSide, startTime: startTime}, users, function (err) {
                if (err) {
                    console.log("err: ");
                    console.log(err);
                }
            });
        }
    });
};


// notify message
pro.sync = function (msg, session, next) {
    var self = this;
    var t = session.get('matchToken');

    MM.syncPlayerPos(t, session.uid, msg.teamPos, msg.ballPosPlayerId, msg.timeStamp, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        process.nextTick(MM.updateMatch.bind(null, t, function (err, p1, defPlayers) {
            console.log("-----------> " + utils.getTimeInUint32());
            console.log(defPlayers);
        }));
    });

    MM.getOpponent(t, session.uid, function (err, users) {
        if (err) {
            console.log('err: ');
            console.log(err);
            s.kick(session.uid, null);
            return;
        }

        self.cs.pushMessageByUids("sync", msg, users, function (err) {
            if (err) {
                console.log("err: ");
                console.log(err);
            }
        });
    });

    next(null);
};


pro.time = function (msg, session, next) {
    var t = utils.getTimeInUint32();

    msg['sTime'] = t;
    next(null, msg);

}