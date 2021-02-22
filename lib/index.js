'use strict';

var Api = require('./helpers/apis');
const ApiResponseHanlder = require('./helpers/ApiResponseHanlder');
const API_SERVICE = require('./helpers/ApiService');
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

  generateAuthToken() {
    let that = this;
    return new Promise(function (resolve, reject) {
      var data = {
        grant_type: 'client_credentials',
        client_id: that.api.client_id,
        client_secret: that.api.client_secret,
      };

      API_SERVICE.verifyClientAcessToken(data)
        .then((response) => {
          console.log('then', response);
          const result = that.setAuthToken(response);
          resolve(result);
        })
        .catch((error) => {
          console.log('catch');
          const error_response = error?.response;
          that.token = null;
          that.validToken = false;
          that.tokenError = error_response;
          response = {
            token: null,
            validToken: false,
            tokenError: error_response,
          };
          const result = that.setAuthToken(response);
          reject(result);
        });
    });
  }

  setAuthToken(response) {
    // console.log('response',response);

    if (!response.validToken) {
      var msg =
        'Error in generating auth token.  (HINT: set your customer_details using ' +
        '"bSecure::setOrderId(<ARRAY>). See"' +
        CONSTANT.DOCUMENTATION_LINK +
        ' for details, ' +
        'or email ' +
        CONSTANT.SUPPORT_EMAIL +
        ' if you have any questions.';
      return ApiResponseHanlder.failure(msg, null, response?.tokenError);
    } else {
      return ApiResponseHanlder.success(response.token);
    }
  }

  addResources() {
    Object.assign(this, {
      Orders: require('./resources/Checkout/order_create')(this.api),
    });
  }
}

module.exports = bSecure;
