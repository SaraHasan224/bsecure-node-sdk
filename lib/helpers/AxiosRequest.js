var axios = require('axios');

var mainInstance = axios.create({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
});

const makeRequest = (instance) => (method, url, token, ...params) => {
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

const AXIOS_REQUEST = (method, url, token) => (...params) => {
  return makeRequest(mainInstance)(method, url, token, ...params);
};

module.exports = AXIOS_REQUEST;
