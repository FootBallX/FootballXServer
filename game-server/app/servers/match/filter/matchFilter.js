var pomelo = require('pomelo');
var MM = require('../../../gameobject/matchManager');

module.exports = function() {
	return new Filter();
};

var Filter = function() {
};

/**
 * Area filter
 */
Filter.prototype.before = function(msg, session, next){
    var t = session.get('matchToken');

    MM.checkToken(t, function(err){
       if (err)
       {
           next(err);
           return;
       }

        next();
    });
};