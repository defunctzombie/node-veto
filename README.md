# veto

middleware to validate parameters

## example

```javascript
var veto = require('veto');

app.use(veto());

app.get('/', function(req, res, next) {

    // assert that the email parameter is an email
    // will throw a veto.ValidationError if it isn't
    req.assert('email').isEmail();

    // we can be sure email is of email format
});

// an express error handler will receive the thrown error
app.use(function(err, req, res, next) {
    // err.statusCode will be 400
    // err instanceOf veto.ValidationError
});
```
