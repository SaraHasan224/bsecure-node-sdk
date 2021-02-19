// 'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var Order = require('./resources/Checkout/order_create');
var OrderStatus = require('./resources/Checkout/order_status');
var CustomerProfile = require('./resources/SSO/user-profile');
var Authenticate = require('./resources/authentication');

var TestFunction = function (name) {
  return 'Hello ' + name;
};

var Api = require('./helpers/apis');
var pkg = require('../package.json');
const ApiResponseHanlder = require('./helpers/ApiResponseHanlder');

function validate() {
  var environment = _ref2.environment,
    client_id = _ref.client_id,
    client_secret = _ref.client_secret;

  var empty = void 0;
  switch (environment) {
    case 'sandbox':
      empty = this.empty(sandbox);
      break;
    case 'production':
      empty = this.empty(production);
      break;
    default:
      throw new Error('invalid environment');
  }

  if (empty) {
    throw new Error('api keys for ' + environment + ' are missing');
  }
}

function createClient(_ref) {
  var environment = _ref.environment,
    client_id = _ref.client_id,
    client_secret = _ref.client_secret;
  return new Api({
    environment: environment,
    client_id: client_id,
    client_secret: client_secret,
  });
}

//  This is a Constructor function taking age and passport
//  as the paramaters
function bSecure(options) {
  // try {
  //   validate(options);
  // } catch (err) {
  //   ApiResponseHanlder.failure(err);
  // }
  this.api = createClient(options);
} //send funcyion as callback

bSecure.VERSION = pkg.version;
// bSecure.prototype.TestFunction = TestFunction;
bSecure.prototype.Order = function () {
  return Order.bind(this);
};

bSecure.prototype.Order = Order.createOrder(bSecure.api);
// bSecure.prototype.OrderStatus = OrderStatus;
// bSecure.prototype.Authenticate = Authenticate;
// bSecure.prototype.CustomerProfile = CustomerProfile;
module.exports = {
  Order,
  OrderStatus,
  Authenticate,
  CustomerProfile,
};
