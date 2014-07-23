var EventEmitter = require('events').EventEmitter;
var util = require('util');

var HOME_MAP_WIDTH = 100;
var HOME_MAP_HEIGHT = 100;

var Player = function(opts) {
	EventEmitter.call(this);
	this.uid = opts.uid;
	this.nickname = opts.nickname;
	this.level = opts.level;
	this.money = opts.money;
	this.mineral = opts.mineral;
	this.gas = opts.gas;
};

util.inherits(Player, EventEmitter);


module.exports = Player;
