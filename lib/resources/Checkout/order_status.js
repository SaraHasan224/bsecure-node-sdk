'use strict';

const _require = require('../../utils/general'),
  isEmpty = _require.isEmpty;

const CONSTANT = require('../../helpers/constant');

const API_RESPONSE_HANDLER = require('../../helpers/ApiResponseHanlder');
const API_SERVICE = require('../../helpers/ApiService');
const ERROR_MESSAGES = require('../../utils/lang');
const HTTP = require('../../helpers/Http');

/** @let string The merchant order id to be used for Create Order requests. */
let orderRef = null;

function _setPayload() {
  let msg;
  if (isEmpty(orderRef)) {
    msg =
      'No order_ref provided.  (HINT: set your order_ref using ' +
      '"ORDER.getStatus(<ORDER_REF>). See"' +
      CONSTANT.DOCUMENTATION_LINK +
      ' for details, ' +
      'or email ' +
      CONSTANT.SUPPORT_EMAIL +
      ' if you have any questions.';
    return API_RESPONSE_HANDLER.failure(msg);
  } else {
    return API_RESPONSE_HANDLER.success(orderRef);
  }
}

function setResponse(response) {
  let result = response?.response;
  let status = result?.status;

  if (!response.isValid) {
    let msg = ERROR_MESSAGES.INVALID_ENVIRONMENT;
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

module.exports = function OrderStatus(api) {
  return {
    /**
     * Sets the orderRef to be used for Order Status Update requests.
     *
     * @param string orderRef
     *
     *  @return {orderRef}
     */
    setOrderRef: function (ref) {
      orderRef = ref;
      return true;
    },

    /**
     * Get your order status from bsecure server
     *
     * @param {Object} params
     * - order_ref: bSecure order reference (required)
     *
     *  @return {bSecure\ApiResponse}
     */
    getStatus: function () {
      const payloadResponse = _setPayload();
      const ORDER_STATUS = payloadResponse?.status;
      if (ORDER_STATUS === HTTP.Codes[HTTP.BAD_REQUEST]) {
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
