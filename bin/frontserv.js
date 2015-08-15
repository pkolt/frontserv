#!/usr/bin/env node

var util = require('util');
var colors = require('colors');
var program = require('commander');
var Frontserv = require('../');
var pkg = require('../package.json');


program
    .version(pkg.version)
    .option('-d, --dir [value]', 'root directory (default: process.cwd())')
    .option('-H, --host [value]', 'server host (default: localhost)')
    .option('-p, --port [value]', 'server port (default: 8000)')
    .option('--autoindex', 'show list of files in the directory')
    .parse(process.argv);


var server = new Frontserv({
    dir: program.dir,
    host: program.host,
    port: program.port,
    autoindex: program.autoindex
});

server.listen(function() {
    console.log('Run server: http://%s:%s', server.host, server.port);
    console.log('Root directory: %s', server.dir);
});

server.on('request', function(req, res) {
    req.on('end', function() {
        var msg = util.format('%s - [%s] "%s %s HTTP/%s" %s',
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
        console.log(msg);
    });
});
