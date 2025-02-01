import { makeFetchAction } from 'redux-api-call';

import { respondToFailure } from '../middlewares/api-reaction';
import { gql } from '@revtech/rev-shared/libs';
import { get, flow } from 'lodash/fp';

const GET_SERVER_INFO = 'GET_SERVER_INFO';

export const GetServerInfoAPI = makeFetchAction(
  GET_SERVER_INFO,
  gql`
    query {
      get_server_info {
        maintenanceMessage
        serverStatus
      }
    }
  `
);

export const getServerInfo = () => {
  return respondToFailure(GetServerInfoAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error('Err: ', resp.errors);
      return;
    }

    return;
  });
};

export const getServerInfoSelector = flow(
  GetServerInfoAPI.dataSelector,
  get('data.get_server_info')
);
