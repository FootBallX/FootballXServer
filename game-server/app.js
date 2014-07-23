var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var sync = require('pomelo-sync-plugin');
var connectorFilter = require('./app/servers/connector/filter/connectorFilter');
var gameplayCommon = require('./app/servers/gameplay/handler/common');
var matchCommon = require('./app/servers/match/handler/common');
var gameplayFilter = require('./app/servers/gameplay/filter/gameplayFilter');
var leagueFilter = require('./app/servers/league/filter/leagueFilter');
var matchFilter = require('./app/servers/match/filter/matchFilter');
var userDao = require('./app/dao/userDao');
var SD = require('./app/gameobject/staticDatas');

/**
 * Init app for client.
 */

var app = pomelo.createApp();
app.set('name', 'FootballXServer');


app.route('match', routeUtil.match);
app.route('gameplay', routeUtil.gameplay);

app.loadConfig('mongoDBConfig', app.getBase() + '/config/mongoDB.json');

// Configure database
app.configure('production|development', 'auth|connector|league|gameplay|match', function () {
    var dbclient = require('./app/dao/mongoDB/mongoDB').init(app);
    app.set('dbclient', dbclient);
});
// app configuration
app.configure('production|development', 'connector', function () {
//    app.before(connectorFilter());
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 100,
            useDict: true,
            useProtobuf: true
        });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            useDict: true,
            useProtobuf: true
        });

});
// Configure for auth server
app.configure('production|development', 'auth', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));

    userDao.kickAllUser(function(err){
        if (!!err){
            console.error(err);
            console.error("make sure that database had been started");
        }
    });

    userDao.getCardsOnDuty(4, function(err, res){
        if (!err) {
            console.dir(res);
        }
    });

//    userDao.getUserInfo('tes0', function(err, res){
//        if (!!err)
//        {
//            console.log('eee1');
//            console.error(err);
//        }
//        else {
//            console.log(res);
//
//        }
//    });
});


// Configure for gameplay server
app.configure('production|development', 'gameplay', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));
    app.filter(pomelo.filters.serial());

    app.before(gameplayFilter());
    app.set('errorHandler', gameplayCommon.ErrorHandler);

    SD.init(function(err){
        if (!!err)
        {
            console.error(err);
        }
    });
});


// Configure for league server
app.configure('production|development', 'league', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));

    app.filter(pomelo.filters.serial());

    app.before(leagueFilter());

    SD.init(function(err){
        if (!!err)
        {
            console.error(err);
        }
    });


});

// Configure for match server
app.configure('production|development', 'match', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));

    app.filter(pomelo.filters.serial());

    app.before(matchFilter());

    app.set('errorHandler', matchCommon.ErrorHandler);
});

// start app
app.start();


process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});

