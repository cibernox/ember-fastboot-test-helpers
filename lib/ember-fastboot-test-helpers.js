var RSVP    = require('rsvp');
var request = RSVP.denodeify(require('request'));
var jsdom   = require("jsdom").jsdom;

function moduleForFastboot(name, opts) {
  var opts = opts || {};

  function visit(path) {
    return request('http://localhost:3201' + path)
      .then(function(response) {
        return [
          response.statusCode,
          response.headers,
          jsdom(response.body).defaultView.document
        ];
      });
  }

  QUnit.module('Fastboot: ' + name, {
    beforeEach: function() {
      this.visit = visit.bind(this);

      if (opts.beforeEach) {
        opts.beforeEach.call(this);
      }

    },

    afterEach() {
      // Kill the app
      if (opts.beforeEach) {
        opts.beforeEach.call(this);
      }
    }
  });
}

module.exports = {
  moduleForFastboot: moduleForFastboot
};