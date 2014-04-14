var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../shared/code');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;

};


var EH = function(err, msg, resp, session, next)
{
    console.log(session.__sessionService__.sessions);
    var uid = session.uid;
    session.kick(uid, null);
    next(null, {code: Code.FAIL});
};



var pro = Handler.prototype;

pro.login = function(msg, session, next) {
	var username = msg.userName,
		pwd = msg.password,
		self = this;

	var uid, auth, players, player;
	async.waterfall([
		function(cb) {
			// auth token
			self.app.rpc.auth.authRemote.Login(session, username, pwd, cb);
		},
		function(code, userId, authority, cb) {
			// query player info by user id
			if (code != Code.OK) {
				next(null, {
					code: code
				});
				return;
			}

			if (userId < 0) {
				next(null, {
					code: Code.ENTRY.FA_USER_NOT_EXIST
				});
				return;
			}

			uid = userId;
            auth = authority;
			//self.app.get('sessionService').kick(uid, cb);
            session.set('authority', auth);
			session.bind(uid, cb);
		},
		function(cb) {
			// session.set('playername', player.name);
			// session.set('playerId', player.id);
			session.on('closed', onUserLeave.bind(null, self.app));
			session.pushAll(cb);
		}
	], function(err) {
		if (err) {
			next(err, {
				code: Code.FAIL
			});
			return;
		}

		next(null, {
			code: Code.OK
		});
	});

};



var onUserLeave = function(app, session, reason) {
	if (!session || !session.uid) {
		return;
	}
	console.log('user leave: ' + session.uid + ' resson: ' + reason);

	app.rpc.auth.authRemote.userLeave(session, session.uid, null);

	var pid = session.get('playerId');
	app.rpc.gameplay.gameplayRemote.playerLeave(session, pid, null);

    app.rpc.league.leagueRemote.playerLeave(session, session.uid, null);

    var matchToken = session.get('matchToken');
    if (matchToken)
    {
        app.rpc.match.matchRemote.playerLeave(session, matchToken, null);
    }

};



pro.getPlayerInfo = function(msg, session, next) {
	var self = this;
	if (!session || !session.uid) {
		next(null, {
			code: Code.FA_GAMEPLAY_NOT_LOGIN
		});
		return;
	}

	self.app.rpc.gameplay.gameplayRemote.getPlayerInfo(session, session.uid, function(err, pif) {
		if (err != null) {
			console.log(err);
			next(null, {
				code: Code.FAIL
			});
			return;
		}

		session.set('playerId', pif.pid);
		session.pushAll(null);

		next(null, {
			code: Code.OK,
			player: pif
		});
	});
};

