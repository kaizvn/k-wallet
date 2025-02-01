import { APP_ACTIONS, SOCIAL_TYPES } from '@revtech/rev-shared/enums';
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
import { payToPartner } from '@revtech/rev-shared/apis/actions';
import {
  gql,
  nfetch,
  removeToken,
  saveToken,
  saveTimezone,
  saveLanguage,
  getLanguage
} from '@revtech/rev-shared/libs';
import { makeFetchAction, ACTIONS } from 'redux-api-call';
import Router from 'next/router';
import brn from 'brn';

import { flow, get, has, map, path } from 'lodash/fp';

import { getMyWallets } from './WalletState';
import { respondToSuccess } from '../middlewares/api-reaction';
import { i18n } from '@revtech/rev-shared/i18n';
import { CHANGE_LANGUAGE } from '@revtech/rev-shared/apis/names';
import { parseBoolean } from '@revtech/rev-shared/utils';

export const REFRESH_TOKEN_API = 'RefreshTokenAPI';
export const REGISTER_NORMAL_USER_API = 'RegisterNormalUserAPI';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGOUT_API = 'USER_LOGOUT_API';
export const LOGIN_NORMAL_USER_API = 'LoginNormalUserAPI';
const LINK_TO_LOGIN = 'LINK_TO_LOGIN';
const LINK_TO_REGISTER = 'LINK_TO_REGISTER';

export const doLinkToLogin = () => ({ type: LINK_TO_LOGIN });
export const doLinkToRegister = () => ({ type: LINK_TO_REGISTER });

const DEFAULT_POPUP_NEW_WINDOW =
  'location=1,status=1,scrollbars=1, width=650,height=650';

export const createErrorSelector = (action) =>
  flow(
    brn(action.errorSelector, action.errorSelector, action.dataSelector),
    path('errors'),
    map((error) => error.message)
  );

const windowOpenPopUpForLoginSocial = (type) => {
  window.open(
    `${process.env.API_SERVER_URL}/client/auth/${type}`,
    `Login via ${type} account`,
    DEFAULT_POPUP_NEW_WINDOW
  );
};

const loginBySocialNetWorkEventHandler = (dispatch) => (event) => {
  const { payload, status } = event.data;
  let type = '';

  if (status === 'success') {
    type = APP_ACTIONS.LOGIN_BY_SOCIAL_SUCCESSFULLY;
  } else if (status === 'fail') {
    type = APP_ACTIONS.LOGIN_BY_SOCIAL_FAILED;
  }

  type &&
    dispatch({
      type,
      payload,
      dispatch
    });
};

const ForgotPasswordAPI = ForgotPasswordCreator(`user_forgot_password`);

export const forgotPassword = (email) => {
  return respondToSuccess(
    ForgotPasswordAPI.actionCreator({
      email
    }),
    (resp) => {
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
  path('data.user_forgot_password')
);

const ResetPasswordAPI = ResetPasswordCreator(`user_reset_password`);

export const resetPassword = (token, newPassword) => {
  return respondToSuccess(
    ResetPasswordAPI.actionCreator({
      token,
      newPassword
    }),
    (resp) => {
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
  get('data.user_reset_password')
);

export const resetPasswordErrorMessageSelector = createErrorSelector(
  ResetPasswordAPI
);

const RefreshTokenAPI = makeFetchAction(
  REFRESH_TOKEN_API,
  nfetch({
    endpoint: '/refresh_token'
  })
);

const LoginNormalUserAPI = makeFetchAction(
  LOGIN_NORMAL_USER_API,
  gql`
    query($username: String!, $password: String!, $authCode: String) {
      login_normal_user(
        username: $username
        password: $password
        authCode: $authCode
      ) {
        user {
          id
          fullName
          token
          setting {
            timezone
            language
          }
          twoFactorEnabled
        }
        isLoginBy2FA
      }
    }
  `
);

export const userLoginNormalSelector = flow(
  LoginNormalUserAPI.dataSelector,
  get('data.login_normal_user')
);

export const userLoginErrorMessageSelector = createErrorSelector(
  LoginNormalUserAPI
);

export const resetUserLoginNormal = (dispatch) => {
  dispatch(LoginNormalUserAPI.resetter(['data', 'error']));
};

export const socialNetworkLoginErrorSelector = get('loginBySocialNetWorkError');

export const loginNormalUser = (username, password, authCode) => {
  return respondToSuccess(
    LoginNormalUserAPI.actionCreator({
      username,
      password,
      authCode
    }),
    (resp, _, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      const { isLoginBy2FA, user } = resp.data.login_normal_user;

      if (isLoginBy2FA && !authCode) {
        return;
      }

      saveToken(user.token);
      saveTimezone(user.setting.timezone);
      saveLanguage(user.setting.language);
      const currentLanguage = parseBoolean(getLanguage())
        ? getLanguage()
        : i18n.options.defaultLanguage;
      i18n.changeLanguage(currentLanguage, () => {
        store.dispatch({
          type: CHANGE_LANGUAGE,
          payload: {
            symbol: currentLanguage
          }
        });

        Router.push('/user');
      });
      return;
    }
  );
};

export const refreshToken = () =>
  respondToSuccess(RefreshTokenAPI.actionCreator(), (resp) => {
    if (resp.error) {
      return;
    }

    if (resp.success) {
      saveToken(resp.token);
    }
  });

const RegisterPartnerUserAPI = RegisterPartnerUserCreator(true);

const EDIT_USER_FIELDS = `
  firstName
  lastName
  email
`;

const EditUserInfoAPI = EditUserInfoCreator(
  `
  ... on User{
    id
    ${EDIT_USER_FIELDS}
    title
    birthDay
    avatar
  }`,
  true
);

export const editUserInfo = (data) =>
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

const ChangePasswordAPI = ChangePasswordCreator(`change_user_password`);

export const changePassword = (currentPassword, newPassword) => {
  return respondToSuccess(
    ChangePasswordAPI.actionCreator({
      currentPassword,
      newPassword
    }),
    (resp) => {
      if (resp.errors) {
        console.error('Err: ', resp.errors);
        return;
      }
      Router.push('/user/profile');
      return;
    }
  );
};

export const changePasswordErrorMessageSelector = createErrorSelector(
  ChangePasswordAPI
);

export const resetChangePasword = (dispatch) => {
  dispatch(ChangePasswordAPI.resetter(['data', 'error']));
};

export const editUserInfoErrorMessageSelector = createErrorSelector(
  EditUserInfoAPI
);

export const editUserInfoSuccessMessageSelector = flow(
  EditUserInfoAPI.dataSelector,
  path('data.edit_my_info')
);

export const registerPartnerUser = (data) =>
  respondToSuccess(RegisterPartnerUserAPI.actionCreator(data), (resp) => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
      return;
    }

    Router.push('/partner/login');

    return;
  });

export const registerErrorMessagesSelector = createErrorSelector(
  RegisterPartnerUserAPI
);

const RegisterPartnerMemberAPI = RegisterPartnerMemberCreator();

export const registerPartnerMember = (data) =>
  respondToSuccess(RegisterPartnerMemberAPI.actionCreator(data), (resp) => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
      return;
    }

    Router.push('/partner/login');

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
... on User {
      ${CURRENT_USER_FIELDS}
      firstName
      lastName
      status
      birthDay
      birthMonth
      birthYear
      birthDate
      title
      mccCode
      phone
      avatar
    }
`);

export const verifyScopeAndRole = (user) => {
  if (!user) {
    return false;
  }

  return !user.systemUserRole && !user.partnerUserRole;
};

export const getUser = () =>
  respondToSuccess(GetCurrentUserAPI.actionCreator({}), (resp) => {
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

export const getCurrentUser = () =>
  respondToSuccess(GetCurrentUserAPI.actionCreator(), (resp) => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });
export const currentPartnerSelector = flow(currentUserSelector, get('partner'));

export const currentUserErrorSelector = createErrorSelector(GetCurrentUserAPI);

const isUserLoggedIn = has('json.data.me');

export const doLogout = () => [
  {
    type: USER_LOGOUT
  },
  doLogoutAPI()
];

const RegisterNormalUserAPI = makeFetchAction(
  REGISTER_NORMAL_USER_API,
  gql`
    mutation(
      $username: String!
      $password: String!
      $email: String!
      $title: String!
      $firstName: String!
      $lastName: String!
      $identity: String!
      $birthDateString: String!
      $phone: String!
      $mccCode: String!
    ) {
      register_normal_user(
        username: $username
        password: $password
        email: $email
        title: $title
        firstName: $firstName
        lastName: $lastName
        identity: $identity
        birthDateString: $birthDateString
        phone: $phone
        mccCode: $mccCode
      ) {
        id
        fullName
      }
    }
  `
);

export const registerNormalUser = (data) =>
  respondToSuccess(RegisterNormalUserAPI.actionCreator(data), (resp) => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
      return;
    }
    Router.push('/user/register-success');
    return;
  });

export const normalUserRegisterErrorSelector = createErrorSelector(
  RegisterNormalUserAPI
);

export const payToPartnerByUser = (args) =>
  payToPartner(args, (dispatcher) => dispatcher(getMyWallets));

const UserLogoutAPI = makeFetchAction(
  USER_LOGOUT_API,
  nfetch({ endpoint: '/signout' })
);

export const doLogoutAPI = () =>
  respondToSuccess(UserLogoutAPI.actionCreator());

export const doLoginSocialNetwork = (socialType, dispatch) => {
  let actionName;

  if (socialType === SOCIAL_TYPES.FACEBOOK) {
    actionName = APP_ACTIONS.LOGIN_BY_FACEBOOK;
  } else if (socialType === SOCIAL_TYPES.GOOGLE) {
    actionName = APP_ACTIONS.LOGIN_BY_GOOGLE;
  }

  return { type: actionName, payload: socialType, dispatch };
};

const registerEventHandler = (dispatch) =>
  window.addEventListener(
    'message',
    loginBySocialNetWorkEventHandler(dispatch)
  );

const removeEventHandler = (dispatch) =>
  window.removeEventListener(
    'message',
    loginBySocialNetWorkEventHandler(dispatch)
  );

export const resetChangeUserPassword = (dispatch) =>
  dispatch(ChangePasswordAPI.resetter(['data', 'error']));
export const resetEditUserInfo = (dispatch) =>
  dispatch(EditUserInfoAPI.resetter(['data', 'error']));
export const resetGetCurrentUser = (dispatch) =>
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

    if (type === LINK_TO_LOGIN) {
      Router.push('/login');
    }

    if (type === LINK_TO_REGISTER) {
      Router.push('/register');
    }

    return state;
  },
  loginBySocialNetwork(state = '', { type, payload, dispatch }) {
    if (
      type === APP_ACTIONS.LOGIN_BY_FACEBOOK ||
      type === APP_ACTIONS.LOGIN_BY_GOOGLE
    ) {
      windowOpenPopUpForLoginSocial(payload);

      removeEventHandler(dispatch);
      registerEventHandler(dispatch);

      return payload;
    }

    if (type === APP_ACTIONS.LOGIN_BY_SOCIAL_SUCCESSFULLY) {
      removeEventHandler(dispatch);
      saveToken(payload);

      Router.push('/user');

      return '';
    }

    if (type === APP_ACTIONS.LOGIN_BY_SOCIAL_FAILED) {
      removeEventHandler(dispatch);

      return '';
    }

    return state;
  },

  loginBySocialNetWorkError(state = '', { type, payload }) {
    if (type === APP_ACTIONS.LOGIN_BY_SOCIAL_FAILED) {
      return payload;
    }

    if (
      type === APP_ACTIONS.LOGIN_BY_FACEBOOK ||
      type === APP_ACTIONS.LOGIN_BY_GOOGLE ||
      type === APP_ACTIONS.LOGIN_BY_SOCIAL_SUCCESSFULLY
    ) {
      return '';
    }
    return state;
  }
};
