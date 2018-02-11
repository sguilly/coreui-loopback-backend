'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.register = function(persistedModel, ws) {
    persistedModel[ws.path] = ws.method

    persistedModel.remoteMethod(
        ws.path, ws.options
    );
}

require('json.date-extensions');

JSON.useDateParser();


console.log('Stage=' + process.env.STAGE)


var bunyan = require('bunyan');
var bformat = require('bunyan-format')
var formatOut = bformat({ outputMode: 'simple', color: true, levelInString: true })


app.log = bunyan.createLogger({
    name: process.env.STAGE == 'beta' ? "beta" : "prod",
    level: 'trace',
    src: true,

    streams: [

        {
            type: 'rotating-file',
            path: 'api.log',
            period: '1d', // daily rotation
            count: 30 // keep 3 back copies
        },
        {
            stream: formatOut,
            level: 'trace'
        },
        // {
        //     type: 'raw',
        //     stream: gelfStream
        // }
    ]
});

app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});