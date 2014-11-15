require('object.assign').shim();
var http = require('http');
var util = require('util');

var prototype = {
  handle: function handle(req, res) {
    var stack = this.stack;
    var stackIndex = -1;
    (function next() {
      stackIndex ++;
      stack[stackIndex](req, res, next);
    })();
  },
  use: function use(handler) {
    this.stack.push(handler);
  },
  listen: function listen() {
    var server = http.createServer(this);
    server.listen.apply(server, arguments);
  }
};

['get', 'head', 'options', 'post', 'put', 'delete'].forEach(function(method) {
  prototype[method] = function(route, handler) {
    this.stack.push(function(req, res, next) {
      var methodMatches = method === req.method.toLowerCase();
      var routeMatches;
      if (util.isRegExp(route)) {
        routeMatches = route.test(req.url);
      } else {
        routeMatches = route == req.url;
      }
      if (methodMatches || routeMatches) {
        handler(req, res, next);
      } else {
        next();
      }
    });
  };
});

module.exports = function express() {
  function app(req, res) { app.handle(req, res); }
  Object.assign(app, prototype, {
    stack: []
  });
  return app;
};
