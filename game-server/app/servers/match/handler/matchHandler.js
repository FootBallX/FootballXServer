var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../shared/code');
var MM = require('../../../gameobject/matchManager');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
    this.cs = app.get('channelService');
};

var swichDominator = function(self, token){
    MM.swichDominator(token, function(err, uid1, uid2){
        self.cs.pushMessageByUids("switchDominator", {gotDominator:true}, [uid1], function (err) {
            if (err) {
                console.log("err: ");
                console.log(err);
            }
        });
        self.cs.pushMessageByUids("switchDominator",  {gotDominator:true}, [uid2], function (err) {
            if (err) {
                console.log("err: ");
                console.log(err);
            }
        });
    });
}


var pro = Handler.prototype;

pro.ready = function (msg, session, next) {

    var self = this;
    var t = session.get('matchToken');

    MM.ready(t, session.uid, function (err, start, users) {

        if (err) {
            next(null, {code: Code.FAIL});
            return;
        }

        next(null, {code: Code.OK});

        if (start) {
            var t = new Date().getTime();
            t += 5000000;
            var k = t % 2;
            var dominatorUid = 0;
            if (users[0].dominator) {
                dominatorUid = users[0].uid;
            }
            else if (users[1].dominator) {
                dominatorUid = users[1].uid;
            }
            self.cs.pushMessageByUids("startMatch", {code: Code.OK, left: users[0].uid, right: users[1].uid, kickOffSide:k, startTime:t, dominatorUid:dominatorUid}, users, function (err) {
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



pro.time = function(msg, session, next) {
//    var startTime = new Date().getTime();
//    while(new Date().getTime()<startTime+500);
    msg['sTime'] = new Date().getTime();
    next(null, msg);
}