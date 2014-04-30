var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var sync = require('pomelo-sync-plugin');
var connectorFilter = require('./app/servers/connector/filter/connectorFilter');
var gameplayCommon = require('./app/servers/gameplay/handler/common');
var matchCommon = require('./app/servers/match/handler/common');
var gameplayFilter = require('./app/servers/gameplay/filter/gameplayFilter');
var leagueFilter = require('./app/servers/league/filter/leagueFilter');
var matchFilter = require('./app/servers/match/filter/matchFilter');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'FootballXServer');


app.route('match', routeUtil.match);
app.route('gameplay', routeUtil.gameplay);

app.loadConfig('mysql', app.getBase() + '/config/mysql.json');

// Configure database
app.configure('production|development', 'auth|connector|league|gameplay|match', function () {
    var dbclient = require('./app/dao/mysql/mysql').init(app);
    app.set('dbclient', dbclient);
    app.use(sync, {sync: {path: __dirname + '/app/dao/mapping', dbclient: dbclient}});
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
});


// Configure for gameplay server
app.configure('production|development', 'gameplay', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));
    app.filter(pomelo.filters.serial());

    app.before(gameplayFilter());
    app.set('errorHandler', gameplayCommon.ErrorHandler);

});


// Configure for league server
app.configure('production|development', 'league', function () {
    // load session congfigures
    app.set('session', require('./config/session.json'));

    app.filter(pomelo.filters.serial());

    app.before(leagueFilter());
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

