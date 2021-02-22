'use strict';
const CONSTANT = require('./constant');
const BASE_URL = CONSTANT.BASE_URL;

var API_SERVICE = require('./ApiService');

class Api {
  constructor(options) {
    this.token = null;
    this.validToken = null;
    this.tokenError = null;

    (this.environment = options.environment),
      (this.client_id = options.client_id),
      (this.client_secret = options.client_secret);
  }

  async generateAuthToken() {
    try {
      var data = {
        grant_type: 'client_credentials',
        client_id: this.client_id,
        client_secret: this.client_secret,
      };
      return API_SERVICE.verifyClientAcessToken(data);
    } catch (error) {
      const error_response = error?.response;
      this.token = null;
      this.validToken = false;
      this.tokenError = error_response;
      const resp = {
        token: null,
        validToken: false,
        tokenError: error_response,
      };
      return resp;
    }
  }
}

module.exports = Api;
