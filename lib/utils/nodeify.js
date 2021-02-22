'use strict';

var nodeify = function nodeify(promise) {
  // console.log('nodeify');
  // console.log(promise);
  // console.log(cb);
  // if (!cb) {
  //   return promise;
  // }
  new Promise(function (resolve, reject) {
    promise
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        const error_response = error?.response;
        let error_message;
        if (error_response === undefined) {
          error_message = 'Network connectivity issue';
        } else {
          error_message = error_response?.data;
        }
        reject(error_message);
      });
  });
  // return promise
  //   .then(function (response) {
  //     cb(null, response);
  //   })
  //   .catch(function (error) {
  //     cb(error, null);
  //   });
};

module.exports = nodeify;
