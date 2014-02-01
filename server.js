#!/usr/bin/env node

var optimist = require('optimist'),
    StaticServer = require('./index.js').StaticServer;

// Вывод справочной информации
if (optimist.argv.help || optimist.argv.h) {
    console.log('Frontend static server\n' +
        '--dir  [dirname]       directory (default: current)\n' +
        '--host [host]          server host (default: localhost)\n' +
        '--port [port]          server port (default: 8000)\n' +
        '--help | -h            show help\n');
    process.exit(0);
}

// Получение параметров командной строки
var dir = optimist.argv.dir,
    host = optimist.argv.host,
    port = optimist.argv.port;

// Создание сервера статики
var server = new StaticServer(dir, host, port);
server.start();