var http = require('http');
var fs = require('fs');
var url = require('url');
var util = require('util');
var path = require('path');
var mime = require('mime');


/**
 * @class Frontserv
 * @extends http.Server
 * @param {*} [opts]
 * @param {String} [opts.host]
 * @param {Number} [opts.port]
 * @param {String} [opts.dir]
 * @param {Boolean} [opts.autoindex=false]
 */
function Frontserv(opts) {
    http.Server.call(this);
    opts = opts || {};

    var dir = opts.dir || process.cwd();
    dir = path.isAbsolute(dir) ? dir : path.resolve(dir);
    // To make read-only.
    Object.defineProperties(this, {
        host: {get: function(){return opts.host || 'localhost'}},
        port: {get: function(){return opts.port || 8000}},
        dir: {get: function(){return dir}},
        autoindex: {get: function(){return opts.autoindex || false}}
    });
    this.on('request', this.requestListener.bind(this));
}

util.inherits(Frontserv, http.Server);

/**
 * The request handler.
 * @param {*} req
 * @param {*} res
 */
Frontserv.prototype.requestListener = function(req, res) {
    var reqUrl = decodeURI(req.url),
        reqPath = url.parse(reqUrl).pathname,
        fsPath = path.join(this.dir, reqPath);

    fs.stat(fsPath, function(err, stats) {
        if (err) {
            res.writeHead(404);
            res.end('404 Page not found.');
        } else {
            if (stats.isFile()) {
                var mimeType = mime.lookup(fsPath),
                    readStream = fs.createReadStream(fsPath);
                res.writeHead(200, {'Content-type': mimeType});
                readStream.on('open', function(){
                    readStream.pipe(res);
                });
                readStream.on('error', function(err) {
                    util.error(err);
                });
            } else {
                if (this.autoindex) {
                    fs.readdir(fsPath, function(err, files) {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error: ' + err.message);
                        } else {
                            var title = 'Index of ' + reqPath,
                                content = '';

                            // List files
                            res.writeHead(200, {'Content-type': 'text/html'});

                            // Hide files.
                            files = files.filter(function(name) {
                                return !/^\./.test(name);
                            });

                            content += '<h1>Index of ' + reqPath + '</h1>';

                            if (files.length) {
                                content += '<ul>';
                                files.forEach(function(name) {
                                    content += util.format('<li><a href="%s">%s</a></li>', path.join(reqPath, name), name);
                                });
                                content += '</ul>';
                            } else {
                                content += '<p>Directory is empty</p>';
                            }

                            res.write(
                                '<!DOCTYPE html>' +
                                '<html>' +
                                    '<head>' +
                                        '<meta charset="utf-8">' +
                                        '<title>' + title + '</title>' +
                                    '</head>' +
                                    '<body>' + content + '</body>' +
                                '</html>');
                            res.end();
                        }
                    });
                } else {
                    // Redirect
                    res.writeHead(302, {'Location': reqPath + 'index.html'});
                    res.end();
                }
            }
        }
    }.bind(this));
};

/**
 * Listen to requests
 * @param {Function} [cb]
 */
Frontserv.prototype.listen = function(cb) {
    http.Server.prototype.listen.call(this, this.port, this.host, cb);
};

module.exports = Frontserv;
