'use strict';

var Api = require('./helpers/apis');
const CONSTANT = require('./helpers/constant');
const AuthToken = require('./resources/authentication');

class bSecure {
  constructor(options) {
    this.validate(options);
    this.api = this.createClient(options);
    this.addResources();
  }

  validate(_ref) {
    var environment = _ref.environment,
      client_id = _ref.client_id,
      client_secret = _ref.client_secret;
    var empty = void 0;
    switch (environment) {
      case CONSTANT.ENVIRONMENT.SANDBOX:
        empty = this.empty(client_id);
        break;
      case CONSTANT.ENVIRONMENT.LIVE:
        empty = this.empty(client_secret);
        break;
      default:
        return new Error('invalid environment');
    }
    if (empty) {
      throw new Error(`api keys for ${environment} are missing`);
    }
  }

  empty() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return Object.keys(options).every(function (o) {
      return !options[o];
    });
  }

  createClient(_ref) {
    var environment = _ref.environment,
      client_id = _ref.client_id,
      client_secret = _ref.client_secret;
    return new Api({
      environment: environment,
      client_id: client_id,
      client_secret: client_secret,
      access_token: null,
      checkout_btn: null,
    });
  }

  createToken() {
    return AuthToken(this.api)
      .generate()
      .then((response) => {
        this.api = response;
        this.addResources();
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  addResources() {
    Object.assign(this, {
      Order: require('./resources/Checkout/order_create')(this.api),
      OrderStatus: require('./resources/Checkout/order_status')(this.api),
      SingleSignOn: require('./resources/SSO/client-authenticate')(this.api),
    });
  }
}

module.exports = bSecure;
