'use strict';
const _require = require('../utils/general'),
  isEmpty = _require.isEmpty;

class Api {
  constructor(options) {
    this.environment = options.environment;
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.access_token = isEmpty(options?.access_token) ? null : options?.access_token;
    this.checkout_btn = isEmpty(options?.checkout_btn) ? null : options?.checkout_btn;
  }
}

module.exports = Api;
