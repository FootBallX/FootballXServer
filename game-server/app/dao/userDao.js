var logger = require('pomelo-logger').getLogger('pomelo', __filename);
var pomelo = require('pomelo');
var async = require('async');
var utils = require('../util/utils');
var token = require('../shared/token');
var Code = require('../shared/code');
var SD = require('../gameobject/staticDatas');


var userDao = module.exports;

userDao.getUserInfo = function (username, cb) {
    pomelo.app.get('dbclient').do(function(db, cleanUp){
        db.collection('Users').findOne({userName:username}, function(err, res){
            utils.invokeCallback(cb, err, res);
            cleanUp();
        });
    });
};


userDao.getAllCardsInfo = function (cb) {
    pomelo.app.get('dbclient').do(function (db, cleanUp) {
        db.collection('Cards').find({}, {_id: 0}).toArray(function (err, res) {
            if (!!err) {
                utils.invokeCallback(cb, err);
            }
            else {
                utils.invokeCallback(cb, null, res);
            }
            cleanUp();
        });
    });
}


userDao.getCardGrowthInfo = function (cb) {
    pomelo.app.get('dbclient').do(function (db, cleanUp) {
        db.collection('CardGrowth').find({}, {_id: 0}).toArray(function (err, res) {
            if (!!err) {
                utils.invokeCallback(cb, err);
            }
            else {
                utils.invokeCallback(cb, null, res);
            }
            cleanUp();
        });
    });
}


userDao.Login = function (un, pwd, callback) {
    var dbc = pomelo.app.get('dbclient');
    var uid, auth;
    dbc.do(function(db, cleanUp){
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
            }
            else{
                utils.invokeCallback(callback, null, Code.OK, uid, auth);
            }

            cleanUp();
        });
    });
};


userDao.logout = function (uid, callback) {
    var dbc = pomelo.app.get('dbclient');
    var uid, auth;
    dbc.do(function(db, cleanUp){
        db.collection('OnlineUsers').remove({uid: uid}, function(err){
            utils.invokeCallback(callback, err);
            cleanUp();
        });
    });
};


userDao.getPlayerInfo = function (uid, callback) {
    var dbc = pomelo.app.get('dbclient');
    dbc.do(function(db, cleanUp){
        var pcol = db.collection('Players');
        pcol.insert({uid:uid, nickName:"", level:1, money:0, formationId:0, maxCardId:0}, function(err, res){
            pcol.findOne({uid:uid}, {_id:0}, function(err, player){
                if (!!err){
                    utils.invokeCallback(callback, err);
                }
                else {
                    utils.invokeCallback(callback, null, Code.OK, player);
                }

                cleanUp();
            });
        });
    });
}



userDao.kickAllUser = function (cb) {
    pomelo.app.get('dbclient').do(function(db, cleanUp){
        db.collection('OnlineUsers').remove({}, function(err){
            utils.invokeCallback(cb, err);
            cleanUp();
        });
    });
};



//获取上场球员属性
userDao.getCardsOnDuty = function(uid, callback) {
    var dbc = pomelo.app.get('dbclient');
    dbc.do(function(db, cleanUp){
        db.collection('Players').aggregate([
            {$unwind: "$cards"},
            {$match:{uid:uid}},
            {$project:{_id:0, cards:1}},
            {$sort:{'cards.formationPos':1}},
            {$limit:11}
        ], function(err,result){
            if (!!err) {
                console.error(err);
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
                    cleanUp();
                    return;
                }

                var calcCards = [];
                for (idx = 0; idx < 11; ++idx) {
                    var c = cards[idx];
                    var data = SD.calcCards(c.pcId, c.cid, c.level, c.formationPos);
                    if (null == data) {
                        utils.invokeCallback(callback, new Error('Fail to calc card properties!'));
                        cleanUp();
                        return;
                    }
                    calcCards.push(data);
                }

                utils.invokeCallback(callback, null, calcCards);
            }

            cleanUp();
        });
    });
}