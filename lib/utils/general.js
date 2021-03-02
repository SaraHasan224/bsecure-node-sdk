'use strict';

function isEmpty(x) {
  return (
    typeof x === 'undefined' ||
    x === null ||
    x === 'null' ||
    x === 'undefined' ||
    x === false ||
    x.length === 0 ||
    x === ''
  );
}

module.exports = {
  isEmpty: isEmpty,
};
