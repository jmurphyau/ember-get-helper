/* jshint node: true */
'use strict';

var VersionChecker = require('ember-cli-version-checker');

var hasBeenWarned = false;

module.exports = {
  name: 'ember-get-helper',

  init: function() {
    var checker = new VersionChecker(this);

    this._super.init && this._super.init.apply(this, arguments);

    this._emberVersionChecker = this.for('ember-source', 'npm');
    if (!this._emberVersionChecker.version) {
      this._emberVersionChecker = checker.for('ember', 'bower');
    }
  },

  treeFor: function() {
    if (this._emberVersionChecker.lt('2.0.0-beta.1')) {
      return this._super.treeFor.apply(this, arguments);
    } else if (this.parent === this.project) {
      if (!hasBeenWarned) {
        console.warn('ember-get-helper is not required for Ember 2.0.0 and later (a default `get` helper is included with Ember), please remove from your `package.json`.');
        hasBeenWarned = true;
      }
    }
  }
};
