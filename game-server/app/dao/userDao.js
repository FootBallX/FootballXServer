//var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
//var dataApi = require('../util/dataApi');
//var Player = require('../domain/entity/player');
//var User = require('../domain/user');
//var consts = require('../consts/consts');
//var equipmentsDao = require('./equipmentsDao');
//var bagDao = require('./bagDao');
//var fightskillDao = require('./fightskillDao');
//var taskDao = require('./taskDao');
var async = require('async');
var utils = require('../util/utils');
//var consts = require('../consts/consts');
var token = require('../shared/token');
var Code = require('../shared/code');

var userDao = module.exports;

/**
 * Get user Info by username.
 * @param {String} username
 * @param {String} passwd
 * @param {function} cb
 */
userDao.getUserInfo = function (username, cb) {
    var sql = 'select * from Users where userName = ?';
    var args = [username];

    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            utils.invokeCallback(cb, err, null);
        } else {
            var userId = 0;
            if (!!res && res.length === 1) {
                var rs = res[0];
                utils.invokeCallback(cb, null, rs);
            } else {
                utils.invokeCallback(cb, null, {
                    uid: -1
                });
            }
        }
    });
};


userDao.Login = function (un, pwd, callback) {
    var dbc = pomelo.app.get('dbclient');
    var sql = 'call login(?, ?)';
    var args = [un, pwd];
    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, null, Code.FAIL);
        } else {
            res.pop();
            var uid = res[0][0].out_uid;
            var auth = res[1][0].out_auth;
            if (uid >= 0) {
                utils.invokeCallback(callback, null, Code.OK, uid, auth);
            } else {
                utils.invokeCallback(callback, null, Code.FAIL);
            }
        }
    });


};


userDao.logout = function (uid, callback) {
    var dbc = pomelo.app.get('dbclient');
    var sql = 'delete from OnlineUser where uid = ?'
    var args = [uid];

    dbc.query(sql, args, function (err, res) {
        utils.invokeCallback(callback, err);
    });
};


userDao.getPlayerInfo = function (uid, callback) {
    var dbc = pomelo.app.get('dbclient');
    var sql = 'call getORcreatePlayerInfo(?)';
    var args = [uid];

    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, err);
        } else {
            var player = res[0][0];

            // if (uid >= 0)
            // {
            // 	utils.invokeCallback(callback, null, Code.OK, uid);
            // }
            // else
            // {
            // 	utils.invokeCallback(callback, null, Code.FAIL);
            // }
            utils.invokeCallback(callback, null, Code.OK, player);
        }
    });
}


userDao.getHomeInfo = function (pid, callback) {
    var dbc = pomelo.app.get('dbclient');
    var sql = 'select * from Home where pid = ?';
    var args = [pid];

    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, err);
        } else {
            utils.invokeCallback(callback, null, res);
        }
    });
}


userDao.buildInHome = function (pid, bname, state, x, y, w, h, callback) {
    var dbc = pomelo.app.get('dbclient');
    var sql = 'call buildInHome(?, ?, ?, ?, ?, ?, ?)';
    var args = [pid, bname, state, x, y, w, h];
    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, null, Code.FAIL);
        } else {
            res.pop();
            var bid = res[0][0].out_bid;
            if (bid >= 0) {
                utils.invokeCallback(callback, null, Code.OK, bid);
            } else {
                utils.invokeCallback(callback, null, Code.FAIL);
            }
        }
    });
}



userDao.moveBuildingInHome = function(pid, bid, x, y, callback){
    var dbc = pomelo.app.get('dbclient');
    var sql = 'call setNewPosInHome(?, ?, ?, ?)';
    var args = [pid, bid, x, y];
    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, null, Code.FAIL);
        } else {
            res.pop();
            var ret = res[0][0].ret;
            if (ret >= 0) {
                utils.invokeCallback(callback, null, Code.OK);
            } else {
                utils.invokeCallback(callback, null, Code.FAIL);
            }
        }
    });
}



userDao.removeBuildingInHome = function(pid, bid, callback){
    var dbc = pomelo.app.get('dbclient');
    var sql = 'call removeBuildingFromHome(?, ?)';
    var args = [pid, bid];
    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, null, Code.FAIL);
        } else {
            res.pop();
            var ret = res[0][0].ret;
            if (ret >= 0) {
                utils.invokeCallback(callback, null, Code.OK);
            } else {
                utils.invokeCallback(callback, null, Code.FAIL);
            }
        }
    });
}



/////   for admin users!


userDao.kickAllUser = function (callback) {
    var dbc = pomelo.app.get('dbclient');

    var sql = 'call kickOnlineUsers';
    var args = []
    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, null, Code.FAIL);
        } else {
            utils.invokeCallback(callback, null, Code.OK);
        }
    });
};




userDao.clearHomeBuildings = function (pid, callback) {
    var dbc = pomelo.app.get('dbclient');

    var sql = 'call admin_clearHomeBuildings(?)';
    var args = [pid]
    dbc.query(sql, args, function (err, res) {
        if (err != null) {
            console.log(err);
            utils.invokeCallback(callback, null, Code.FAIL);
        } else {
            utils.invokeCallback(callback, null, Code.OK);
        }
    });
};

//获取上场球员属性
userDao.getCardsOnDuty = function(pid, callback) {
    var dbc = pomelo.app.get('dbclient');

    var sql = 'call getCardsOnDuty(?)';
    var args = [pid]

    dbc.query(sql, args, function(err, res) {
        if (err) {
            utils.invokeCallback(callback, err);
        }
        else {
            utils.invokeCallback(callback, null, res[0]);
        }
    });
}