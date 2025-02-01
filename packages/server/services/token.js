import { concat, flow, join } from 'lodash/fp';

import client from '../redis';

const TIME_VALID = process.env.RESET_PASSWORD_TOKEN_TIMEOUT || 3600;

export const TOKEN_TYPES = {
  NORMAL_USER: 1,
  PARTNER_USER: 2,
  SYS_USER: 3
};

const createTokenRedisKey = flow(
  concat('token'),
  join(':')
);

export const createTokenData = async ({ token, type, email }) => {
  const rKey = createTokenRedisKey([type, token]);

  return client.setAsync(rKey, email, 'NX', 'EX', TIME_VALID);
};

export const getTokenData = async ({ type, token }) =>
  client.getAsync(createTokenRedisKey([type, token]));

export const deleteToken = async ({ type, token }) =>
  client.delAsync(createTokenRedisKey([type, token]));
