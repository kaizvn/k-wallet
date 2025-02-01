import { GraphQLClient } from 'graphql-request';

const API_SERVER = 'https://dev-api.revpayment.io/graphql';

let graphQLClient;

export const graphQLClientCreator = ({ endpoint, token } = {}) => {
  endpoint = endpoint || API_SERVER;
  const headers = token
    ? {
        authorization: token
      }
    : {};

  graphQLClient = new GraphQLClient(endpoint, {
    headers
  });

  return graphQLClient;
};

graphQLClientCreator();

export const makeGqlRequest = ({ query, variables }) =>
  graphQLClient.request(query, variables);
