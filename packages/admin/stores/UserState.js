import { ACCOUNT_ROLES } from '@revtech/rev-shared/enums';
import { GET_CURRENT_USER_API } from '@revtech/rev-shared/apis/names';
import {
  GetCurrentUserCreator,
  EditUserInfoCreator
} from '@revtech/rev-shared/apis/creators';
import { ACTIONS, makeFetchAction } from 'redux-api-call';
import { nfetch, removeToken, saveToken } from '@revtech/rev-shared/libs';
import Router from 'next/router';
import brn from 'brn';
import { flow, get, has, isEqual, map, path } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';
import { gql } from '@revtech/rev-shared/dist/libs/graphql';

const USER_LOGOUT = 'USER_LOGOUT';
export const REFRESH_TOKEN_API = 'RefreshTokenAPI';
const UPDATE_PASSWORD_USER_API = 'UpdatePasswordUserAPI';

export const createErrorSelector = action =>
  flow(
    brn(action.errorSelector, action.errorSelector, action.dataSelector),
    path('errors'),
    map(error => error.message)
  );

const RefreshTokenAPI = makeFetchAction(
  REFRESH_TOKEN_API,
  nfetch({
    endpoint: '/refresh_token'
  })
);

export const refreshToken = () =>
  respondToSuccess(RefreshTokenAPI.actionCreator(), resp => {
    if (resp.error) {
      return;
    }

    if (resp.success) {
      saveToken(resp.token);
    }
  });

const EDIT_USER_FIELDS = `
  firstName
  lastName
  email
`;

const EditUserInfoAPI = EditUserInfoCreator(`
... on SystemUser{
  id
  ${EDIT_USER_FIELDS}
}`);

export const editUserInfo = data =>
  respondToSuccess(EditUserInfoAPI.actionCreator(data), resp => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
      return;
    }
    Router.push('/profile');
    return;
  });
export const getCurrentUser = () =>
  respondToSuccess(GetCurrentUserAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

const CURRENT_USER_FIELDS = `
    id
    username
    email
    fullName
    createdAt
    updatedAt
`;

const GetCurrentUserAPI = GetCurrentUserCreator(`
... on SystemUser {
  ${CURRENT_USER_FIELDS}
  firstName
  lastName
  systemUserRole: role
}
`);

const UpdatePasswordUserAPI = makeFetchAction(
  UPDATE_PASSWORD_USER_API,
  gql`
    mutation($id: ID!, $newPassword: String!) {
      update_password_user(id: $id, newPassword: $newPassword) {
        id
        username
      }
    }
  `
);

export const verifyScopeAndRole = user => {
  if (!user) {
    return false;
  }

  return user.systemUserRole;
};

export const getUser = () =>
  respondToSuccess(GetCurrentUserAPI.actionCreator({}), resp => {
    if (resp.errors) {
      return Router.replace({
        pathname: '/login'
      });
    }

    if (!verifyScopeAndRole(resp.data.me)) {
      return Router.replace({
        pathname: '/login'
      });
    }
  });

export const updatePasswordUser = (id, newPassword) => {
  return respondToSuccess(
    UpdatePasswordUserAPI.actionCreator({
      id,
      newPassword
    }),
    resp => {
      if (resp.error) {
        console.error(resp.error);
        return;
      }
      return;
    }
  );
};

export const currentUserSelector = flow(
  GetCurrentUserAPI.dataSelector,
  get('data.me')
);

export const currentPartnerSelector = flow(currentUserSelector, get('partner'));

export const currentUserErrorSelector = createErrorSelector(GetCurrentUserAPI);

const isUserLoggedIn = has('json.data.me');

export const isAdminSelector = flow(
  currentUserSelector,
  get('systemUserRole'),
  isEqual(ACCOUNT_ROLES.ROLE_ADMIN)
);

export const doLogout = () => ({
  type: USER_LOGOUT
});

export const resetGetCurrentUser = dispatch =>
  dispatch(GetCurrentUserAPI.resetter(['data', 'error']));

export default {
  connectStatus(state = false, { type, payload }) {
    if (type === ACTIONS.COMPLETE && payload.name === GET_CURRENT_USER_API) {
      return isUserLoggedIn(payload);
    }

    if (type === ACTIONS.FAILURE && payload.name === GET_CURRENT_USER_API) {
      removeToken();
      Router.push('/login');

      return false;
    }

    if (type === USER_LOGOUT) {
      removeToken();
      Router.push('/login');
      return false;
    }

    return state;
  }
};
