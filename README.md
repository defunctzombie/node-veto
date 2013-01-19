# veto [![Build Status](https://secure.travis-ci.org/shtylman/node-veto.png?branch=master)](http://travis-ci.org/shtylman/node-veto) #

middleware to validate parameters

## install

```
npm install veto
```

## example

```javascript
var veto = require('veto');

app.use(veto());

app.get('/', function(req, res, next) {

    // assert that the email parameter is an email
    // will throw a veto.ValidationError if it isn't
    var email = req.assert('email').isEmail().get();

    // asserts can be chained
    var foo = req.assert('foo').isAlpha().len(4, 10).get();

    // and also accept custom messages
    var baz = req.assert('baz', 'must be a number').isNumeric().get();

    // we can be sure email is of email format
});

// an express error handler will receive the thrown error
app.use(function(err, req, res, next) {
    // err.statusCode will be 400
    // err instanceOf veto.ValidationError
});
```

## things you can veto

* is(regex)
* not(regex)
* isEmail()
* isUrl()
* isIP()
* isAlpha()
* isAlphanumeric()
* isNumeric()
* isInt()
* isDecimal()
* notNull()
* isNull()
* notEmpty()
* equals(equals)
* contains(str)
* notContains(str)
* len(min [, max])
* isUUID(version) //Version can be 3 or 4 or empty
* isIn(arr | str)
* notIn(arr | str)
* max(val)
* min(val)
* isArray()

## adding your own

You can add your own things to veto by providing an object to the ```veto()```. Each ```ownProperty``` of the object which is a function will be added.

```this``` in the function will refer to the parameter to assert.

To indicate an error, return a string. Otherwise don't return anything.

```javascript
var additional = {
    isFooBar: function() {
        if (this !== 'foobar') {
            return 'should equal foobar';
        }
    }
};

app.use(veto(additional));

app.get('/', function(req, res) {
    var foo = req.assert('foo').isFooBar().get();
});
```

## capturing errors

Veto asserts throw. This means that the error handler middleware will be called as soon as a veto fails. You can easily handle the error there and send any relevant response back to the user.

```javascript
app.use(veto());

app.get('/', function(req, res) {
    var foo = req.assert('foo').isEmail().get();
});

// error handler for failed assertions
app.use(function(err, req, res, next) {
    // veto errors are of instance veto.ValidationError
    // err.statusCode is 400
    // err.param is the name of the parameter that failed
    // err.value is the user specified parameter value
    // err.message is an error message

    // you can check specifically for veto errors with
    err instanceof veto.ValidationError
});
```
