'use strict';

var _require = require('../../utils/general'),
  isEmpty = _require.isEmpty;

var CONSTANT = require('../../helpers/constant');

var API_RESPONSE_HANDLER = require('../../helpers/ApiResponseHanlder');
var API_SERVICE = require('../../helpers/ApiService');
const ERROR_MESSAGES = require('../../utils/lang');

function setResponse(response) {
  let result = response?.response;
  let status = result?.status;

  if (!response.isValid) {
    var msg = ERROR_MESSAGES.INVALID_ENVIRONMENT;
    if (status === CONSTANT.HTTP_RESPONSE_STATUSES.VALIDATION_ERROR) {
      return API_RESPONSE_HANDLER.validationError(result?.message, result?.exception, result?.body);
    } else if (status === CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS) {
      return API_RESPONSE_HANDLER.success(result?.body, result?.message);
    } else {
      return API_RESPONSE_HANDLER.failure(result?.message, result?.exception);
    }
  } else {
    if (status === CONSTANT.HTTP_RESPONSE_STATUSES.VALIDATION_ERROR) {
      return API_RESPONSE_HANDLER.validationError(result?.message, result?.exception, result?.body);
    } else if (status === CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS) {
      return API_RESPONSE_HANDLER.success(result?.body, result?.message);
    } else {
      return API_RESPONSE_HANDLER.failure(result?.message, result?.exception);
    }
  }
}

function _createAuthenticationURL(api, state) {
  var login_app_url = CONSTANT.LOGIN_REDIRECT_URL;

  var scope = 'scope=profile';
  var response_type = '&response_type=code';
  var client_id = '&client_id=' + api?.client_id;
  var state = '&state=' + state;

  return login_app_url + '?' + scope + response_type + client_id + state;
}

module.exports = function clientAuthenticate(api) {
  return {
    /**
     * Sets the authentication url for bsecure single-sign-on application.
     *
     * @param string state
     *
     *  @return {bSecure\ApiResponse}
     */
    authenticateClient: function (state) {
      if (isEmpty(state)) {
        msg =
          'No state provided.  (HINT: set your state using ' +
          '"bSecure.SingleSignOn.authenticateClient(<STATE>). See"' +
          CONSTANT.DOCUMENTATION_LINK +
          ' for details, ' +
          'or email ' +
          CONSTANT.SUPPORT_EMAIL +
          ' if you have any questions.';
        return API_RESPONSE_HANDLER.failure(msg);
      } else {
        return _createAuthenticationURL(api, state);
      }
    },

    /**
     * Get your order status from bsecure server
     *
     * @param {Object} params
     * - order_ref: Your internal system order reference (required)
     *
     *  @return {bSecure\ApiResponse}
     */
    getCustomerProfile: function (code) {
      var msg;
      if (isEmpty(code)) {
        return new Promise((resolve, reject) => {
          msg =
            'No auth_code provided.  (HINT: set your auth_code using ' +
            '"bSecure.SingleSignOn.authenticateClient(<AUTH_CODE>). See"' +
            CONSTANT.DOCUMENTATION_LINK +
            ' for details, ' +
            'or email ' +
            CONSTANT.SUPPORT_EMAIL +
            ' if you have any questions.';
          return reject(API_RESPONSE_HANDLER.failure(msg));
        });
      } else {
        const payload = { code: code };
        return new Promise((resolve, reject) => {
          API_SERVICE.customerProfile(payload, api)
            .then((resp) => {
              let response = setResponse(resp);
              return resolve(response);
            })
            .catch((error) => {
              let response = setResponse(error);
              return reject(response);
            });
        });
      }
    },
  };
};
