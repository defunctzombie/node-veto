var assert = require('assert');
var connect = require('connect');
var request = require('supertest');

var veto = require('../');

var app = connect();

suite('get');

test('setup', function(done) {
    app.use(connect.bodyParser());
    app.use(connect.query());
    app.use(veto());

    app.use(function(req, res) {
        var foo = req.assert('foo', 'should be bar').get();
        res.end(foo);
    });

    app.use(function(err, req, res, next) {
        res.statusCode = err.statusCode;
        res.end(err.message);
    });

    app.listen(done);
});

test('POST', function(done) {
    request(app)
        .post('/')
        .send({ foo: 'bar' })
        .expect(200)
        .end(function(err, res) {
            assert.equal(res.text, 'bar');
            done(err);
        });
});

test('GET', function(done) {
    request(app)
        .get('/?foo=bar')
        .expect(200)
        .end(function(err, res) {
            assert.equal(res.text, 'bar');
            done(err);
        });
});

