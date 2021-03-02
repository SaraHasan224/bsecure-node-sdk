'use strict';

var CONSTANT = require('../helpers/constant');
var API_SERVICE = require('../helpers/ApiService');
var ApiHandler = require('../helpers/apis');
var ERROR_MESSAGES = require('../utils/lang');

var ApiResponseHandler = require('../helpers/ApiResponseHanlder');

let payload;

function generateAuthToken(api) {
  /*
   * Initializes Access token to Access bSecure APIs
   *
   * @param {Object} params
   * - client_id
   * - client_secret
   * - grant_type
   * @param {Function} callback
   *
   * @return {Promise}
   */
  return API_SERVICE.verifyClientAcessToken(payload, api.environment)
    .then((response) => {
      const token = setAuthToken(response, response?.tokenError);
      var environment = api.environment,
        client_id = payload.client_id,
        client_secret = payload.client_secret,
        access_token = token?.body?.access_token,
        checkout_btn = token?.body?.checkout_btn;
      return {
        environment: environment,
        client_id: client_id,
        client_secret: client_secret,
        access_token: access_token,
        checkout_btn: checkout_btn,
      };
    })
    .catch((error) => {
      const error_response = error?.response;
      let response = {
        token: null,
        isValid: false,
        tokenError: error_response,
      };
      return setAuthToken(response, response?.tokenError);
    });
}

function _setAuthenticationPayload(api) {
  payload = {
    grant_type: 'client_credentials',
    client_id: api.client_id,
    client_secret: api.client_secret,
  };
  return true;
}

function setAuthToken(response) {
  let status = response?.body?.status;
  let body = response?.body?.body;
  if (!response.isValid) {
    var msg = ERROR_MESSAGES.INVALID_ENVIRONMENT;
    if (status === CONSTANT.HTTP_RESPONSE_STATUSES.VALIDATION_ERROR) {
      return ApiResponseHandler.validationError(response?.msg, null, body);
    } else if (status === CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS) {
      return ApiResponseHandler.success(body, response?.msg);
    } else {
      return ApiResponseHandler.failure(msg, response?.body?.exception, response?.body?.message);
    }
  } else {
    return ApiResponseHandler.success(body, response?.msg);
  }
}

function createClient(response) {
  return new ApiHandler(response);
}

module.exports = function AuthToken(api) {
  return {
    /**
     * Create an order on your builder's behalf on bsecure server
     *
     * @param {Object} params
     * - order_id: Your internal system order id (required)
     * - customer: Your customer details (required)
     * - products: Order items (required)
     *
     *  @return {bSecure\ApiResponse}
     */
    generate: async function () {
      _setAuthenticationPayload(api);
      return generateAuthToken(api)
        .then((result) => {
          const updatedClient = createClient(result);
          return updatedClient;
        })
        .catch((error) => {
          return error;
        });
    },
  };
};
