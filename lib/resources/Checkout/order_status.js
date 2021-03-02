'use strict';

var _require = require('../../utils/general'),
  isEmpty = _require.isEmpty;

var CONSTANT = require('../../helpers/constant');

var ApiResponseHandler = require('../../helpers/ApiResponseHanlder');
var API_SERVICE = require('../../helpers/ApiService');
const ERROR_MESSAGES = require('../../utils/lang');
var Http = require('../../helpers/Http');

/** @var string The merchant order id to be used for Create Order requests. */
var orderRef = null;

function _setPayload() {
  var msg;
  if (isEmpty(orderRef)) {
    msg =
      'No order_ref provided.  (HINT: set your customer_details using ' +
      '"bSecure::setOrderId(<ARRAY>). See"' +
      CONSTANT.DOCUMENTATION_LINK +
      ' for details, ' +
      'or email ' +
      CONSTANT.SUPPORT_EMAIL +
      ' if you have any questions.';
    return ApiResponseHandler.failure(msg);
  } else {
    return ApiResponseHandler.success(orderRef);
  }
}

function setResponse(response) {
  let result = response?.response;
  let status = result?.status;

  if (!response.isValid) {
    var msg = ERROR_MESSAGES.INVALID_ENVIRONMENT;
    if (status === CONSTANT.HTTP_RESPONSE_STATUSES.VALIDATION_ERROR) {
      return ApiResponseHandler.validationError(result?.message, result?.exception, result?.body);
    } else if (status === CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS) {
      return ApiResponseHandler.success(result?.body, result?.message);
    } else {
      return ApiResponseHandler.failure(result?.message, result?.exception);
    }
  } else {
    if (status === CONSTANT.HTTP_RESPONSE_STATUSES.VALIDATION_ERROR) {
      return ApiResponseHandler.validationError(result?.message, result?.exception, result?.body);
    } else if (status === CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS) {
      return ApiResponseHandler.success(result?.body, result?.message);
    } else {
      return ApiResponseHandler.failure(result?.message, result?.exception);
    }
  }
}

module.exports = function orderApi(api) {
  return {
    /**
     * Sets the orderId to be used for Create Order requests.
     *
     * @param string orderId
     *
     *  @return {orderId}
     */
    setOrderRef: function (ref) {
      orderRef = ref;
      return true;
    },

    /**
     * Get your order status from bsecure server
     *
     * @param {Object} params
     * - order_ref: Your internal system order reference (required)
     *
     *  @return {bSecure\ApiResponse}
     */
    getStatus: function () {
      const payloadResponse = _setPayload();
      const ORDER_STATUS = payloadResponse?.status;
      if (ORDER_STATUS === Http.Codes[Http.BAD_REQUEST]) {
        return new Promise((resolve, reject) => {
          return reject(payloadResponse);
        });
      } else {
        const orderPayload = { order_ref: orderRef };
        return new Promise((resolve, reject) => {
          API_SERVICE.orderStatus(orderPayload, api)
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
