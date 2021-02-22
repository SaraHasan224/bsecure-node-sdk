'use strict';

var _require = require('../../utils/general'),
  isEmpty = _require.isEmpty;

var constant = require('../../helpers/constant');

var ApiResponseHandler = require('../../helpers/ApiResponseHanlder');
var Http = require('../../helpers/Http');

/** @var string The merchant order id to be used for Create Order requests. */
var orderId = null;
var orderIdDefinition = false;

/** @var array The customer object to be used for Create Order requests. */
var customer = [];
var customerDefinition = false;

/** @var array The products object to be used for Create Order requests. */
var products = [];
var productsDefinition = false;

/** @var string The order charges to be used for Create Order requests. */
var sub_total_amount = null;
var discount_amount = null;
var total_amount = null;

var chargesDefinition = false;

/** @var array The shipment object to be used for Create Order requests. */
var shipment = {
  charges: '',
  method: '',
};
/* @var string orderPayload this variable is used for, setting payload for create order API call to bSecure server */
var orderPayload = {
  order_id: null,
  customer: null,
  products: null,
  shipment_charges: null,
  shipment_method_name: null,
  sub_total_amount: null,
  discount_amount: null,
  total_amount: null,
};

function create(api) {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];

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

  return api.post(
    {
      url: url,
      data: data,
    },
    callback,
  );
}

function _setCustomer(customerData) {
  customer = [];
  if (!isEmpty(customerData)) {
    const auth_code = customerData.hasOwnProperty('auth_code') ? customerData['auth_code'] : '';

    if (!isEmpty(auth_code)) {
      customer = {
        auth_code: auth_code,
      };
    } else {
      customer = {
        country_code: customerData.hasOwnProperty('country_code') ? customerData['country_code'] : '',
        phone_number: customerData.hasOwnProperty('phone_number') ? customerData['phone_number'] : '',
        name: customerData.hasOwnProperty('name') ? customerData['name'] : '',
        email: customerData.hasOwnProperty('email') ? customerData['email'] : '',
      };
    }
  }

  return customer;
}

function _setShipmentDetails(shipmentData) {
  let shipmentDetail = {
    charges: '',
    method_name: '',
  };
  if (!isEmpty(shipmentData)) {
    shipmentDetail.charges = shipmentData.hasOwnProperty('charges') ? shipmentData.charges : '';
    shipmentDetail.method = shipmentData.hasOwnProperty('method') ? shipmentData.method : '';
  }
  return shipmentDetail;
}

function _setProductOptionsDataStructure(product) {
  product_options = customerData.hasOwnProperty('product_options') ? product.product_options : [];

  price = 0;
  if (product_options !== {}) {
    product_options.map(function myFunction(productOption, key) {
      productValue = productOption.hasOwnProperty('value') ? productOption['value'] : [];
      productValue.map(function myFunction(optionValue, key1) {
        optionPrice = optionValue.hasOwnProperty('price') ? optionValue['price'] : [];
        if (!isEmpty(optionPrice)) {
          price += optionPrice;
        }
      });
    });
  }

  return {
    price: price,
    options: product_options,
  };
}

function _setOrderPayload() {
  var msg;
  if (isEmpty(orderIdDefinition)) {
    msg =
      'No customer_details provided.  (HINT: set your customer_details using ' +
      '"bSecure::setOrderId(<ARRAY>). See"' +
      constant.DOCUMENTATION_LINK +
      ' for details, ' +
      'or email ' +
      constant.SUPPORT_EMAIL +
      ' if you have any questions.';
    // throw new Exception\UnexpectedValueException(msg);
    return ApiResponseHandler.failure(msg);
  } else if (isEmpty(chargesDefinition)) {
    msg =
      'No charges provided.  (HINT: set your sub_total, discount and total amount using ' +
      '"bSecureCheckout.Order.setCharges(<ARRAY>). See ' +
      constant.DOCUMENTATION_LINK +
      ' for details, ' +
      'or email ' +
      constant.SUPPORT_EMAIL +
      ' if you have any questions.';
    return ApiResponseHandler.failure(msg);
    // throw new Exception\UnexpectedValueException(msg);
  } else if (isEmpty(productsDefinition)) {
    msg =
      'No cart_items provided.  (HINT: set your cart_items using ' +
      '"bSecure::setCartItems(<ARRAY>). See"' +
      constant.DOCUMENTATION_LINK +
      ' for details, ' +
      'or email ' +
      constant.SUPPORT_EMAIL +
      ' if you have any questions.';
    return ApiResponseHandler.failure(msg);
  } else if (isEmpty(customerDefinition)) {
    msg =
      'No customer_details provided.  (HINT: set your customer_details using ' +
      '"bSecure::setCustomer(<ARRAY>). See"' +
      constant.DOCUMENTATION_LINK +
      ' for details, ' +
      'or email ' +
      constant.SUPPORT_EMAIL +
      ' if you have any questions.';
    // throw new Exception\UnexpectedValueException(msg);
    return ApiResponseHandler.failure(msg);
  } else {
    orderPayload = {
      order_id: orderId,
      customer: customer,
      products: products,
      shipment_charges: shipment?.charges,
      shipment_method_name: shipment?.method,
      sub_total_amount: sub_total_amount,
      discount_amount: discount_amount,
      total_amount: total_amount,
    };
    return ApiResponseHandler.success(orderPayload);
  }
}

function createOrder(api, orderPayload) {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];

  var url = constant.AUTH_SERVER_URL + constant.API_ENDPOINTS.create_order;
  return api.post(
    {
      url: url,
      data: orderPayload,
    },
    callback,
  );
  return 'Order response';
}
module.exports = function orderApi(api) {
  return {
    // module.exports = {
    /**
     * Sets the orderId to be used for Create Order requests.
     *
     * @param string orderId
     *
     *  @return {orderId}
     */
    setOrderId: function (value) {
      orderIdDefinition = true;
      orderId = value;
      return orderId;
    },

    /**
     * Set Customer Details Object to be used for Create Order requests
     *
     * @param {Object} customerData
     * - auth_code: If bsecure auth code exists for the customer. Auth code is recieved from bsecure SSO  (optional)
     * - country_code: Customer country code  (optional)
     * - phone_number: Customer phone number  (optional)
     * - name:  Customer name  (optional)
     * - email:  Customer email  (optional)
     *
     *  @return {customer}
     */
    setCustomer: function (customerData) {
      customerDefinition = true;
      customer = _setCustomer(customerData);
      return customer;
    },

    /**
     * Set Shipment Details for the order to be used for Create Order requests
     *
     * @param {Object} shipmentData
     * - charges: Shipment charges if you are using your own shipment method  (optional)
     * - method: Shipment method name if you are using your own shipment method  (optional)
     *
     *  @return {shipmentDetail}
     */
    setShipmentDetails: function (shipmentData) {
      var ShipmentDetails = _setShipmentDetails(shipmentData);
      shipment = {
        charges: ShipmentDetails?.charges ? parseFloat(shipmentData.charges) : null,
        method: ShipmentDetails?.method ?? null,
      };
    },

    /**
     * Sets the products object to be used for Create Order requests.
     *
     * @param array productData
     * - id: Product id. (required)
     * - name: Product name. (required)
     * - sku: Product sku. (optional)
     * - quantity: Product quantity.  (required)
     * - price: Product price.  (required)
     * - sale_price: Product sale price. (required)
     * - image: Product image. (optional)
     * - description: Product description. (optional)
     * - short_description: Product short description. (optional)
     */
    setCartItems: function (productData) {
      var orderItems = [];
      productData.map(function myFunction(product, key) {
        var orderItemObject = {};
        //Product Price
        var price = product?.price ?? 0;
        var sale_price = product?.sale_price ?? 0;
        var quantity = product?.quantity ?? 1;

        //Product options

        var discount = (price - sale_price) * quantity;
        var product_price = price * quantity;
        var product_sub_total = price * quantity;

        orderItemObject = {
          id: product?.id ?? null,
          name: product?.name ?? null,
          sku: product?.sku ?? null,
          quantity: parseInt(quantity),
          price: parseFloat(product_price),
          sale_price: parseFloat(sale_price),
          discount: parseFloat(discount),
          sub_total: parseFloat(product_sub_total),
          image: product?.image ?? null,
          short_description: product?.short_description ?? null,
          description: product?.description ?? null,
        };

        orderItems.push(orderItemObject);
      });

      products = orderItems;
      productsDefinition = true;
    },

    /**
     * Sets the sub_total_amount, discount_amount and total_amount to be used for Create Order requests.
     *
     * @param array orderCharges
     *  @param string sub_total,
     *  @param string string discount
     *  @param string string total
     */
    setCharges: function (orderCharges) {
      sub_total_amount = orderCharges?.sub_total ? parseFloat(orderCharges.sub_total) : 0;
      discount_amount = orderCharges?.discount ? parseFloat(orderCharges.discount) : 0;
      total_amount = orderCharges?.total ? parseFloat(orderCharges.total) : 0;
      chargesDefinition = true;
      return false;
    },

    /**
     * Create an order on your builder's behalf on bsecure server
     *
     * @param {Object} params
     * - order_id: Your internal system order id (required)
     * - customer: Your customer details (required)
     * - products: Order items (required)
     * - shipment_charges: Shipment charges if you are using your own shipment method  (optional)
     * - shipment_method_name: Shipment method name if you are using your own shipment method  (optional)
     * - sub_total_amount: Subtotal amount. (required)
     * - discount_amount: Discount amount. (required)
     * - total_amount: Total amount. (required)
     *
     *  @return {bSecure\ApiResponse}
     */
    createOrder: function () {
      const payloadResponse = _setOrderPayload();
      const orderStatus = payloadResponse?.status;
      // msg = 'No auth_token provided.  (HINT: set your auth_token using '
      // . '"bSecure::setAuthToken()".  See '
      // . constant.DOCUMENTATION_LINK.', for details, '
      // . 'or email '.constant.SUPPORT_EMAIL.' if you have any questions.';
      // access_token = bSecure::getAuthToken();
      // if(access_token == null)
      //     throw new Exception\AuthenticationException(msg);
      // else{
      if (orderStatus === Http.Codes[Http.BAD_REQUEST]) {
        return payloadResponse;
      } else {
        const orderResponse = createOrder(api, orderPayload);
        return orderResponse;
      }
      // }
    },
  };
};
