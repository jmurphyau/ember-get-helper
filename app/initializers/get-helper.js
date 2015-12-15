import Em from 'ember';
import { registerHelper } from 'ember-get-helper/utils/register-helper';

import getHelper from 'ember-get-helper/helpers/get';

export function initialize(/* container, application */) {
  // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
  // will be auto-discovered.
  if (Em.Helper) {
    return;
  }

  registerHelper('get', getHelper);
}

export default {
  name: 'get-helper',
  initialize: initialize
};
