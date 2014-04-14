var async = require('async');
var userDao = require('../../../dao/userDao');
var Code = require('../../../shared/code');
var PM = require('../../../gameobject/playerManager');

var handler = module.exports;


handler.clearHomeBuildings = function(msg, session, next)
{
    var auth = session.get('authority');
    var pid  = session.get('playerId');
    if ( auth > 0)
    {
        userDao.clearHomeBuildings(pid, function(err, code){
            if (err || code != Code.OK)
            {
                next(null,{code: Code.FAIL});
            }
            else
            {
                next(null, {code: Code.OK});
            }
        });
    }
    else
    {
        next(new Error('Are you hacker?'));
    }
}