var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../shared/code');
var PM = require('../../../gameobject/playerManager');
var pomelo = require('pomelo');

var handler = module.exports;


handler.getHomeInfo = function(msg, session, next)
{
//    console.log(pomelo.app);
    var pid = session.settings.playerId;
    userDao.getHomeInfo(pid, function(err, rs){
        if (err)
        {
            next(null, {code: Code.FAIL});
        }
        else
        {
            next(null, {code: Code.OK, info: rs});
        }
    });
}


handler.buildInHome = function(msg, session, next) {
    console.error(process.memoryUsage());
    var DTUnit = pomelo.app.get('DTUnit');
    var bname = msg.bname;
    var buildData = DTUnit[bname];
    if (buildData === undefined)
    {
        next(null, {code: Code.GAMEPLAY.HOME.FA_BUILD_WRONG_NAME});
        return;
    }
    var x = msg.x;
    var y = msg.y;
    var w = buildData.gridWidth;
    var h = buildData.gridHeight;
    var state = Code.UNIT_STATE.US_BUILDING;
    var pid = session.settings.playerId;

    userDao.buildInHome(pid, bname, state, x, y, w, h, function(err, code, bid){
        if (code == Code.OK)
        {
            next(null, {code: code, bid: bid});
        }
        else
        {
            next(null, {code: code});
        }

    });
};


handler.moveBuilding = function(msg, session, next)
{
    var bid = msg.bid;
    var x = msg.x;
    var y = msg.y;
    var pid = session.get('playerId');

    userDao.moveBuildingInHome(pid, bid, x, y, function(err, code){
        next(null, {code: code});
    });

}



handler.removeBuilding = function(msg, session, next){
    var bid = msg.bid;
    var pid = session.get('playerId');

    userDao.removeBuildingInHome(pid, bid, function(err, code){
        next(null, {code: code});
    });
}