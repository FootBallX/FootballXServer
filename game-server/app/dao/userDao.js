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
var SD = require('../gameobject/staticDatas');


var userDao = module.exports;

/**
 * Get user Info by username.
 * @param {String} username
 * @param {String} passwd
 * @param {function} cb
 */
userDao.getUserInfo = function (username, cb) {
    pomelo.app.get('dbclient').do(function(db){
        db.collection('Users').findOne({userName:username}, function(err, res){
            utils.invokeCallback(cb, err, res);
        });
    });
};


userDao.getAllCardsInfo = function (cb) {
    pomelo.app.get('dbclient').do(function (db) {
        db.collection('Cards').find({}, {_id: 0}).toArray(function (err, res) {
            if (!!err) {
                utils.invokeCallback(cb, err);
            }
            else {
                utils.invokeCallback(cb, null, res);
            }
        });
    });
}


userDao.getCardGrowthInfo = function (cb) {
    pomelo.app.get('dbclient').do(function (db) {
        db.collection('CardGrowth').find({}, {_id: 0}).toArray(function (err, res) {
            if (!!err) {
                utils.invokeCallback(cb, err);
            }
            else {
                utils.invokeCallback(cb, null, res);
            }
        });
    });
}


userDao.Login = function (un, pwd, callback) {
    var dbc = pomelo.app.get('dbclient');
    var uid, auth;
    dbc.do(function(db){
        var oluCol = db.collection('OnlineUsers');
        async.waterfall([
            function(cb) {
                db.collection('Users').findOne({userName:un, password:pwd}, {_id:0, uid:1, authority:1}, cb);
            },
            function(res, cb) {
                if (null != res) {
                    uid = res.uid;
                    auth = res.authority;
                    oluCol.insert({uid: uid, state: 0}, cb);
                }
                else {
                    cb(new Error('Wrong username or password!'));
                }
            }
        ], function(err) {
            if (!!err) {
                utils.invokeCallback(callback, null, Code.FAIL);
                return;
            }

            utils.invokeCallback(callback, null, Code.OK, uid, auth);
        });
    });
};


userDao.logout = function (uid, callback) {
    var dbc = pomelo.app.get('dbclient');
    var uid, auth;
    dbc.do(function(db){
        db.collection('OnlineUsers').remove({uid: uid}, callback);
    });
};


userDao.getPlayerInfo = function (uid, callback) {
    var dbc = pomelo.app.get('dbclient');
    dbc.do(function(db){
        var pcol = db.collection('Players');
        pcol.insert({uid:uid, nickName:"", level:1, money:0, formationId:0, maxCardId:0}, function(err, res){
            pcol.findOne({uid:uid}, {_id:0}, function(err, player){
                if (!!err){
                    utils.invokeCallback(callback, err);
                }
                else {
                    utils.invokeCallback(callback, null, Code.OK, player);
                }
            });
        });
    });
}



userDao.kickAllUser = function (cb) {
    pomelo.app.get('dbclient').do(function(db){
        db.collection('OnlineUsers').remove({}, cb);
    });
};



//获取上场球员属性
userDao.getCardsOnDuty = function(uid, callback) {
    var dbc = pomelo.app.get('dbclient');

    dbc.do(function(db){
        db.collection('Players').aggregate([
            {$unwind: "$cards"},
            {$match:{uid:uid}},
            {$project:{_id:0, cards:1}},
            {$sort:{'cards.formationPos':1}},
            {$limit:11}
        ], function(err,result){
            if (!!err) {
                utils.invokeCallback(callback, err);
            }
            else {
                var cards = [];
                var idx = 0;
                for (var card in result) {
                    var c = result[card].cards;
                    if (c.formationPos == idx) {
                        cards.push(c);
                    }
                    else {
                        break;
                    }

                    idx++;
                }

                if (cards.length != 11)
                {
                    utils.invokeCallback(callback, new Error('The number of cards on duty mast be 11'));
                    return;
                }

                var calcCards = [];
                for (idx = 0; idx < 11; ++idx) {
                    var c = cards[idx];
                    var data = SD.calcCards(c.pcId, c.cid, c.level, c.formationPos);
                    if (null == data) {
                        utils.invokeCallback(callback, new Error('Fail to calc card properties!'));
                        return;
                    }
                    calcCards.push(data);
                }

                utils.invokeCallback(callback, null, calcCards);
            }
        });
    });


//    var sql = 'call getCardsOnDuty(?)';
//    var args = [uid]
//
//    dbc.query(sql, args, function(err, res) {
//        if (err) {
//            utils.invokeCallback(callback, err);
//        }
//        else {
//            utils.invokeCallback(callback, null, res[0]);
//        }
//    });
}