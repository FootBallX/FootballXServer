// mongoDB CRUD
var mdbClient = module.exports;
var utils = require('../../util/utils');

var _pool;

var NND = {};

/*
 * Init sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function(app){
	_pool = require('./dao-pool').createMongoPool(app);
};

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {fuction} cb Callback function.
 * 
 */
NND.query = function(sql, args, cb){
	_pool.acquire(function(err, client) {
		if (!!err) {
			console.error('[sqlqueryErr] '+err.stack);
			return;
		}
		client.query(sql, args, function(err, res) {
			_pool.release(client);
			cb(err, res);
		});
	});
};


NND.do = function(cb){
    _pool.acquire(function(err, client){
        if (!!err){
            console.error('[mongoDB pool acqure error]' + err.stack);
            return;
        }

        utils.invokeCallback(cb, client);
    })
}

/**
 * Close connection pool.
 */
NND.shutdown = function(){
	_pool.destroyAllNow();
};


/**
 * init database
 */
mdbClient.init = function(app) {
	if (!!_pool){
		return mdbClient;
	} else {
		NND.init(app);
		mdbClient.do = NND.do;
		return mdbClient;
	}
};

/**
 * shutdown database
 */
mdbClient.shutdown = function(app) {
	NND.shutdown(app);
};






