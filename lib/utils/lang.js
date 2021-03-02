const CONSTANT = require('../helpers/constant');

const APPEND_MSG =
  'See ' +
  CONSTANT.DOCUMENTATION_LINK +
  ' for details, ' +
  'or email ' +
  CONSTANT.SUPPORT_EMAIL +
  ' if you have any questions.';

var msg = {};
var GENERAL = {
  SUCCESS: '',
  UNAUTHENTICATED: '',
  FAILURE: '',
};

GENERAL.SUCCESS = 'Success';
GENERAL.UNAUTHENTICATED = 'Access forbidden. ' + APPEND_MSG;
GENERAL.FAILURE = 'Request failed. ' + APPEND_MSG;
msg.GENERAL = GENERAL;

msg.INVALID_ENVIRONMENT =
  'Invalid environment selection detected.  (HINT: set valid environment. ' +
  'You can find your app_environment ' +
  "in your bSecure Builder's dashboard at " +
  CONSTANT.BUILDERS_DASHBOARD_LINK +
  ', after registering your account as a platform. ' +
  APPEND_MSG;

msg.INVALID_AUTH_TOKEN =
  'Error in generating auth token.  (HINT: set your credentials using ' + '"new bSecure(<CONFIG>). ' + APPEND_MSG;

msg.NOT_FOUND_AUTH_TOKEN =
  'No app credentials found.  (HINT: set your credentials using ' +
  '"new bSecure(<CONFIG>)". ' +
  'You can find your app credentials ' +
  "in your bSecure Builder's dashboard at " +
  CONSTANT.BUILDERS_DASHBOARD_LINK +
  ', after registering your account as a platform. ' +
  APPEND_MSG;

module.exports = {
  GENERAL: msg.GENERAL,
  INVALID_ENVIRONMENT: msg.INVALID_ENVIRONMENT,
  INVALID_AUTH_TOKEN: msg.INVALID_AUTH_TOKEN,
  NOT_FOUND_AUTH_TOKEN: msg?.NOT_FOUND_AUTH_TOKEN,
};
