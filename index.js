var Validator = require('validator').Validator;

var ValidationError = function(msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'ValidationError';
    this.message = msg;
    this.statusCode = 400;
};

ValidationError.prototype.__proto__ = Error.prototype;

function mk_validator(fn) {
    return function() {
        var str = this.str;
        var res = fn.apply(str, arguments);
        if (res && typeof res === 'string') {
            this.error(this.msg || res);
        }

        return this;
    }
}

// create the middleware to inject .assert
var middleware = function(opt) {
    opt = opt || {};

    // add any custom validators
    for (var name in opt) {
        if (!opt.hasOwnProperty(name)) {
            continue;
        }

        Validator.prototype[name] = mk_validator(opt[name]);
    }

    function param(req, name) {
        // express provides param lookup for us
        if (req.param) {
            return req.param(name);
        }

        if (this.body && undefined !== this.body[name]) {
            return this.body[name];
        }

        if (this.query && undefined !== this.query[name]) {
            return this.query[name];
        }

        return;
    }

    return function(req, res, next) {
        req.assert = function(name, msg) {
            var val = param(req, name);

            var validator = new Validator();

            validator.error = function(msg) {
                var err = new ValidationError(msg);
                err.param = name;
                err.value = val;

                throw err;
            }

            return validator.check(val, msg)
        };

        next();
    }
};

middleware.ValidationError = ValidationError;

module.exports = middleware;
