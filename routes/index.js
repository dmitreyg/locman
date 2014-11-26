var nconf = require('nconf');
nconf.env().file({ file: 'config.json' });
var ServerConfig = nconf.get("ServerConfig");


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index',
      {
          title: 'Localization Manager',
          port: ServerConfig.port,
          apiKey: ServerConfig.translateApiKey,
          apiUrl: ServerConfig.translateApiUrl
      });
};