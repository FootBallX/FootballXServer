var utils = require('../util/utils');

var exp = module.exports;

var matchs = {};

var globalToken = 0;

exp.createMatch = function(p1, p2, time, callback)
{
    // TODO: token生成算法
    var token = ++globalToken;

    if (matchs[token])
    {
        utils.invokeCallback(callback, new Error('wrong match token'));
        return;
    }

    p1['ready'] = false;
    p1['dominator'] = false;
    p2['ready'] = false;
    p2['dominator'] = false;
    var mc = {p1:p1, p2:p2, token:token, time:time};

    matchs[token] = mc;

    utils.invokeCallback(callback, null, token);
}


exp.destroyMatch = function(token, callback)
{
    var p;
    var mc = matchs[token];
    if (mc)
    {
        delete matchs[token];
        utils.invokeCallback(callback, null, [mc.p1, mc.p2]);

        return;
    }

    utils.invokeCallback(callback, null, null);
}


exp.update = function(dt, callback)
{
    // TODO: 检查超时比赛
}


exp.checkToken = function(token, callback)
{
    if (matchs[token])
    {
        utils.invokeCallback(callback, null);
        return;
    }

    utils.invokeCallback(callback, new Error('invalid token'));
}


exp.ready = function(token, uid, callback)
{
    var mc = matchs[token];

    if (mc.p1.uid == uid)
    {
        mc.p1.ready = true;
    }
    else if (mc.p2.uid == uid)
    {
        mc.p2.ready = true;
    }
    else
    {
        utils.invokeCallback(callback, new Error('wrong uid'));
        return;
    }

    if (mc.p1.ready && mc.p2.ready) {
        var num = new Date().getTime() % 2;
        if (num == 0)
        {
            mc.p1.dominator = true;
            mc.p2.dominator = false;
        }
        else
        {
            mc.p1.dominator = false;
            mc.p2.dominator = true;
        }

        utils.invokeCallback(callback, null, true, [mc.p1, mc.p2]);
        return;
    }

    utils.invokeCallback(callback, null, false);
}


exp.getOpponent = function(token, uid, callback)
{
    var mc = matchs[token];
    var p;
    if (mc.p1.uid == uid)
    {
        p = mc.p2;
    }
    else if (mc.p2.uid == uid)
    {
        p = mc.p1;
    }
    else
    {
        utils.invokeCallback(callback, new Error('uid error!'));
        return;
    }

    utils.invokeCallback(callback, null, [p]);
}



exp.swichDominator = function(token, callback)
{
    var num = new Date().getTime() % 2;
    var mc = matchs[token];

    if (num == 0)
    {
        mc.p1.dominator = true;
        mc.p2.dominator = false;
        utils.invokeCallback(callback, null, mc.p1.uid, mc.p2.uid);
    }
    else
    {
        mc.p1.dominator = false;
        mc.p2.dominator = true;
        utils.invokeCallback(callback, null, mc.p2.uid, mc.p1.uid);
    }


}



exp.checkDominator = function(token, uid, callback)
{
    var mc = matchs[token];

    if (mc.p1.uid == uid)
    {
        utils.invokeCallback(callback, null, mc.p1.dominator);
        return;
    }
    else if (mc.p2.uid == uid)
    {
        utils.invokeCallback(callback, null, mc.p2.dominator);
        return;
    }

    utils.invokeCallback(callback, null, false);
}