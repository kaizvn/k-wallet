import { ACCOUNT_ROLES } from '@revtech/rev-shared/enums';
import { GET_CURRENT_USER_API } from '@revtech/rev-shared/apis/names';
import {
  GetCurrentUserCreator,
  ChangePasswordCreator,
  ResetPasswordCreator,
  ForgotPasswordCreator,
  EditUserInfoCreator,
  RegisterPartnerUserCreator,
  RegisterPartnerMemberCreator
} from '@revtech/rev-shared/apis/creators';
import { nfetch, removeToken, saveToken } from '@revtech/rev-shared/libs';
import { makeFetchAction, ACTIONS } from 'redux-api-call';
import { payToPartner } from '@revtech/rev-shared/apis/actions';
import Router from 'next/router';
import brn from 'brn';

import { flow, get, has, isEqual, map, path } from 'lodash/fp';

import { getMyWallets } from './WalletState';
import { respondToSuccess } from '../middlewares/api-reaction';

export const REFRESH_TOKEN_API = 'RefreshTokenAPI';

export const REGISTER_PARTNER_USER_API = 'RegisterPartnerUserAPI';
const USER_LOGOUT = 'USER_LOGOUT';

export const createErrorSelector = action =>
  flow(
    brn(action.errorSelector, action.errorSelector, action.dataSelector),
    path('errors'),
    map(error => error.message)
  );

const ChangePasswordAPI = ChangePasswordCreator(`change_partner_password`);

export const changePassword = (currentPassword, newPassword) => {
  return respondToSuccess(
    ChangePasswordAPI.actionCreator({
      currentPassword,
      newPassword
    }),
    resp => {
      if (resp.errors) {
        console.error('Err: ', resp.errors);
        return;
      }
      Router.push('/');
      return;
    }
  );
};

export const changePasswordErrorMessageSelector = createErrorSelector(
  ChangePasswordAPI
);

export const resetChangePasword = dispatch =>
  dispatch(ChangePasswordAPI.resetter(['data', 'error']));

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

const ForgotPasswordAPI = ForgotPasswordCreator(`partner_user_forgot_password`);

export const forgotPassword = email => {
  return respondToSuccess(
    ForgotPasswordAPI.actionCreator({
      email
    }),
    resp => {
      if (resp.errors) {
        console.error('Err: ', resp.errors);
        return;
      }
      return;
    }
  );
};

export const forgotPasswordErrorMessageSelector = createErrorSelector(
  ForgotPasswordAPI
);

export const forgotPasswordSuccessMessageSelector = flow(
  ForgotPasswordAPI.dataSelector,
  path('data.partner_user_forgot_password')
);

const ResetPasswordAPI = ResetPasswordCreator(`partner_user_reset_password`);

export const resetPassword = (token, newPassword) => {
  return respondToSuccess(
    ResetPasswordAPI.actionCreator({
      token,
      newPassword
    }),
    resp => {
      if (resp.errors) {
        console.error('Err: ', resp.errors);
        return;
      }
      return;
    }
  );
};

export const resetPasswordSuccessMessageSelector = flow(
  ResetPasswordAPI.dataSelector,
  get('data.partner_user_reset_password')
);

export const resetPasswordErrorMessageSelector = createErrorSelector(
  ResetPasswordAPI
);

const RegisterPartnerUserAPI = RegisterPartnerUserCreator();

const EDIT_USER_FIELDS = `
  firstName
  lastName
  email
`;

const EditUserInfoAPI = EditUserInfoCreator(` 
... on PartnerUser{
  id
  ${EDIT_USER_FIELDS}
  title
  birthDay
}`);

export const editUserInfo = data =>
  respondToSuccess(
    EditUserInfoAPI.actionCreator(data),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getCurrentUser());
      return;
    }
  );

export const registerPartnerUser = data =>
  respondToSuccess(RegisterPartnerUserAPI.actionCreator(data), resp => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
      return;
    }
    Router.push('/register-success');

    return;
  });

export const registerErrorMessagesSelector = createErrorSelector(
  RegisterPartnerUserAPI
);

const RegisterPartnerMemberAPI = RegisterPartnerMemberCreator(true);

export const registerPartnerMember = data =>
  respondToSuccess(RegisterPartnerMemberAPI.actionCreator(data), resp => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
      return;
    }
    Router.push('/register-success');

    return;
  });

export const registerMemberErrorSelector = createErrorSelector(
  RegisterPartnerMemberAPI
);

const CURRENT_USER_FIELDS = `
    id
    username
    email
    fullName
    createdAt
    updatedAt
`;

const GetCurrentUserAPI = GetCurrentUserCreator(`
  ... on PartnerUser {
    ${CURRENT_USER_FIELDS}
    firstName
    lastName
    status
    birthDay
    birthMonth
    birthYear
    birthDate
    title
    partner {
      id
      partnerId
      name
      address
      email
      phone
    }
    partnerUserRole: role
  }
`);

export const verifyScopeAndRole = user => {
  if (!user) {
    return false;
  }

  return user.partnerUserRole;
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

export const currentUserSelector = flow(
  GetCurrentUserAPI.dataSelector,
  get('data.me')
);

export const trackingIdSelector = flow(currentUserSelector, get('username'));

export const isOwnerSelector = flow(
  currentUserSelector,
  get('partnerUserRole'),
  isEqual(ACCOUNT_ROLES.ROLE_OWNER)
);

export const getCurrentUser = () =>
  respondToSuccess(GetCurrentUserAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });
export const currentPartnerSelector = flow(currentUserSelector, get('partner'));

export const currentUserErrorSelector = createErrorSelector(GetCurrentUserAPI);

const isUserLoggedIn = has('json.data.me');

export const doLogout = () => ({
  type: USER_LOGOUT
});

export const payToPartnerByPartner = args =>
  payToPartner(args, dispatcher => dispatcher(getMyWallets));

export const resetRegisterPartnerUser = dispatch =>
  dispatch(RegisterPartnerUserAPI.resetter(['data', 'error']));
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
