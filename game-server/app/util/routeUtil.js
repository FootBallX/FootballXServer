var exp = module.exports;

var g_gameServerNum = 0;

exp.match = function(session, msg, app, cb) {
    var matchs = app.getServersByType('match');
	var serverId = session.get('matchServerId');

	if(!matchs || matchs.length === 0) {
		cb(new Error('can not find server info for type: ' + msg.serverType));
		return;
	}

    if (serverId === undefined || serverId < 0 || serverId >= matchs.length)
    {
        cb(new Error('match serverId error: ' + serverId));
        return;
    }

	cb(null, matchs[serverId].id);
};

exp.gameplay = function(session, msg, app, cb) {
	if(!session) {
		cb(new Error('fail to route to gameplay server for session is empty'));
		return;
	}

    var gameplays = app.getServersByType('gameplay');
    if (!gameplays || gameplays.length === 0){
        cb(new Error('fail to route to gameplay server for there is no gameplay server'));
        return;
    }

	cb(null, gameplays[g_gameServerNum % gameplays.length].id);

    ++g_gameServerNum;
};
