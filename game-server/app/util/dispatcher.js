var crc = require('../../node_modules/pomelo/node_modules/crc/lib/crc');

var number = 0;

module.exports.dispatch = function(uid, connectors) {
    var index = number % connectors.length;
    number++;
	return connectors[index];
};
