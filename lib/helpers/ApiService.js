const CONSTANT = require('./constant');

var AXIOS_REQUEST = require('./AxiosRequest');

const BASE_URL = CONSTANT.AUTH_SERVER_URL;
const API_ENDPOINTS = CONSTANT.API_ENDPOINTS;

module.exports = {
  verifyClientAcessToken,
};

async function verifyClientAcessToken(requestData) {
  try {
    let apiCall = await AXIOS_REQUEST('post', `${BASE_URL}` + API_ENDPOINTS.oauth, false)(requestData);
    const responseStatus = apiCall?.data?.status;
    if (!helper.isEmpty(responseStatus) && responseStatus === CONSTANT.HTTP_RESPONSE_STATUSES.success) {
      this.validToken = true;
    } else {
      this.validToken = false;
      this.tokenError = response;
    }
    return {
      token: this.token,
      validToken: this.validToken,
      tokenError: this.tokenError,
    };
  } catch (error) {
    const error_response = error?.response;
    this.token = null;
    this.validToken = false;
    this.tokenError = error_response;
    const resp = {
      token: null,
      validToken: false,
      tokenError: error_response?.data,
    };
    return resp;
  }

  return response;
}
