const AUTH_SERVER_URL = 'https://api-dev.bsecure.app/';
const LOGIN_REDIRECT_URL = 'https://login-dev.bsecure.app/auth/sso';

const API_VERSION = 'v1';

const API_ENDPOINTS = {
  OAUTH: API_VERSION + '/oauth/token',
  CREATE_ORDER: API_VERSION + '/order/create',
  ORDER_STATUS: API_VERSION + '/order/status',
  VERIFY_CLIENT: API_VERSION + '/sso/verify-client',
  CUSTOMER_PROFILE: API_VERSION + '/sso/customer/profile',
};

const ORDER_STATUS = {
  CREATED: 1,
  INITIATED: 2,
  PLACED: 3,
  AWAITING_CONFIRMATION: 4,
  CANCELED: 5,
  EXPIRED: 6,
  FAILED: 7,
};

const HTTP_RESPONSE_STATUSES = {
  SUCCESS: 200,
  FAILED: 400,
  VALIDATION_ERROR: 422,
  AUTHENTICATION_ERROR: 401,
  AUTHORIZATION_ERROR: 403,
  SERVER_ERROR: 500,
};

const ENVIRONMENT = {
  SANDBOX: 'sandbox',
  LIVE: 'live',
};

const CLIENT_SECRET = 'client_secret';
const CLIENT_ID = 'client_id';

const DOCUMENTATION_LINK = '<doc-link>';
const SUPPORT_EMAIL = '<support-link>';
const BUILDERS_DASHBOARD_LINK = '<builder-dashboard-linlk>';

module.exports = {
  DOCUMENTATION_LINK: DOCUMENTATION_LINK,
  SUPPORT_EMAIL: SUPPORT_EMAIL,
  CLIENT_SECRET: CLIENT_SECRET,
  CLIENT_ID: CLIENT_ID,
  ENVIRONMENT: ENVIRONMENT,
  HTTP_RESPONSE_STATUSES: HTTP_RESPONSE_STATUSES,
  ORDER_STATUS: ORDER_STATUS,
  API_ENDPOINTS: API_ENDPOINTS,
  AUTH_SERVER_URL: AUTH_SERVER_URL,
  LOGIN_REDIRECT_URL: LOGIN_REDIRECT_URL,
  BUILDERS_DASHBOARD_LINK: BUILDERS_DASHBOARD_LINK,
};
