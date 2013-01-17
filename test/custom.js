var assert = require('assert');
var connect = require('connect');
var request = require('supertest');

var veto = require('../');

var app = connect();

var custom = {
    isFooBar: function() {
        if (this !== 'foobar') {
            return 'not equal to foobar';
        }
    }
};

test('setup', function(done) {
    app.use(connect.bodyParser());
    app.use(veto(custom));

    app.use(function(req, res) {
        req.assert('foo').isFooBar();

        // should not get here
        assert.ok(false);
    });

    app.use(function(err, req, res, next) {
        res.statusCode = err.statusCode;
        res.end(JSON.stringify({
            msg: err.message,
            param: err.param,
            value: err.value
        }));
    });

    app.listen(done);
});

test('req', function(done) {
    request(app)
        .post('/')
        .expect(400)
        .end(function(err, res) {
            var body = JSON.parse(res.text);

            assert.equal(body.msg, 'not equal to foobar');
            assert.equal(body.param, 'foo');
            done(err);
        });
});

