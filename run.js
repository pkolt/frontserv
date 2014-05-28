#!/usr/bin/env node

var util = require('util'),
    optimist = require('optimist'),
    Server = require('./frontserv.js').Server,

    pkg = require('./package.json'),
    argv = optimist.argv,
    help = '********************************************************\n' +
           '*  Simple static server for frontend                   *\n' +
           '********************************************************\n' +
           '--dir     | -d [dirname]    Root directory (default: %s)\n' +
           '--host    | -H [host]       Server host (default: %s)\n' +
           '--port    | -p [port]       Server port (default: %s)\n' +
           '--version | -v              Show version\n' +
           '--help    | -h              Show help\n';


if (argv.help || argv.h) {
    // Show help
    util.print(util.format(help, Server.defaultDir, Server.defaultHost, Server.defaultPort));
} else if (argv.version || argv.v) {
    // Show version
    util.print(util.format('v%s\n', pkg.version));
} else {
    // Run server
    var dir = argv.dir || argv.d,
        host = argv.host || argv.H,
        port = argv.port || argv.p,
        server = new Server(dir, host, port);

    server.on('onStart', function(data){
        util.print(util.format('Run server: http://%s:%s\n', data.host, data.port));
        util.print(util.format('Root directory: %s\n', data.dir));
    });

    server.start();
}