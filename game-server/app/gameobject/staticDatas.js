var utils = require('../util/utils');
var dao = require('../dao/userDao');
var async = require('async');

var Cards = {};
var CardGrowth = {};


var exp = module.exports;

exp.init = function(callback) {

    async.series([
        function(cb) {
            dao.getAllCardsInfo(function(err, res) {
                if (!!err) {
                    utils.invokeCallback(cb, err);
                    return;
                }
                else {
                    for (var idx in res) {
                        var c = res[idx];
                        Cards[c.idCards] = c;
                    }

                    utils.invokeCallback(cb, null);
                }
            });
        },

        function(cb) {
            dao.getCardGrowthInfo(function(err, res) {
                if (!!err) {
                    utils.invokeCallback(cb, err);
                    return;
                }
                else {
                    for (var idx in res) {
                        var c = res[idx];
                        CardGrowth[c.idGrowth] = c;
                    }

                    utils.invokeCallback(cb, null);
                }
            });
        }

    ], function(err) {
        utils.invokeCallback(callback, err);
    })
};


exp.calcCards = function(pcId, cid, level, formationPos) {
    var card = Cards[cid];
    if (!card) {
        return null;
    }

    var growth = CardGrowth[card.growthId];

    if (!growth) {
        return null;
    }


    return {
        pcId : pcId,
        icon : card.icon,
        quality : card.quality,
        strength: card.strength + level * growth.strength * growth.param1 + growth.param2,
        speed: card.speed + level * growth.speed * growth.param1 + growth.param2,
        dribbleSkill: card.dribbleSkill + level * growth.dribbleSkill * growth.param1 + growth.param2,
        passSkill: card.passSkill + level * growth.passSkill * growth.param1 + growth.param2,
        shootSkill: card.shootSkill + level * growth.shootSkill * growth.param1 + growth.param2,
        defenceSkill: card.defenceSkill + level * growth.defenceSkill * growth.param1 + growth.param2,
        attackSkill: card.attackSkill + level * growth.attackSkill * growth.param1 + growth.param2,
        groundSkill: card.groundSkill + level * growth.groundSkill * growth.param1 + growth.param2,
        airSkill: card.airSkill + level * growth.airSkill * growth.param1 + growth.param2,
        formationPos : formationPos
    };
}
