import { flow, join, map, path, get } from 'lodash/fp';
import { makeFetchAction } from 'redux-api-call';
import Router from 'next/router';
import { APP_ACTIONS } from '@revtech/rev-shared/enums';
import { respondToSuccess } from '../middlewares/api-reaction';
import {
  gql,
  saveToken,
  saveLanguage,
  saveTimezone,
  getLanguage
} from '@revtech/rev-shared/libs';
import { createErrorSelector } from './UserState';
import { getMemberList } from '@revtech/rev-shared/apis/actions';
import {
  ChangePasswordCreator,
  ResetPasswordCreator,
  ForgotPasswordCreator,
  CancelMemberInvitationCreator
} from '@revtech/rev-shared/apis/creators';
import { i18n } from '@revtech/rev-shared/i18n';
import { CHANGE_LANGUAGE } from '@revtech/rev-shared/apis/names';
import { parseBoolean } from '@revtech/rev-shared/utils';

export const FILTER_PARTNER = 'FILTER_PARTNER';
const {
  P_APPROVE,
  P_BAN,
  P_REJECT,
  P_UNBAN,
  U_APPROVE,
  U_BAN,
  U_REJECT,
  U_UNBAN
} = APP_ACTIONS;

export const ADMIN_LOGIN_API = 'ADMIN_LOGIN_API';
export const SEND_INVITE_PARTNER_API = 'SendInvitePartnerAPI';
const GET_PARTNER_LIST = 'GetPartnerListAPI';
const GET_PARTNER_DETAILS = 'GetPartnerDetailsAPI';
export const UPDATE_PARTNER_STATUS = 'UpdatePartnerStatusAPI';
export const UPDATE_USER_STATUS = 'UpdateUserStatusAPI';
export const GET_PARTNER_USER_DETAILS = 'GetPartnerUserDetailsAPI';
const GET_USER_LIST = 'GetUserListAPI';
const GET_PARTNER_USERS_LIST = 'GetPartnerUsersListAPI';
const GET_QUICK_FILTER_PARTNER_USERS_LIST = 'GetQuickFilterPartnerUsersListAPI';
const GET_USER_DETAILS = 'GetUserDetailsAPI';
const GET_MODERATOR_DETAILS = 'GetModeratorDetailsAPI';
const GET_OWNER_LIST = 'GetOwnerListAPI';
export const ADD_NEW_USER = 'AddNewUserAPI';
export const ADD_NEW_MODERATOR = 'AddNewModeratorAPI';
const GET_QUICK_FILTER_USERS_LIST = 'GetQuickFilterUsersListAPI';
const GET_QUICK_FILTER_PARTNER_LIST = 'GetQuickFilterPartnerListAPI';
const GET_QUICK_FILTER_MODERATOR_LIST = 'GetQuickFilterModeratorsListAPI';
export const CANCEL_PARTNER_INVITATION = 'CancelPartnerInvitationAPI';
export const UPDATE_GENERAL_SETTING = 'UpdateGeneralSettingAPI';
const GET_GENERAL_SETTING = 'GetGeneralSettingAPI';

const UpdateGeneralSettingAPI = makeFetchAction(
  UPDATE_GENERAL_SETTING,
  gql`
    mutation(
      $homePageTitle: String
      $homePageDescription: String
      $serverStatus: Boolean
      $transferLimit: Float
      $maintenanceMessage: String
    ) {
      set_general_setting(
        homePageTitle: $homePageTitle
        homePageDescription: $homePageDescription
        serverStatus: $serverStatus
        transferLimit: $transferLimit
        maintenanceMessage: $maintenanceMessage
      ) {
        homePageTitle
        homePageDescription
        serverStatus
        transferLimit
        maintenanceMessage
      }
    }
  `
);

export const updateGeneralSetting = ({
  homePageTitle,
  homePageDescription,
  serverStatus,
  transferLimit,
  maintenanceMessage
}) =>
  respondToSuccess(
    UpdateGeneralSettingAPI.actionCreator({
      homePageTitle,
      homePageDescription,
      serverStatus,
      transferLimit,
      maintenanceMessage
    }),
    (resp, headers, store) => {
      if (resp.error) {
        console.error(resp.error);
        return;
      }
      store.dispatch(getGeneralSetting());
      return;
    }
  );

export const updateGeneralSettingErrorMessageSelector = createErrorSelector(
  UpdateGeneralSettingAPI
);

export const updateGeneralSettingSuccessSelector = flow(
  UpdateGeneralSettingAPI.dataSelector,
  path('data.set_general_setting')
);

const GetGeneralSettingAPI = makeFetchAction(
  GET_GENERAL_SETTING,
  gql`
    query {
      get_general_setting {
        homePageTitle
        homePageDescription
        serverStatus
        transferLimit
        maintenanceMessage
        masterWallet
      }
    }
  `
);

export const getGeneralSetting = () =>
  respondToSuccess(GetGeneralSettingAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const getGeneralSettingDataSelector = flow(
  GetGeneralSettingAPI.dataSelector,
  get('data.get_general_setting')
);

export const resetGeneralSettings = dispatch => {
  dispatch(GetGeneralSettingAPI.resetter(['data', 'error']));
  dispatch(UpdateGeneralSettingAPI.resetter(['data', 'error']));
};

const LoginAdminUserAPI = makeFetchAction(
  ADMIN_LOGIN_API,
  gql`
    query($username: String!, $password: String!) {
      login_system_user(username: $username, password: $password) {
        id
        fullName
        token
        setting {
          language
          timezone
        }
      }
    }
  `
);

export const loginSysUser = (username, password) => {
  return respondToSuccess(
    LoginAdminUserAPI.actionCreator({
      username,
      password
    }),
    (resp, _, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      const { token, setting } = resp.data.login_system_user;
      saveToken(token);
      saveTimezone(setting.timezone);
      saveLanguage(setting.language);
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
        Router.push('/');
      });
      return;
    }
  );
};

export const loginErrorMessageSelector = flow(
  LoginAdminUserAPI.dataSelector,
  path('errors'),
  map(error => error.message)
);

const ChangePasswordAPI = ChangePasswordCreator(`change_system_user_password`);

const ForgotPasswordAPI = ForgotPasswordCreator(`system_user_forgot_password`);

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

export const changePasswordErrorMessageSelector = createErrorSelector(
  ChangePasswordAPI
);

export const resetAdminChangePasword = dispatch => {
  dispatch(ChangePasswordAPI.resetter(['data', 'error']));
};

export const forgotPasswordErrorMessageSelector = createErrorSelector(
  ForgotPasswordAPI
);

export const forgotPasswordSuccessMessageSelector = flow(
  ForgotPasswordAPI.dataSelector,
  path('data.system_user_forgot_password')
);

const ResetPasswordAPI = ResetPasswordCreator(`system_user_reset_password`);

export const resetPassword = (token, newPassword) => {
  return respondToSuccess(
    ResetPasswordAPI.actionCreator({
      token,
      newPassword
    }),
    resp => {
      if (resp.errors) {
        console.log('Err: ', resp.errors);
        return;
      }
      return;
    }
  );
};

export const resetPasswordSuccessMessageSelector = flow(
  ResetPasswordAPI.dataSelector,
  get('data.system_user_reset_password')
);

export const resetPasswordErrorMessageSelector = createErrorSelector(
  ResetPasswordAPI
);

const SendInvitePartnerAPI = makeFetchAction(
  SEND_INVITE_PARTNER_API,
  gql`
    mutation($email: String!) {
      invite_partner(email: $email) {
        id
      }
    }
  `
);
export const sendInvitePartnerErrorSelector = createErrorSelector(
  SendInvitePartnerAPI
);

export const UpdatePartnerStatusAPI = makeFetchAction(
  UPDATE_PARTNER_STATUS,
  gql`
    mutation($id: ID!, $action: UpdateStatusAction!) {
      update_partner_status(id: $id, action: $action) {
        name
        status
      }
    }
  `
);

const CancelMemberInvitationAPI = CancelMemberInvitationCreator(`name`);

export const UpdateUserStatusAPI = makeFetchAction(
  UPDATE_USER_STATUS,
  gql`
    mutation($id: ID!, $action: UpdateStatusAction!) {
      update_user_status(id: $id, action: $action) {
        fullName
        status
      }
    }
  `
);

export const GetUserListAPI = makeFetchAction(
  GET_USER_LIST,
  gql`
    query {
      get_normal_users {
        id
        username
        fullName
        email
        status
        createdAt
      }
    }
  `
);
export const GetPartnerUsersListAPI = makeFetchAction(
  GET_PARTNER_USERS_LIST,
  gql`
    query {
      get_partner_users {
        id
        fullName
        status
        createdAt
        email
        role
        partner {
          id
          name
        }
      }
    }
  `
);

export const GetUserDetailsAPI = makeFetchAction(
  GET_USER_DETAILS,
  gql`
    query($id: ID!) {
      get_normal_user(id: $id) {
        id
        title
        username
        fullName
        identity
        email
        status
        createdAt
        birthDate
        gender
        age
      }
    }
  `
);

export const GetModeratorDetailsAPI = makeFetchAction(
  GET_MODERATOR_DETAILS,
  gql`
    query($id: ID!) {
      get_system_user(id: $id) {
        id
        title
        username
        fullName
        email
        status
        createdAt
        birthDate
        gender
        age
      }
    }
  `
);

export const GetPartnerUserDetailsAPI = makeFetchAction(
  GET_PARTNER_USER_DETAILS,
  gql`
    query($id: ID!) {
      get_partner_user(id: $id) {
        id
        fullName
        status
        createdAt
        birthDay
        birthMonth
        birthYear
        gender
        email
      }
    }
  `
);

export const getUserDetailsSelector = flow(
  GetUserDetailsAPI.dataSelector,
  get('data.get_normal_user')
);

export const getModeratorDetailsSelector = flow(
  GetModeratorDetailsAPI.dataSelector,
  get('data.get_system_user')
);

export const getPartnerUserDetailsSelector = flow(
  GetPartnerUserDetailsAPI.dataSelector,
  get('data.get_partner_user')
);

export const getUserList = () =>
  respondToSuccess(GetUserListAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const normalUsersListSelector = flow(
  GetUserListAPI.dataSelector,
  get('data.get_normal_users')
);

export const getPartnerUsersList = () =>
  respondToSuccess(GetPartnerUsersListAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const partnerUserListSelector = flow(
  GetPartnerUsersListAPI.dataSelector,
  get('data.get_partner_users')
);

export const getUserDetailsAPI = id =>
  respondToSuccess(GetUserDetailsAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }
    return;
  });

export const getModeratorDetailsAPI = id =>
  respondToSuccess(GetModeratorDetailsAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }
    return;
  });

export const getPartnerUserDetailsAPI = id =>
  respondToSuccess(GetPartnerUserDetailsAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const sendInviteToPartner = email =>
  respondToSuccess(
    SendInvitePartnerAPI.actionCreator({
      email
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getQuickFilterPartnerList({}));
      return;
    }
  );

export const approvePartner = id =>
  respondToSuccess(
    UpdatePartnerStatusAPI.actionCreator({
      id: id,
      action: P_APPROVE
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getPartnerList());
      store.dispatch(getQuickFilterPartnerList({}));
      store.dispatch(getPartnerDetailsAPI(id));
      return;
    }
  );

export const unbanPartner = id =>
  respondToSuccess(
    UpdatePartnerStatusAPI.actionCreator({
      id: id,
      action: P_UNBAN
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getPartnerList());
      store.dispatch(getQuickFilterPartnerList({}));
      store.dispatch(getMemberList(id));
      store.dispatch(getPartnerDetailsAPI(id));
      return;
    }
  );

export const rejectPartner = id =>
  respondToSuccess(
    UpdatePartnerStatusAPI.actionCreator({
      id: id,
      action: P_REJECT
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getPartnerList());
      store.dispatch(getQuickFilterPartnerList({}));
      store.dispatch(getPartnerDetailsAPI(id));
      return;
    }
  );

export const banPartner = id =>
  respondToSuccess(
    UpdatePartnerStatusAPI.actionCreator({
      id: id,
      action: P_BAN
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getPartnerList());
      store.dispatch(getQuickFilterPartnerList({}));
      store.dispatch(getMemberList(id));
      store.dispatch(getPartnerDetailsAPI(id));
      return;
    }
  );

export const cancelMemberInvitation = id =>
  respondToSuccess(
    CancelMemberInvitationAPI.actionCreator({
      id
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getPartnerList());
      store.dispatch(getPartnerDetailsAPI(id));
      return;
    }
  );

export const approveUser = id =>
  respondToSuccess(
    UpdateUserStatusAPI.actionCreator({
      id: id,
      action: U_APPROVE
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getQuickFilterUsersList({}));
      store.dispatch(getUserDetailsAPI(id));
      return;
    }
  );

export const rejectUser = id =>
  respondToSuccess(
    UpdateUserStatusAPI.actionCreator({
      id: id,
      action: U_REJECT
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getQuickFilterUsersList({}));
      store.dispatch(getUserDetailsAPI(id));
      return;
    }
  );

export const banUser = (id, isModerator = false) =>
  respondToSuccess(
    UpdateUserStatusAPI.actionCreator({
      id: id,
      action: U_BAN
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      if (isModerator) {
        store.dispatch(getQuickFilterModeratorList({}));
        store.dispatch(getModeratorDetailsAPI(id));
      } else {
        store.dispatch(getQuickFilterUsersList({}));
        store.dispatch(getUserDetailsAPI(id));
      }
      return;
    }
  );

export const unbanUser = (id, isModerator = false) =>
  respondToSuccess(
    UpdateUserStatusAPI.actionCreator({
      id: id,
      action: U_UNBAN
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      if (isModerator) {
        store.dispatch(getQuickFilterModeratorList({}));
        store.dispatch(getModeratorDetailsAPI(id));
      } else {
        store.dispatch(getQuickFilterUsersList({}));
        store.dispatch(getUserDetailsAPI(id));
      }
      return;
    }
  );

const GetQuickFilterPartnerListAPI = makeFetchAction(
  GET_QUICK_FILTER_PARTNER_LIST,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_partners(filter: $filter) {
        partners {
          id
          partnerId
          name
          status
          createdAt
          email
          owner {
            id
            email
            fullName
          }
        }
        pageInfos {
          totalCount
          filter {
            page
            pageSize
          }
        }
      }
    }
  `
);

export const getQuickFilterPartnerList = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) => {
  return respondToSuccess(
    GetQuickFilterPartnerListAPI.actionCreator({
      filter: { page, pageSize, filterContents, dateRange }
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

export const getQuickFilterPartnerListSelector = flow(
  GetQuickFilterPartnerListAPI.dataSelector,
  get('data.get_quick_filter_partners')
);

const GetPartnerListAPI = makeFetchAction(
  GET_PARTNER_LIST,
  gql`
    query {
      get_partners {
        id
        partnerId
        name
        status
        createdAt
        owner {
          id
          email
          fullName
        }
      }
    }
  `
);

export const GetPartnerDetailsAPI = makeFetchAction(
  GET_PARTNER_DETAILS,
  gql`
    query($id: ID!) {
      get_partner(id: $id) {
        id
        partnerId
        name
        status
        createdAt
        address
        phone
        owner {
          id
          email
          fullName
          username
        }
      }
    }
  `
);

export const getPartnerList = () =>
  respondToSuccess(GetPartnerListAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

const GetOwnerListAPI = makeFetchAction(
  GET_OWNER_LIST,
  gql`
    query {
      get_partner_owners {
        id
        email
        fullName
        createdAt
        partner {
          id
          name
          status
          createdAt
        }
      }
    }
  `
);

export const getOwnerList = () =>
  respondToSuccess(GetOwnerListAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }
  });
export const getPartnerDetailsAPI = id =>
  respondToSuccess(GetPartnerDetailsAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const getPartnerDetailsSelector = flow(
  GetPartnerDetailsAPI.dataSelector,
  get('data.get_partner')
);

const AddNewUserAPI = makeFetchAction(
  ADD_NEW_USER,
  gql`
    mutation(
      $username: String!
      $password: String!
      $title: String!
      $firstName: String!
      $lastName: String!
      $birthDateString: String!
      $email: String!
      $identity: String!
      $country: String!
      $region: String!
      $zipCode: String!
      $phone: String!
      $mccCode: String!
      $address: String!
    ) {
      add_user(
        username: $username
        password: $password
        title: $title
        firstName: $firstName
        lastName: $lastName
        birthDateString: $birthDateString
        email: $email
        identity: $identity
        country: $country
        region: $region
        zipCode: $zipCode
        phone: $phone
        mccCode: $mccCode
        address: $address
      ) {
        id
        username
      }
    }
  `
);

export const addNewUser = ({
  username,
  password,
  title,
  firstName,
  lastName,
  birthDateString,
  email,
  identity,
  country,
  region,
  zipCode,
  phone,
  mccCode,
  address
}) =>
  respondToSuccess(
    AddNewUserAPI.actionCreator({
      username,
      password,
      title,
      firstName,
      lastName,
      birthDateString,
      email,
      identity,
      country,
      region,
      zipCode,
      phone,
      mccCode,
      address
    }),
    resp => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      Router.push('/users');
      return;
    }
  );

export const addUserErrorMessageSelector = flow(
  AddNewUserAPI.dataSelector,
  path('errors'),
  map(error => error.message),
  join(' | ')
);

export const addUserSuccessMessageSelector = flow(
  AddNewUserAPI.dataSelector,
  path('data.add_user')
);

const AddNewModeratorAPI = makeFetchAction(
  ADD_NEW_MODERATOR,
  gql`
    mutation(
      $username: String!
      $password: String!
      $title: String!
      $firstName: String!
      $lastName: String!
      $birthDateString: String!
      $email: String!
    ) {
      add_moderator(
        username: $username
        password: $password
        title: $title
        firstName: $firstName
        lastName: $lastName
        birthDateString: $birthDateString
        email: $email
      ) {
        id
        username
      }
    }
  `
);

export const addNewModerator = ({
  username,
  password,
  title,
  firstName,
  lastName,
  birthDateString,
  email
}) =>
  respondToSuccess(
    AddNewModeratorAPI.actionCreator({
      username,
      password,
      title,
      firstName,
      lastName,
      birthDateString,
      email
    }),
    resp => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      Router.push('/moderators');
      return;
    }
  );

export const addModeratorErrorMessageSelector = createErrorSelector(
  AddNewModeratorAPI
);

export const addModeratorSuccessMessageSelector = flow(
  AddNewModeratorAPI.dataSelector,
  path('data.add_moderator')
);

export const partnersSelector = flow(
  GetPartnerListAPI.dataSelector,
  get('data.get_partners')
);

const CancelPartnerInvitationAPI = makeFetchAction(
  CANCEL_PARTNER_INVITATION,
  gql`
    mutation($id: ID!) {
      cancel_partner_invitation(id: $id) {
        id
      }
    }
  `
);

export const cancelPartnerInvitation = id =>
  respondToSuccess(
    CancelPartnerInvitationAPI.actionCreator({ id }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getPartnerList());
      store.dispatch(getQuickFilterPartnerList({}));
      store.dispatch(getPartnerDetailsAPI(id));
      return;
    }
  );
const GetQuickFilterPartnerUsersListAPI = makeFetchAction(
  GET_QUICK_FILTER_PARTNER_USERS_LIST,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_partner_users(filter: $filter) {
        partnerUsers {
          id
          fullName
          status
          createdAt
          email
          role
          partner {
            id
            name
          }
        }
        pageInfos {
          totalCount
          filter {
            page
            pageSize
            filterContents
          }
        }
      }
    }
  `
);

export const getQuickFilterPartnerUsersList = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterPartnerUsersListAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: filterContents.trim(),
        dateRange
      }
    }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      return;
    }
  );

export const quickFilterPartnerUserListSelector = flow(
  GetQuickFilterPartnerUsersListAPI.dataSelector,
  get('data.get_quick_filter_partner_users')
);

export const getQuickFilterPartnerUserListErrorSelector = createErrorSelector(
  GetQuickFilterPartnerUsersListAPI
);

const GetQuickFilterUsersListAPI = makeFetchAction(
  GET_QUICK_FILTER_USERS_LIST,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_users(filter: $filter) {
        users {
          id
          username
          fullName
          email
          status
          createdAt
        }
        pageInfos {
          totalCount
          filter {
            page
            pageSize
          }
        }
      }
    }
  `
);

export const getQuickFilterUsersList = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterUsersListAPI.actionCreator({
      filter: { page, pageSize, filterContents, dateRange }
    }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      return;
    }
  );

export const getQuickFilterUsersListSelector = flow(
  GetQuickFilterUsersListAPI.dataSelector,
  get('data.get_quick_filter_users')
);

export const getQuickFilterUsersListErrorSelector = createErrorSelector(
  GetQuickFilterUsersListAPI
);

const GetQuickFilterModeratorListAPI = makeFetchAction(
  GET_QUICK_FILTER_MODERATOR_LIST,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_moderators(filter: $filter) {
        users {
          id
          username
          fullName
          email
          status
          createdAt
        }
        pageInfos {
          totalCount
          filter {
            page
            pageSize
          }
        }
      }
    }
  `
);

export const getQuickFilterModeratorList = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterModeratorListAPI.actionCreator({
      filter: { page, pageSize, filterContents, dateRange }
    }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      return;
    }
  );

export const getQuickFilterModeratorListSelector = flow(
  GetQuickFilterModeratorListAPI.dataSelector,
  get('data.get_quick_filter_moderators')
);

export const getQuickFilterModeratorListErrorSelector = createErrorSelector(
  GetQuickFilterModeratorListAPI
);

export default {};
