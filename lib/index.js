'use strict';

var Api = require('./helpers/apis');
var pkg = require('../package.json');
const ApiResponseHanlder = require('./helpers/ApiResponseHanlder');
const CONSTANT = require('./helpers/constant');

class bSecure {
  constructor(options) {
    try {
      this.validate(options);
    } catch (err) {
      throw err;
    }
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
      case CONSTANT.ENVIRONMENT.PRODUCTION:
        empty = this.empty(client_secret);
        break;
      default:
        throw new Error('invalid environment');
    }

    if (empty) {
      throw new Error('api keys for ' + environment + ' are missing');
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
    });
  }

  async generateAuthToken() {
    const resp = await this.api.generateAuthToken();
    console.log(!resp.validToken);
    console.log(resp);
    if (!resp.validToken) {
      var msg =
        'Error in generating auth token.  (HINT: set your customer_details using ' +
        '"bSecure::setOrderId(<ARRAY>). See"' +
        CONSTANT.DOCUMENTATION_LINK +
        ' for details, ' +
        'or email ' +
        CONSTANT.SUPPORT_EMAIL +
        ' if you have any questions.';
      throw new Error(msg, null, resp.tokenError);
    } else {
      return resp.token;
    }
  }

  addResources() {
    Object.assign(this, {
      Orders: require('./resources/Checkout/order_create')(this.api),
    });
  }
}

module.exports = bSecure;
