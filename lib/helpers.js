var RSVP    = require('rsvp');
var request = RSVP.denodeify(require('request'));
var jsdom   = require("jsdom").jsdom;
var parentModule = require('..');
var fastbootURL;

module.exports = {
  executeTests(url, projectRoot) {
    return new Promise(resolve => {
      fastbootURL = url;
      var QUnit = require('qunitjs');

      parentModule.moduleForFastboot = function(name, opts) {
        opts = opts || {};

        function visit(path) {
          console.log(fastbootURL + path);
          return request(fastbootURL + path)
            .then(function(response) {
              return {
                statusCode: response.statusCode,
                headers: response.headers,
                document: jsdom(response.body).defaultView.document
              };
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
            if (opts.beforeEach) {
              opts.beforeEach.call(this);
            }
          }
        });
      };

      parentModule.test = QUnit.test;
      parentModule.module = QUnit.module;
      parentModule.QUnit = QUnit;

      // adds test reporting
      var qe = require('qunit-extras');
      global.QUnit = QUnit;
      qe.runInContext(global);

      var glob = require('glob');
      var root = projectRoot + '/fastboot-tests/';

      function addFiles(files) {
        glob.sync(root + files)
          .map(name => name.replace(/\.js$/g, ''))
          .forEach(require);
      }

      addFiles('/**/*-test.js');

      QUnit.done(resolve);
      QUnit.load();
    });
  }
};
