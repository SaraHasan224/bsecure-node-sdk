'use strict';

var qs = require('qs');
var Api = require('../helpers/apis');
var CONSTANT = require('../helpers/constant');

function isDefined(value) {
  return typeof value !== 'undefined';
}

function validateWebhookSignature(environment, client_id, client_secret) {
  /*
   * Verifies webhook signature
   *
   * @param {String} environment
   * @param {String} client_id
   * @param {String} client_secret
   *
   * @return {Boolean}
   */

  if (!isDefined(client_id) || !isDefined(client_secret)) {
    throw Error(
      'Invalid Parameters: Please give request body,' + 'environment, client_secret and ' + 'client_id as parameters',
    );
  }

  /*
   * Initializes an Order
   *
   * @param {Object} params
   * - apiKey: Your Public Key for the environment
   * - amount: Amount in float e.g 1000.43
   * - currency: Currency Code either USD or PKR
   * - environment: either sandbox or "production"
   * @param {Function} callback
   *
   * @return {Promise}
   */
  var authCredentials = new Api({
    environment,
    client_id,
    client_secret,
  });

  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];

  var url = BASE_URL + CONSTANT.API_ENDPOINTS.create_order;
  var data = {
    client_id,
    client_secret,
  };

  return api.post(
    {
      url: url,
      data: data,
    },
    callback,
  );
  return credential;
}

function constructQueryParams(_ref) {
  var env = _ref.env,
    tracker = _ref.tracker,
    _ref$orderId = _ref.orderId,
    orderId = _ref$orderId === undefined ? '' : _ref$orderId,
    _ref$source = _ref.source,
    source = _ref$source === undefined ? '' : _ref$source,
    redirectUrl = _ref.redirectUrl,
    cancelUrl = _ref.cancelUrl;

  if (!isDefined(tracker) || !isDefined(redirectUrl) || !isDefined(cancelUrl)) {
    throw Error('Invalid Parameters: Please provide all of,' + 'environment, tracker, redirectUrl and cancelUrl');
  }

  return qs.stringify({
    env: env,
    beacon: tracker,
    order_id: orderId,
    source: source,
    redirect_url: redirectUrl,
    cancel_url: cancelUrl,
  });
}

function isEmpty(x) {
  return (
    typeof x === 'undefined' ||
    x === null ||
    x === 'null' ||
    x === 'undefined' ||
    x === false ||
    x.length === 0 ||
    x === ''
  );
}

module.exports = {
  validateWebhookSignature: validateWebhookSignature,
  constructQueryParams: constructQueryParams,
  isEmpty: isEmpty,
};
