/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-fastboot-test-helpers',
  includedCommands: function() {
    return {
      'test:fastboot': require('./lib/commands/test-fastboot')
    };
  }
};
