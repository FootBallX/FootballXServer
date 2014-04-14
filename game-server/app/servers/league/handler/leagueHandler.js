var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../shared/code');
var LM = require('../../../gameobject/leagueManager');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
    this.cs = app.get('channelService');
};


var onPairSuccess = function (user1, user2) {

    var sessionService = this.app.get('localSessionService');
    var self = this;
    var s1, s2;
    var tkn;

    // TODO: match server 的负载均衡算法还待补充
    var matchServerId = 0;

    async.waterfall([
        function(cb){
            sessionService.getByUid(user1.sid, user1.uid, cb);
        },
        function(session, cb){
            s1 = session[0];
            s1.set("matchServerId", matchServerId);
            s1.push("matchServerId", cb);
        },
        function(cb){
            sessionService.getByUid(user2.sid, user2.uid, cb);
        },
        function(session, cb){
            s2 = session[0]
            s2.set("matchServerId", matchServerId);
            s2.push("matchServerId", cb);
        },
        function(cb){
            self.app.rpc.match.matchRemote.registerMatch(s1, user1, user2, cb);
        },
        function(token, cb){
            tkn = token;
            s1.set("matchToken", tkn);
            s1.push("matchToken", cb);
        },
        function(cb){
            s2.set("matchToken", tkn);
            s2.push("matchToken", cb);
        },
        function(cb){
            self.cs.pushMessageByUids("onPair", {code: Code.OK}, [user1, user2], cb);
        }
    ], function(err){
        if (err)
        {
            console.log('fail to pair, err = ');
            console.log(err);
            sessionService.kickByUid(user1.sid, user1.uid, null);
            sessionService.kickByUid(user2.sid, user2.uid, null);

            return;
        }
    });
}

var pro = Handler.prototype;

pro.signUp = function (msg, session, next) {
    var uid = session.uid;
    var pid = session.settings.playerId;
    var sid = session.frontendId;
    LM.addPlayer({uid: uid, pid: pid, sid: sid});

    process.nextTick(LM.checkPair.bind(null, onPairSuccess.bind(this)));

    next(null, {code: Code.OK});
};


pro.signOff = function (msg, session, next) {
    var uid = session.uid;
    LM.removePlayer({uid: uid});

    next(null, {code: Code.OK});
}