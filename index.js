var Validator = require('validator').Validator;

var ValidationError = function(msg) {
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'ValidationError';
    this.statusCode = 400;
};

ValidationError.prototype.__proto__ = Error.prototype;

// create the middleware to inject .assert
var middleware = function() {
    return function(req, res, next) {
        req.assert = function(name, msg) {
            var val = req.param(name);

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
