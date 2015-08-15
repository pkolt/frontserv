var path = require('path');
var request = require('request');
var Frontserv = require('../../');


describe('test autoindex', function() {
    var server;

    beforeEach(function(done) {
        server = new Frontserv({
            autoindex: true,
            dir: path.resolve(__dirname, '../www-data')
        });
        server.listen(done);
    });

    afterEach(function() {
        server.close();
    });

    it('get list files', function(done) {
        request('http://localhost:8000/', function(err, res, body) {
            if (err) {
                done.fail(err);
            } else {
                expect(res.statusCode).toEqual(200);
                expect(body).toMatch(/home\.html/);
                expect(body).not.toMatch(/\.htaccess/);
                done();
            }
        });
    });
});
