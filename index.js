require('object.assign').shim();

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
  }
};

module.exports = function express() {
  function app(req, res) { app.handle(req, res); }
  Object.assign(app, prototype, { stack: [] });
  return app;
};
