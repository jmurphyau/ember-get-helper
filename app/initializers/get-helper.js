import Em from 'ember';
import { registerHelper } from 'ember-get-helper/utils/register-helper';

import getHelper from 'ember-get-helper/helpers/get';
import getHelperGlimmer from 'ember-get-helper/helpers/get-glimmer';

export function initialize(/* container, application */) {
  if (Em.Helper) {
    registerHelper('get', getHelperGlimmer);
  } else {
    registerHelper('get', getHelper);
  }
}

export default {
  name: 'get-helper',
  initialize: initialize
};
