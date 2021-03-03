'use strict';

const CONSTANT = require('../helpers/constant');
const API_SERVICE = require('../helpers/ApiService');
const ApiHandler = require('../helpers/apis');
const ERROR_MESSAGES = require('../utils/lang');
const HTTP = require('../helpers/Http');

const _require = require('../utils/general'),
  isEmpty = _require.isEmpty;

const API_RESPONSE_HANDLER = require('../helpers/ApiResponseHanlder');

let payload;

function generateAuthToken(api) {
  /*
   * Initializes Access token to Access bSecure APIs
   *
   * @param {Object} params
   * - client_id
   * - client_secret
   * - grant_type
   * @param {Function} callback
   *
   * @return {Promise}
   */
  return API_SERVICE.verifyClientAcessToken(payload, api.environment)
    .then((response) => {
      return setAuthToken(response, response?.tokenError);
    })
    .catch((error) => {
      const error_response = error?.response;
      let response = {
        token: null,
        isValid: false,
        tokenError: error_response,
      };
      return setAuthToken(response, response?.tokenError);
    });
}

function _setAuthenticationPayload(api) {
  if (isEmpty(api.client_id)) {
    return API_RESPONSE_HANDLER.failure(ERROR_MESSAGES.NOT_FOUND_CLIENT_ID);
  } else if (isEmpty(api.client_secret)) {
    return API_RESPONSE_HANDLER.failure(ERROR_MESSAGES.NOT_FOUND_CLIENT_SECRET);
  } else {
    const environment = api.environment;
    //Validate Environment
    switch (environment) {
      case CONSTANT.ENVIRONMENT.SANDBOX:
        break;
      case CONSTANT.ENVIRONMENT.LIVE:
        break;
      default:
        return API_RESPONSE_HANDLER.failure(ERROR_MESSAGES.INVALID_ENVIRONMENT);
    }

    payload = {
      grant_type: 'client_credentials',
      client_id: api.client_id,
      client_secret: api.client_secret,
    };
    return API_RESPONSE_HANDLER.success(payload);
  }
}

function setAuthToken(response) {
  let status = response?.body?.status;
  let body = response?.body?.body;
  if (!response.isValid) {
    const msg = ERROR_MESSAGES.INVALID_ENVIRONMENT;
    if (status === CONSTANT.HTTP_RESPONSE_STATUSES.VALIDATION_ERROR) {
      return API_RESPONSE_HANDLER.validationError(response?.msg, null, body);
    } else if (status === CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS) {
      return API_RESPONSE_HANDLER.success(body, response?.msg);
    } else {
      return API_RESPONSE_HANDLER.failure(msg, response?.body?.exception, response?.body?.message);
    }
  } else {
    return API_RESPONSE_HANDLER.success(body, response?.msg);
  }
}

function createClient(response) {
  return new ApiHandler(response);
}

module.exports = function AuthToken(api) {
  return {
    /**
     * Create aceess token
     *
     *  @return {bSecure\ApiResponse}
     */
    generate: async function () {
      const payloadResp = _setAuthenticationPayload(api);
      const RESP_STATUS = payloadResp?.status;
      if (RESP_STATUS === HTTP.Codes[HTTP.BAD_REQUEST]) {
        return new Promise((resolve, reject) => {
          return reject(payloadResp);
        });
      } else {
        return generateAuthToken(api)
          .then((result) => {
            if (result.status !== CONSTANT.HTTP_RESPONSE_STATUSES.SUCCESS) {
              return result;
            } else {
              const environment = api.environment,
                client_id = payload.client_id,
                client_secret = payload.client_secret,
                access_token = result?.body?.access_token,
                checkout_btn = result?.body?.checkout_btn;
              const credentials = {
                environment: environment,
                client_id: client_id,
                client_secret: client_secret,
                access_token: access_token,
                checkout_btn: checkout_btn,
              };
              const updatedClient = createClient(credentials);
              return updatedClient;
            }
          })
          .catch((error) => {
            return error;
          });
      }
    },
  };
};
