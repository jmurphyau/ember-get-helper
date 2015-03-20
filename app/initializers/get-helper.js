import { registerHelper } from 'ember-get-helper/utils/register-helper';

import getHelper from 'ember-get-helper/helpers/get';

export function initialize(/* container, application */) {
  registerHelper('get', getHelper);
}

export default {
  name: 'get-helper',
  initialize: initialize
};
