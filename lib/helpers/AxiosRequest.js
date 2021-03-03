const axios = require('axios');
const _require = require('../utils/general'),
  isEmpty = _require.isEmpty;

const mainInstance = axios.create({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
});

const makeRequest = (instance) => (method, url, token, api, ...params) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + api?.access_token;
    mainInstance.defaults.headers.common['Authorization'] = 'Bearer ' + api?.access_token;
  }
  if (!token) {
    delete axios.defaults.headers.common['Authorization'];
  }

  instance.interceptors.response.use(
    (response) => {
      return Promise.resolve(response);
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return instance[method](url, ...params);
};

const AXIOS_REQUEST = (method, url, token, api) => (...params) => {
  return makeRequest(mainInstance)(method, url, token, api, ...params);
};

module.exports = AXIOS_REQUEST;
