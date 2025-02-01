// ref: https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#ciphers
import crypto from 'crypto';
const resizedIV = Buffer.allocUnsafe(16);
const resizedKey = Buffer.allocUnsafe(32);

const HASH_ROUND = process.env.HASH_ROUND || 2;
const ALGORITHM = 'aes256';
const HASH_SALT = process.env.HASH_SALT || 'RevPaymentSaltX';
const HASH_IV = process.env.HASH_INITIALIZATION_VECTOR || 'revpayment';

crypto.createHash('sha256').update(HASH_SALT).digest().copy(resizedKey);

crypto.createHash('sha256').update(HASH_IV).digest().copy(resizedIV);

function encode(text) {
  // eslint-disable-next-line no-use-before-define
  let cipher = crypto.createCipheriv(ALGORITHM, resizedKey, resizedIV);
  let cip = cipher.update(text, 'utf8', 'hex');
  cip += cipher.final('hex');
  return cip;
}

function decode(text) {
  let decipher = crypto.createDecipheriv(ALGORITHM, resizedKey, resizedIV);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

export default {
  encode: (text, round = HASH_ROUND) => {
    let result = text;
    for (let i = 0; i < round; i++) {
      result = encode(result);
    }
    return result;
  },
  decode: (text, round = HASH_ROUND) => {
    let result = text;
    for (let i = 0; i < round; i++) {
      result = decode(result);
    }
    return result;
  }
};
