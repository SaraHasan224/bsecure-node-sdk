'use strict';
const Http = require('./Http');
const CONSTANT = require('../utils/lang');

/**
 * @param array $body
 * @param string $message
 * @return \Http\JsonResponse
 */
function success(body = [], message = CONSTANT.GENERAL.SUCCESS) {
  return send(Http.Codes[Http.SUCCESS], message, body, null);
}

/**
 * @return \Http\JsonResponse
 */
function authenticationError() {
  return send(Http.Codes[Http.UNAUTHORISED], CONSTANT.GENERAL.UNAUTHENTICATED, {}, null);
}

/**
 * @param string $message
 * @param null $exception
 * @param array $body
 * @return \Http\JsonResponse
 */
function failure(message = CONSTANT.GENERAL.FAILURE, exception = null, body = []) {
  return send(Http.Codes[Http.BAD_REQUEST], message, body, exception);
}

/**
 * @param string $message
 * @param null $exception
 * @param array $body
 * @return \Http\JsonResponse
 */
function validationError(message = CONSTANT.GENERAL.FAILURE, exception = null, body = []) {
  return send(Http.Codes[Http.VALIDATION_ERROR], message, body, exception);
}
/**
 * @param status
 * @param message
 * @param body
 * @param exception
 * @return \Http\JsonResponse
 */
function send(status, message, body, exception) {
  return {
    status: status,
    message: message,
    body: body,
    exception: exception,
  };
  //     return response()->json({
  //         'status'    :  $status,
  //         'message'   :  $message,
  //         'body'      :  $body,
  //         'exception' :  $exception
  // }, $status, [], JSON_UNESCAPED_UNICODE );
}

module.exports = {
  success: success,
  authenticationError: authenticationError,
  failure: failure,
  validationError: validationError,
};
