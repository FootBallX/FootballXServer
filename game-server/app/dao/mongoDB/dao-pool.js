var mongodb = require("mongodb");
var poolModule = require('generic-pool');

var createMongoPool = function(app)
{
    var mongoDBConfig = app.get('mongoDBConfig');
    return poolModule.Pool({
        name: 'mongodb',
        create: function (callback) {
            mongodb.MongoClient.connect(mongoDBConfig.url, {
                server: {poolSize: 1}
            }, function (err, db) {
                callback(err, db);
            });
        },
        destroy: function (db) {
            db.close();
        },
        max: 10,//根据应用的可能最高并发数设置
        idleTimeoutMillis: 30000,
        log: false
    });
}


exports.createMongoPool = createMongoPool;
