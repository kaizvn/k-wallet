import * as ApiReactionMiddleware from './api-reaction';
import { flow, map, path } from 'lodash/fp';
import brn from 'brn';

export const createErrorSelector = action =>
  flow(
    brn(action.errorSelector, action.errorSelector, action.dataSelector),
    path('errors'),
    map(error => error.message)
  );

export const getResetter = api =>
  typeof api === 'object' && api.resetter(['data', 'error']);

export const { respondToSuccess } = ApiReactionMiddleware;

export default { createErrorSelector, getResetter, ...ApiReactionMiddleware };
