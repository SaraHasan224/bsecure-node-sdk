const CONSTANT = require('./constant');
const ERROR_MESSAGES = require('../utils/lang');
const ApiResponseHandler = require('../helpers/ApiResponseHanlder');
const _require = require('../utils/general'),
  isEmpty = _require.isEmpty;

const AXIOS_REQUEST = require('./AxiosRequest');

const BASE_URL = CONSTANT.AUTH_SERVER_URL;
const API_ENDPOINTS = CONSTANT.API_ENDPOINTS;

module.exports = {
  verifyClientAcessToken,
  createOrder,
  orderStatus,
  customerProfile,
};

async function verifyClientAcessToken(requestData, environment) {
  try {
    let apiCall = await AXIOS_REQUEST('post', `${BASE_URL}` + API_ENDPOINTS.OAUTH, false, null)(requestData);
    const responseStatus = apiCall?.data?.status;
    const responseBody = apiCall?.data?.body;
    const responseMsg = apiCall?.data?.message;
    const checkEnvironment = responseBody.environment === environment;
    if (responseStatus === CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS && checkEnvironment) {
      return {
        body: apiCall?.data,
        isValid: true,
        msg: responseMsg,
      };
    } else {
      return {
        body: null,
        isValid: false,
        msg: ERROR_MESSAGES.INVALID_ENVIRONMENT,
      };
    }
  } catch (error) {
    const error_response = error?.response?.data;
    return {
      body: error_response,
      isValid: false,
      msg: error_response?.message,
    };
  }
}

async function createOrder(requestData, api) {
  if (isEmpty(api?.access_token)) {
    return {
      isValid: false,
      response: ApiResponseHandler.failure(ERROR_MESSAGES.NOT_FOUND_AUTH_TOKEN),
    };
  } else {
    try {
      let apiCall = await AXIOS_REQUEST('post', `${BASE_URL}` + API_ENDPOINTS.CREATE_ORDER, true, api)(requestData);
      return {
        isValid: true,
        response: apiCall.data,
      };
    } catch (error) {
      return {
        isValid: false,
        response: error.response.data,
      };
    }
  }
}

async function orderStatus(requestData, api) {
  if (isEmpty(api?.access_token)) {
    return {
      isValid: false,
      response: ApiResponseHandler.failure(ERROR_MESSAGES.NOT_FOUND_AUTH_TOKEN),
    };
  } else {
    try {
      let apiCall = await AXIOS_REQUEST('post', `${BASE_URL}` + API_ENDPOINTS.ORDER_STATUS, true, api)(requestData);
      return {
        isValid: true,
        response: apiCall.data,
      };
    } catch (error) {
      return {
        isValid: false,
        response: error.response.data,
      };
    }
  }
}

async function customerProfile(requestData, api) {
  if (isEmpty(api?.access_token)) {
    return {
      isValid: false,
      response: ApiResponseHandler.failure(ERROR_MESSAGES.NOT_FOUND_AUTH_TOKEN),
    };
  } else {
    try {
      let apiCall = await AXIOS_REQUEST('post', `${BASE_URL}` + API_ENDPOINTS.CUSTOMER_PROFILE, true, api)(requestData);
      return {
        isValid: true,
        response: apiCall.data,
      };
    } catch (error) {
      return {
        isValid: false,
        response: error.response.data,
      };
    }
  }
}
