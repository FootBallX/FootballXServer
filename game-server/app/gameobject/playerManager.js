var Player = require('./player')
var util = require('util');

var exp = module.exports;

var players = {};

exp.createPlayer = function(opt) {
	if (players[opt.uid]) {
		return false;
	}

	p = new Player(opt);

	players[p.uid] = p

	return true;
};



exp.getPlayer = function(uid) {
	return players[uid];
}


exp.removePlayer = function(uid) {
	if (!players[uid]) return false;
	delete players[uid];

	return true;
}
