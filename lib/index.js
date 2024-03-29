'use strict';

const Api = require('./helpers/apis');
const CONSTANT = require('./helpers/constant');
const AuthToken = require('./resources/authentication');
const _require = require('./utils/general'),
  isEmpty = _require.isEmpty;

class bSecure {
  constructor(options) {
    this.api = this.createClient(options);
    this.addResources();
  }

  createClient(_ref) {
    const environment = isEmpty(_ref) || isEmpty(_ref.environment) ? null : _ref.environment,
      client_id = isEmpty(_ref) || isEmpty(_ref.client_id) ? null : _ref.client_id,
      client_secret = isEmpty(_ref) || isEmpty(_ref.client_secret) ? null : _ref.client_secret;
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

  getCheckoutButton() {
    return this.api.checkout_btn;
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
