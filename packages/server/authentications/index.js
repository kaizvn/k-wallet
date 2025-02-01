/**
 * Example to refresh tokens using https://github.com/auth0/node-jsonwebtoken
 * It was requested to be introduced at as part of the jsonwebtoken library,
 * since we feel it does not add too much value but it will add code to maintain
 * we won't include it.
 *
 * I create this gist just to help those who want to auto-refresh JWTs.
 */

import { pick } from 'lodash/fp';
import jwt from 'jsonwebtoken';
import jwtBlacklist from 'express-jwt-blacklist';

function TokenGenerator(secretOrPrivateKey, secretOrPublicKey, options) {
  this.secretOrPrivateKey = process.env.JWT_SECRET;
  this.secretOrPublicKey = process.env.JWT_PUBLIC || process.env.JWT_SECRET;
  this.options = options || {
    expiresIn: 604800 // 1 week
  };
  this.verifyOptions = {};
}

TokenGenerator.prototype.sign = function (payload, signOptions = {}) {
  const info = pick([
    'id',
    'username',
    'first_name',
    'last_name',
    'email',
    'role',
    'country',
    'partner_id'
  ])(payload);
  const options = { ...this.options, ...signOptions };
  // if payload is found and password is right create a token
  return jwt.sign(info, this.secretOrPrivateKey, options);
};

TokenGenerator.prototype.verify = async function (token, verifyOptions = {}) {
  try {
    if (!token) {
      return null;
    }

    const options = ({}, this.verifyOptions, verifyOptions);

    const payload = jwt.verify(token, this.secretOrPrivateKey, options);

    const isBlacklist = await new Promise((resolve, reject) =>
      jwtBlacklist.isRevoked({}, payload, (error, isBlacklist) => {
        if (error) {
          reject(error);
        }
        return resolve(isBlacklist);
      })
    );

    return isBlacklist ? null : payload;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

// refreshOptions.verify = options you would use with verify function
// refreshOptions.jwtid = contains the id for the new token
TokenGenerator.prototype.refresh = async function (payload) {
  if (!payload) {
    return null;
  }
  const refreshPayload = Object.assign({}, payload);

  delete refreshPayload.iat;
  delete refreshPayload.exp;
  delete refreshPayload.nbf;
  delete refreshPayload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
  const jwtSignOptions = { ...this.options };
  // The first signing converted all needed options into claims, they are already in the refreshPayload

  return jwt.sign(refreshPayload, this.secretOrPrivateKey, jwtSignOptions);
};

module.exports = new TokenGenerator();
