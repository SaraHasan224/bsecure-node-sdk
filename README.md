# bSecure Checkout

Pakistan's first universal checkout solution that is easy and simple to integrate on your e-commerce store.

### About bSecure Checkout

It gives you an option to enable _universal-login_, _two-click checkout_ and accept multiple payment method for your customers, as well as run your e-commerce store hassle free.\
It is built for _desktop_, _tablet_, and _mobile devices_ and is continuously tested and updated to offer a frictionless payment experience for your e-commerce store.

### Installation

You can install the package via **npm**

`npm install bsecure-checkout --save`

#### Getting Your Credentials

1. Go to [Builder Portal](https://builder.bsecure.pk/)
2. [App Integration](https://builder.bsecure.pk/integration-sandbox) >> Sandbox / Live
3. Select Environment Type (Custom Integration)
4. Fill following fields:\
   a. _Store URL_ its required in any case\
   b. _Login Redirect URL_ Required for feature **Login with bSecure**\
   c. _Checkout Redirect URL_ Required for feature **Pay with bSecure**\
   d. _Checkout Order Status webhook_ Required for feature **Pay with bSecure**
5. Save your client credentials (Client ID and Client Secret)
6. Please make sure to keep credentials at safe place in your code

### Configuration

The package can be initialized with below mentioned options:

```
let bsecure = new bSecure({
  client_id: "YOUR-CLIENT-ID",
  client_secret: "YOUR-CLIENT-SECRET",
  environment: "YOUR-APP-ENVIRONMENT",
});
```

## Usage

The package needs to be configured with your account's credentials, which is available in the bSecure [Builder Portal](https://builder.bsecure.pk/):

```
const bSecure = require("bsecure-checkout");
let bsecure = new bSecure(config);
    bsecure.createToken()
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

Or using ES modules and async/await:

```
import bSecure from 'bsecure-checkout';
let bsecure = new bSecure(config);

(async () => {
  const token = await bsecure.createToken(config);
  console.log(token);
})();
```

## bSecure Checkout

#### Create Order

To create an order you should have an order_id, customer and products object parameters that are to be set before creating an order.

##### Create Order Request Params:

###### Product Object:

Products object should be in below mentioned format:

```
'products' =>
      array (
        0 =>
            array (
              'id' => 'product-id',
              'name' => 'product-name',
              'sku' => 'product-sku',
              'quantity' => 0,
              'price' => 0,
              'sale_price' => 0,
              'image' => 'product-image',
              'description' => 'product-description',
              'short_description' => 'product-short-description',
            ),
      ),
```

###### Shipment Object

Shipment object should be in below mentioned format:

> 1- If the merchant want his pre-specified shipment method then he should pass shipment method detail in below mentioned format:

```
'shipment' =>
      array (
        'charges' => 'numeric',
        'method_name' => 'string'
      ),
```

###### Customer Object

Customer object should be in below mentioned format:

> 1- If the customer has already signed-in via bSecure into your system and you have auth-code for the customer you can
> just pass that code in the customer object no need for the rest of the fields.

> 2- Since all the fields in Customer object are optional, if you don’t have any information about customer just pass the
> empty object, or if you have customer details then your customer object should be in below mentioned format:

```
'customer' =>
      array (
        'name' => 'string',
        'email' => 'string',
        'country_code' => 'string',
        'phone_number' => 'string',
      ),
```

#### Create Order

```
use bSecure\UniversalCheckout\BsecureCheckout;
```

```
try {
    let order = bsecure.Order;
    order.setOrderId('<YOUR-ORDER-ID>');
    order.setCharges('<YOUR-ORDER-ID>');
    order.setCustomer('<YOUR-ORDER-ID>');
    order.setCartItems('<YOUR-ORDER-ID>');
    order.setShipmentDetails('<YOUR-ORDER-ID>');
    var initializePromise = order.createOrder();
    return initializePromise.then(
      function (result) {
        return result;
      },
      function (err) {
        return err;
      }
    );
} catch (err) {
    return err;
}
```

In response createOrder(), will return order expiry, checkout_url, order_reference and merchant_order_id.

```
array (
  'expiry' => '2020-11-27 10:55:14',
  'checkout_url' => 'bSecure-checkout-url',
  'order_reference' => 'bsecure-reference',
  'merchant_order_id' => 'your-order-id',
)
```

> You have recieved bsecure order link now simply redirect the user to checkout_url

```
if(!empty($result['checkout_url']))
return redirect($result['checkout_url']);
```

When order is created successfully on bSecure, you will be redirected bSecure checkout app where you will process your checkout.

#### Callback on Order Placement

Once the order is successfully placed, bSecure will redirect the customer to the url you mentioned in “Checkout
redirect url” in your [environment settings](https://builder.bsecure.pk/) in Builders Portal, with one additional param “order_ref” in the query
string.

#### Order Updates

By using order_ref you received in the "**[Callback on Order Placement](#callback-on-order-placement)**" you can call below method to get order details.

```
try {
    let status = bsecure.OrderStatus;
    status.setOrderRef("<ORDER-REFERENCE>");
    var initializePromise = status.getStatus();
    return initializePromise.then(
      function (result) {
        return result;
      },
      function (err) {
        return err;
      }
    );
} catch (err) {
    return err;
}
```

#### Order Status Change Webhook

Whenever there is any change in order status or payment status, bSecure will send you an update with complete
order details (contents will be the same as response of _[Order Updates] on the URL you mentioned in \_Checkout Order Status webhook_ in your environment settings in Builders Portal. (your webhook must be able to accept POST request).

## bSecure Single Sign On (SSO)

### Routing

Next, you are ready to authenticate users! You will need two routes: one for redirecting the user to the OAuth provider, and another for receiving the customer profile from the provider after authentication.

### Authenticate Client

> If you are using a web-solution then use below method

```
try {
    let status = bsecure.SingleSignOn;
    return status.authenticateClient('<STATE>');
} catch (err) {
    return err;
}

```

In response, authenticateWebClient will return auth_url, then simply redirect the user to auth_url

```
array (
  "auth_url": "your-authentication-url"

)
```

### Client Authorization

On Successful Authorization,\
bSecure will redirect to Login redirect url you provided when setting up environment in Builder's portal, along
with two parameters in query string: **code** and **state**

```
eg: https://my-store.com/sso-callback?code=abc&state=xyz
```

code recieved in above callback is cutsomer's auth_code which will be further used to get customer profile.

#### Verify Callback

Verify the state you received in the callback by matching it to the value you stored in DB before sending the client authentication
request, you should only proceed if and only if both values match.

### Get Customer Profile

Auth_code recieved from **Client Authorization** should be passed to method below to get customer profile.

```
try {
    let status = bsecure.SingleSignOn;
    var initializePromise = status.getCustomerProfile('<AUTH-CODE>');
    return initializePromise.then(
      function (result) {
        return result;
      },
      function (err) {
        return err;
      }
    );
} catch (err) {
    return err;
}

```

In response, it will return customer name, email, phone_number, country_code, address book.

```
array (
    'name' => 'customer-name',
    'email' => 'customer-email',
    'phone_number' => 'customer-phone-number',
    'country_code' => customer-phone-code,
    'address' =>
        array (
          'country' => '',
          'state' => '',
          'city' => '',
          'area' => '',
          'address' => '',
          'postal_code' => '',
        ),
)
```

### Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

## Contributions

**"bSecure – Your Universal Checkout"** is open source software.
