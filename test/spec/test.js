var path = require('path');
var request = require('request');
var Frontserv = require('../../');


describe('test basic functionality', function() {
    var server;

    beforeEach(function(done) {
        server = new Frontserv({
            dir: path.resolve(__dirname, '../www-data')
        });
        server.listen(done);
    });

    afterEach(function() {
        server.close();
    });

    it('not found page', function(done) {
        request('http://localhost:8000/', function(err, res, body) {
            if (err) {
                done.fail(err);
            } else {
                expect(res.statusCode).toEqual(404);
                done();
            }
        });
    });

    it('get home.html', function(done) {
        request('http://localhost:8000/home.html', function(err, res, body) {
            if (err) {
                done.fail(err);
            } else {
                expect(res.statusCode).toEqual(200);
                expect(body).toMatch(/Welcome to the home page/);
                done();
            }
        });
    });
});
