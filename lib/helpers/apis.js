'use strict';

class Api {
  constructor(options) {
    this.environment = options.environment;
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.access_token = options?.access_token;
    this.checkout_btn = options?.checkout_btn;
  }
}

module.exports = Api;
