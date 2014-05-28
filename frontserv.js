module.exports = (function() {
    'use strict';

    var http = require('http'),
        fs = require('fs'),
        util = require('util'),
        events = require('events'),
        mime = require('mime'),
        colors = require('colors');


    function Server(dir, host, port) {
        events.EventEmitter.call(this);

        this._dir = dir || Server.defaultDir;
        this._host = host || Server.defaultHost;
        this._port = port || Server.defaultPort;
        this._server = null;
    }
    util.inherits(Server, events.EventEmitter);


    Server.defaultDir = process.cwd();
    Server.defaultHost = 'localhost';
    Server.defaultPort = 8000;


    Server.prototype.start = function(){
        // Custon event onStart
        this.emit('onStart', {host: this._host, port: this._port, dir: this._dir});

        this._server = new http.Server();

        this._server.on('request', function(req, res){
            req.on('end', this.logger.bind(this, req, res));

            // Custon event onRequest
            this.emit('onRequest', req);

            this.handler(req, res);
        }.bind(this));

        this._server.listen(this._port, this._host);
    };


    Server.prototype.logger = function(req, res) {
        var msg = util.format('%s - [%s] "%s %s HTTP/%s" %s\n',
            req.connection.remoteAddress,
            new Date(),
            req.method,
            req.url,
            req.httpVersion,
            res.statusCode);

        if (res.statusCode === 404) {
            msg = msg.red;
        } else if (res.statusCode === 403) {
            msg = msg.blue;
        }
        util.print(msg);
    };


    Server.prototype.handler = function(req, res) {
        var path = this._dir + '/index.html';

        if (req.url !== '/') {
            path = this._dir + decodeURI(req.url);
        }

        fs.stat(path, function(err, stats){
            if (err) {
                this.handlerHttp404(req, res);
            } else if (stats.isFile()){
                this.handlerHttp200(req, res, path);
            } else {
                this.handlerHttp403(req, res);
            }
        }.bind(this));
    };


    Server.prototype.handlerHttp200 = function(req, res, path) {
        var contentType = mime.lookup(path);
        res.writeHead(200, {'Content-type': contentType});

        var readStream = fs.createReadStream(path);
        readStream.on('open', function(){
            readStream.pipe(res);
        });
        readStream.on('error', function(err){
            util.error(err);
        });
    };


    Server.prototype.handlerHttp404 = function(req, res) {
        res.writeHead(404);
        res.write('404 Not Found');
        res.end();
    };


    Server.prototype.handlerHttp403 = function(req, res) {
        res.writeHead(403);
        res.write('403 Forbidden');
        res.end();
    };

    return {
        Server: Server
    };
})();