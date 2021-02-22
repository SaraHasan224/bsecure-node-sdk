'use strict';
const CONSTANT = require('./constant');
const BASE_URL = CONSTANT.BASE_URL;

var axios = require('axios');
var nodeify = require('../utils/nodeify');

function normalizeError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw {
      statusCode: error.response.status,
      error: error.response.data.status.errors.join(' '),
    };
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    throw {
      statusCode: 500,
      error: error.request,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    throw {
      statusCode: 500,
      error: error.message,
    };
  }
}

class Api {
  constructor(options) {
    this.rq = axios.create({
      baseURL: BASE_URL,
    });
    this.token = null;
    this.validToken = null;
    this.tokenError = null;

    (this.environment = options.environment),
      (this.client_id = options.client_id),
      (this.client_secret = options.client_secret);
  }

  get(params, cb) {
    return nodeify(
      this.rq({
        method: 'get',
        url: params.url,
        params: params.data,
      }).catch(normalizeError),
      cb,
    );
  }

  post(params, cb) {
    return new Promise(function (resolve, reject) {
      axios
        .post(params.url, params.data)
        .then((res) => {
          resolve(res);
        })
        .catch(function (error) {
          if (error.response) {
            console.log('1');
            // Request made and server responded
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            // reject(error.response.data);
            reject(error.response.data);
          } else if (error.request) {
            console.log('2');
            // The request was made but no response was received
            // console.log(error.request);
            reject(error.request);
          } else {
            console.log('3');
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
            reject(error.message);
          }
        });
    });
    // return nodeify(
    //   this.rq({
    //     method: 'post',
    //     url: params.url,
    //     data: params.data,
    //   }).catch(normalizeError),
    //   cb,
    // );
  }

  put(params, cb) {
    return nodeify(
      this.rq({
        method: 'put',
        url: params.url,
        data: params.data,
      }).catch(normalizeError),
      cb,
    );
  }

  patch(params, cb) {
    return nodeify(
      this.rq({
        method: 'patch',
        url: params.url,
        data: params.data,
      }).catch(normalizeError),
      cb,
    );
  }

  _delete(params, cb) {
    return nodeify(
      this.rq({
        method: 'delete',
        url: params.url,
        data: params.data,
      }).catch(normalizeError),
      cb,
    );
  }

  async generateAuthToken() {
    try {
      var url = CONSTANT.AUTH_SERVER_URL + CONSTANT.API_ENDPOINTS.oauth;
      var data = {
        grant_type: 'client_credentials',
        client_id: this.client_id,
        client_secret: this.client_secret,
      };
      const result = await this.post({
        url: url,
        data: data,
      });
      if (result.status === 200) {
        this.validToken = true;
      } else {
        this.validToken = false;
        this.tokenError = result;
      }
      return {
        token: this.token,
        validToken: this.validToken,
        tokenError: this.tokenError,
      };
    } catch (error) {
      // console.error('error.response in catch', error);
      this.validToken = false;
      this.tokenError = error;
      return {
        token: this.token,
        validToken: this.validToken,
        tokenError: this.tokenError,
      };
    }
  }

  addResources() {
    Object.assign(this, {
      Orders: require('./resources/Checkout/order_create')(this.api),
    });
  }
}

module.exports = Api;
