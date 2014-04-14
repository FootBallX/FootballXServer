var Code = require('../../../shared/code');

var handler = module.exports;

handler.ErrorHandler = function(err, msg, resp, session, next)
{
    session.__sessionService__.kickByUid(session.frontendId, session.uid, null);

    next(null, {code: Code.FAIL});
};




