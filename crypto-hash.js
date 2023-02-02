
const crypt = require('crypto');

// SHA-256해시 결과를 생성한다.
const cryptoHash = (...input) => {

  const hash  = crypt.createHash('sha256');

  hash.update(input.sort().join(' '));

  return hash.digest('hex');

};

module.exports = cryptoHash