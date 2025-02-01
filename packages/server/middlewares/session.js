import { flow, nth, split } from 'lodash/fp';
import brn from 'brn';
import redisConnect from 'connect-redis';
import session from 'express-session';
import uuid from 'uuid';

import ms from 'ms';

const JWT_SESSION_KEY = 'key';

const RedisStore = redisConnect(session);
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const generateSessionKey = flow(
  split('.'),
  brn(nth(2), nth(2), nth(0))
);

export const saveSession = (session, token) => {
  if (session) {
    session[JWT_SESSION_KEY] = generateSessionKey(token);
    return true;
  }

  console.log('Session is not available');
  return false;
};

export const isVerifiedSession = (session = {}, token) => {
  if (!token) {
    return true;
  }

  const comparingToken = generateSessionKey(token);
  return comparingToken === session[JWT_SESSION_KEY];
};

export const removeSession = (session, key = JWT_SESSION_KEY) => {
  if (!session) {
    return true;
  }

  session[key] = null;

  return session[key] === null;
};

export default () =>
  session({
    name: 'qid',
    genid: function() {
      return uuid.v4();
    },
    store: new RedisStore({
      url: redisUrl,
      logErrors: true,
      retry_strategy: options => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    }),
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: ms('1d')
    }
  });
