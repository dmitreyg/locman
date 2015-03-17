
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var nconf = require('nconf');
var extdirect = require('extdirect');
var LocmanService = require('./direct/LocmanService');

nconf.env().file({ file: 'config.json' });

var ServerConfig = nconf.get("ServerConfig"),
    ExtDirectConfig = nconf.get("ExtDirectConfig");

// Asynchronous
var httpAuth = express.basicAuth(function(user, pass, callback) {
    //var result = (user === 'user' && pass === 'password');

    var passwdData = LocmanService.parseJsonFileSync(ServerConfig.appDataFolder + '/passwd.json');
    var result = false;
    passwdData.forEach(function (passwdRecord)  {
        if (!result && passwdRecord.name == user && passwdRecord.value == pass) {
            result = true;
        }
    });


    callback(null /* error */, result);
});


//passport-local
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        return done(null, {
            username: 'fake-user'
        });
    }
));


var app = express();
app.configure(function() {
	// all environments
	app.set('port', process.env.PORT || ServerConfig.port);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);

    //app.use(express.basicAuth('testUser', 'testPass')); //// Authenticator

    app.use(require('stylus').middleware(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'public')));
});


//Important to get CORS headers and cross domain functionality
if (ServerConfig.enableCORS) {
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.options(ExtDirectConfig.classPath, function (request, response) {
        response.writeHead(200, { 'Allow': ServerConfig.allowedMethods });
        response.end();
    });
}

//GET method returns API
app.get(ExtDirectConfig.apiPath, function (request, response) {
    try {
        var api = extdirect.getAPI(ExtDirectConfig);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(api);
    } catch (e) {
        console.log(e);
    }
});

// Ignoring any GET requests on class path
app.get(ExtDirectConfig.classPath, function (request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ success: false, msg: 'Unsupported method. Use POST instead.' }));
});

// POST request process route and calls class
app.post(ExtDirectConfig.classPath, function (request, response) {
    extdirect.processRoute(request, response, ExtDirectConfig);
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', httpAuth, routes.index); //httpAuth,

app.get('/download', function(req, res){

    var folder = req.query.folder;
    var file = req.query.file;

    if (file && file.length > 0) {
        var fileContent = LocmanService.getFile(folder, file);
        res.attachment(file);
        res.end(fileContent, 'utf8');
    } else {
        var zipFileContent = LocmanService.zipFolder(folder);
        var zipFileName = folder + ".zip";
        res.attachment(zipFileName);
        res.end(zipFileContent);
    }
});

//app.get('/login', routes.user); //httpAuth,


//app.post('/login',
//    passport.authenticate('local', { successRedirect: '/',
//        failureRedirect: '/login',
//        failureFlash: true })
//);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
