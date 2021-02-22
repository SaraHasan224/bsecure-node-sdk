const AUTH_SERVER_URL = 'https://api-dev.bsecure.app/';
const LOGIN_REDIRECT_URL = 'https://login-dev.bsecure.app/auth/sso';

const API_VERSION = 'v1';

const API_ENDPOINTS = {
  oauth: API_VERSION + '/oauth/token',
  create_order: API_VERSION + '/order/create',
  order_status: API_VERSION + '/order/status',
  verify_client: API_VERSION + '/sso/verify-client',
  customer_profile: API_VERSION + '/sso/customer/profile',
};

const OrderStatus = {
  created: 1,
  initiated: 2,
  placed: 3,
  'awaiting-confirmation': 4,
  canceled: 5,
  expired: 6,
  failed: 7,
};
const HTTP_RESPONSE_STATUSES = {
  success: 200,
  failed: 400,
  validationError: 422,
  authenticationError: 401,
  authorizationError: 403,
  serverError: 500,
};

const CLIENT_SECRET = 'client_secret';
const CLIENT_ID = 'client_id';
const ENVIRONMENT = {
  SANDBOX: 'sandbox',
  PRODUCTION: 'production',
};

const DOCUMENTATION_LINK = '<doc-link>';
const SUPPORT_EMAIL = '<support-link>';

module.exports = {
  DOCUMENTATION_LINK: DOCUMENTATION_LINK,
  SUPPORT_EMAIL: SUPPORT_EMAIL,
  CLIENT_SECRET: CLIENT_SECRET,
  CLIENT_ID: CLIENT_ID,
  ENVIRONMENT: ENVIRONMENT,
  HTTP_RESPONSE_STATUSES: HTTP_RESPONSE_STATUSES,
  OrderStatus: OrderStatus,
  API_ENDPOINTS: API_ENDPOINTS,
  AUTH_SERVER_URL: AUTH_SERVER_URL,
  LOGIN_REDIRECT_URL: LOGIN_REDIRECT_URL,
};
