var express = require('..');

var assert = require('assert');

describe('middleware', function() {

  var app;
  beforeEach(function() {
    app = express();
  });

  it('chains middleware together', function() {
    var called = '';
    app.use(function(req, res, next) {
      called += 1;
      next();
    });
    app.use(function(req, res, next) {
      called += 2;
      next();
    });
    app.use(function() {
      called += 3;
    });
    app(null, null);
    assert.equal(called, '123');
  });

});
