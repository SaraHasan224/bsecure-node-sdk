'use strict';

/**
 * bSecureError is the base error from which all other more specific bSecure errors derive.
 * Specifically for errors returned from bSecure's REST API.
 */
class bSecureError extends Error {
  constructor(raw = {}) {
    super(raw.message);
    this.type = this.constructor.name;

    this.raw = raw;
    this.rawType = raw.type;
    this.code = raw.code;
    this.doc_url = raw.doc_url;
    this.param = raw.param;
    this.detail = raw.detail;
    this.headers = raw.headers;
    this.requestId = raw.requestId;
    this.statusCode = raw.statusCode;
    this.message = raw.message;

    this.charge = raw.charge;
    this.decline_code = raw.decline_code;
    this.payment_intent = raw.payment_intent;
    this.payment_method = raw.payment_method;
    this.payment_method_type = raw.payment_method_type;
    this.setup_intent = raw.setup_intent;
    this.source = raw.source;
  }

  /**
   * Helper factory which takes raw stripe errors and outputs wrapping instances
   */
  static generate(rawbSecureError) {
    switch (rawbSecureError.type) {
      case 'card_error':
        return new bSecureCardError(rawbSecureError);
      case 'invalid_request_error':
        return new bSecureInvalidRequestError(rawbSecureError);
      case 'api_error':
        return new bSecureAPIError(rawbSecureError);
      case 'authentication_error':
        return new bSecureAuthenticationError(rawbSecureError);
      case 'rate_limit_error':
        return new bSecureRateLimitError(rawbSecureError);
      case 'idempotency_error':
        return new bSecureIdempotencyError(rawbSecureError);
      case 'invalid_grant':
        return new bSecureInvalidGrantError(rawbSecureError);
      default:
        return new GenericError('Generic', 'Unknown Error');
    }
  }
}

// Specific bSecure Error types:

/**
 * CardError is raised when a user enters a card that can't be charged for
 * some reason.
 */
class bSecureCardError extends bSecureError {}

/**
 * InvalidRequestError is raised when a request is initiated with invalid
 * parameters.
 */
class bSecureInvalidRequestError extends bSecureError {}

/**
 * APIError is a generic error that may be raised in cases where none of the
 * other named errors cover the problem. It could also be raised in the case
 * that a new error has been introduced in the API, but this version of the
 * Node.JS SDK doesn't know how to handle it.
 */
class bSecureAPIError extends bSecureError {}

/**
 * AuthenticationError is raised when invalid credentials are used to connect
 * to bSecure's servers.
 */
class bSecureAuthenticationError extends bSecureError {}

/**
 * PermissionError is raised in cases where access was attempted on a resource
 * that wasn't allowed.
 */
class bSecurePermissionError extends bSecureError {}

/**
 * RateLimitError is raised in cases where an account is putting too much load
 * on bSecure's API servers (usually by performing too many requests). Please
 * back off on request rate.
 */
class bSecureRateLimitError extends bSecureError {}

/**
 * bSecureConnectionError is raised in the event that the SDK can't connect to
 * bSecure's servers. That can be for a variety of different reasons from a
 * downed network to a bad TLS certificate.
 */
class bSecureConnectionError extends bSecureError {}

/**
 * SignatureVerificationError is raised when the signature verification for a
 * webhook fails
 */
class bSecureSignatureVerificationError extends bSecureError {}

/**
 * IdempotencyError is raised in cases where an idempotency key was used
 * improperly.
 */
class bSecureIdempotencyError extends bSecureError {}

/**
 * InvalidGrantError is raised when a specified code doesn't exist, is
 * expired, has been used, or doesn't belong to you; a refresh token doesn't
 * exist, or doesn't belong to you; or if an API key's mode (live or test)
 * doesn't match the mode of a code or refresh token.
 */
class bSecureInvalidGrantError extends bSecureError {}

module.exports.generate = bSecureError.generate;
module.exports.bSecureError = bSecureError;
module.exports.bSecureCardError = bSecureCardError;
module.exports.bSecureInvalidRequestError = bSecureInvalidRequestError;
module.exports.bSecureAPIError = bSecureAPIError;
module.exports.bSecureAuthenticationError = bSecureAuthenticationError;
module.exports.bSecurePermissionError = bSecurePermissionError;
module.exports.bSecureRateLimitError = bSecureRateLimitError;
module.exports.bSecureConnectionError = bSecureConnectionError;
module.exports.bSecureSignatureVerificationError = bSecureSignatureVerificationError;
module.exports.bSecureIdempotencyError = bSecureIdempotencyError;
module.exports.bSecureInvalidGrantError = bSecureInvalidGrantError;
