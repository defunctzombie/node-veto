var assert = require('assert');
var connect = require('connect');
var request = require('supertest');

var veto = require('../');

var app = connect();

test('setup', function(done) {
    app.use(connect.bodyParser());
    app.use(veto());

    app.use(function(req, res) {
        req.assert('foo').is(/bar/);

        // should no get here
        assert.ok(false);
    });

    app.use(function(err, req, res, next) {
        res.statusCode = err.statusCode;
        res.end(err.message);
    });

    app.listen(done);
});

test('req', function(done) {
    request(app)
        .post('/')
        .send({})
        .expect(400)
        .end(function(err, res) {
            done(err);
        });
});

