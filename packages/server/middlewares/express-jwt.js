import expressJWT from 'express-jwt';

import jwtBlacklist from './jwt-blacklist';

const graphqlPath = process.env.GRAPHQL_PATH || '/graphql';

const allowPaths = [
  '/signin',
  '/signup',
  '/partner-signin',
  '/refresh_token',
  '/admin_token',
  '/favicon.ico',
  '/diro_callback',
  '/login-fail',
  /^\/revhooks/,
  /^\/client\/auth/,
  /^\/admin\/auth/,
  /^\/partner\/auth/,
  /^\/callback/,
  graphqlPath
];

module.exports = () =>
  expressJWT({
    secret: process.env.JWT_SECRET,
    isRevoked: jwtBlacklist.isRevoked
  }).unless({
    path: allowPaths
  });
