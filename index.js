// Подключение модулей
var http = require('http'),
    fs = require('fs'),
    util = require('util'),
    mime = require('mime'),
    colors = require('colors');


// Сервер раздачи статических файлов
function StaticServer(dir, host, port){
    this.dir = dir || process.cwd();
    this.host = host || 'localhost';
    this.port = port || 8000;
    this.server = null;
}

StaticServer.prototype = {
    constructor: StaticServer,

    // Запуск сервера
    start: function(){
        // Создаем новый сервер
        this.server = new http.Server();
        // Назначаем обработчик запросов
        this.server.on('request', function(req, res){
            // Подключаем метод который будет вызван в конце обработки запроса
            req.on('end', function(){
                this.finishRequest(req, res);
            }.bind(this));
            // Запускаем обработчик запроса
            this.requestListener(req, res);
        }.bind(this));
        // Запускаем сервер прослушивать запросы на указанный порт
        this.server.listen(this.port, this.host);
        console.log('Run server: http://%s:%s\nStatic dir: %s\n', this.host, this.port, this.dir);
    },

    // Метод обработки HTTP-запросов
    requestListener: function(req, res){
        var pathname = this.dir + '/index.html';
        if (req.url !== '/'){
            pathname = this.dir + req.url;
        }
        // Получаем информацию о файле
        fs.stat(pathname, function(err, stats){
            if (err) {
                this.requestHTTP404(req, res);
            } else if (stats.isFile()){
                this.requestHTTP200(pathname, req, res);
            } else {
                this.requestHTTP403(req, res);
            }
        }.bind(this));
    },

    // Отдаем файл клиенту
    requestHTTP200: function(pathname, req, res){
        var contentType = mime.lookup(pathname);
        res.writeHead(200, {'Content-type': contentType});

        var readStream = fs.createReadStream(pathname);
        readStream.on('open', function(){
            // По каналу передаем контент файла в Response-объект
            readStream.pipe(res);
        });
        readStream.on('error', function(err){
            console.log(err);
        });
    },

    // Файл не найден
    requestHTTP404: function(req, res){
        res.writeHead(404);
        res.write('404 Not Found');
        res.end();
    },

    // Что-то найдено, но это не файл
    requestHTTP403: function(req, res){
        res.writeHead(403);
        res.write('403 Forbidden');
        res.end();
    },

    // Метод вызываемый в конце обработки запроса
    finishRequest: function(req, res){
        var msg = util.format('%s - [%s] "%s %s HTTP/%s" %s',
            req.connection.remoteAddress,
            new Date(),
            req.method,
            req.url,
            req.httpVersion,
            res.statusCode);

        if (res.statusCode === 404) {
            console.log(msg.red);
        } else if (res.statusCode === 403) {
            console.log(msg.blue);
        } else {
            console.log(msg);
        }
    }
};

// Экспортируем публичные типы
exports.StaticServer = StaticServer;