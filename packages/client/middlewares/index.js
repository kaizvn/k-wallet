import { createAPIMiddleware, composeAdapters } from 'redux-api-call';
import { intercepter as graphql } from '@revtech/rev-shared/libs';

import fetchInterceptor from 'redux-api-call-adapter-fetch';
import jsonInterceptor from 'redux-api-call-adapter-json';

export default createAPIMiddleware(
  composeAdapters(graphql, jsonInterceptor, fetchInterceptor)
);
