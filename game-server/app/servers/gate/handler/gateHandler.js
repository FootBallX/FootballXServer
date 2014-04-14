var Code = require('../../../shared/code');
var dispatcher = require('../../../util/dispatcher');

/**
 * Gate handler that dispatch user to connectors.
 */
module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

Handler.prototype.queryConnectorEntry = function(msg, session, next) {
	var connectors = this.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		next(null, {
			code: Code.GATE.FA_NO_SERVER_AVAILABLE
		});
		return;
	}

	// check usename and password
	this.app.rpc.auth.authRemote.auth(session, msg, function(err, code, uid) {
		if (err != null || code != Code.OK) {
			next(null, {
				code: code
			});
			return;
		}

		if (!uid) {
			next(null, {
				code: Code.FAIL
			});
			return;
		}

		var res = dispatcher.dispatch(uid, connectors);
		next(null, {
			code: Code.OK,
			host: res.host,
			port: res.clientPort
		});
	});

};
