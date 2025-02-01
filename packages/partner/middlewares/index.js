import { createAPIMiddleware, composeAdapters } from 'redux-api-call';

import fetchInterceptor from 'redux-api-call-adapter-fetch';
import jsonInterceptor from 'redux-api-call-adapter-json';

import { intercepter as graphql } from '@revtech/rev-shared/libs';

export default createAPIMiddleware(
  composeAdapters(graphql, jsonInterceptor, fetchInterceptor)
);
