const RequestHeaders = {
  locale: 'x-locale',
  currency: 'x-currency',
  deviceType: 'x-device-type',
  osVersion: 'x-os-version',
  appVersion: 'x-app-version',
  accessToken: 'x-access-token',
};

const CurlContentTypes = {
  JSON: 'Application/json',
  MultiPartFormData: 'Multipart/form-data',
};

//in case of successful create, read, update, delete & any successful operation
const SUCCESS = 'success';

//in case of operational or process failure
const BAD_REQUEST = 'bad_request';

//in case of authentication failure, trying to access any protected route with expired or no API token
const UNAUTHORISED = 'unauthorised';

//in case of validation failure
const INPROCESSABLE = 'inprocessable';

//in case of validation failure
const VALIDATION_ERROR = 'validationError';

const Codes = {
  success: 200,
  bad_request: 400,
  unauthorised: 401,
  validationError: 422,
  inprocessable: 422,
};

function getApiPossibleCodes() {
  return array_values(Codes);
}

module.exports = {
  RequestHeaders: RequestHeaders,
  CurlContentTypes: CurlContentTypes,
  SUCCESS: SUCCESS,
  BAD_REQUEST: BAD_REQUEST,
  UNAUTHORISED: UNAUTHORISED,
  INPROCESSABLE: INPROCESSABLE,
  VALIDATION_ERROR: VALIDATION_ERROR,
  Codes: Codes,
  getApiPossibleCodes: getApiPossibleCodes,
};
