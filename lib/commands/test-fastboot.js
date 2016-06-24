module.exports = {
  name: 'test:fastboot',
  description: 'Tests your application when running in fastboot mode.',

  availableOptions: [
    { name: 'build', type: Boolean, default: true },
    { name: 'environment', type: String, default: 'test'},
    { name: 'serve-assets', type: Boolean, default: true },
    { name: 'host', type: String, default: '::' },
    { name: 'port', type: Number, default: 3000 },
    { name: 'output-path', type: String, default: 'dist' },
    { name: 'assets-path', type: String, default: 'dist' }
  ],


  build: function(options) {
    var BuildTask = this.tasks.Build;
    return new BuildTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    }).run(options);
  },

  executeTests: function(options) {
    var helpers = require('../helpers');
    var host = options.host;
    if (/^:/.test(host)) {
      host = `[${host}]`;
    }
    return helpers.executeTests(`http://${host}:${options.port}`, this.project.root);
  },

  run: function(options) {
    var ServerTask = require('ember-cli-fastboot/lib/tasks/fastboot-server');
    var serverTask = new ServerTask({
      ui: this.ui
    });

    return this.build(options)
      .then(() => serverTask.start(options))
      .then(() => this.executeTests(options))
      .then(() => serverTask.stop());
  }
};
