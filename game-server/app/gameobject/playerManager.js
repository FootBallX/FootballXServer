var Player = require('./player')
var util = require('util');

var exp = module.exports;

var players = {};

exp.createPlayer = function(opt) {
	if (players[opt.pid]) {
		return false;
	}

	p = new Player(opt);

	players[p.pid] = p

	return true;
};



exp.getPlayer = function(pid) {
	return players[pid];
}


exp.removePlayer = function(pid) {
	if (!players[pid]) return false;
	delete players[pid];

	return true;
}
