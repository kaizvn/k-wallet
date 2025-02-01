import { makeFetchAction } from 'redux-api-call';
import Router from 'next/router';

import { flow, get, join, map, path } from 'lodash/fp';

import { PaymentCoinInfo, parseBoolean } from '@revtech/rev-shared/utils';
import { APP_ACTIONS } from '@revtech/rev-shared/enums';
import {
  sendToUser,
  getMemberList,
  getPartnerMemberDetails,
  createPartnerWallets
} from '@revtech/rev-shared/apis/actions';
import {
  GetCurrentUserCreator,
  CancelMemberInvitationCreator,
  GetQuickFilterTransactionsCreator,
  GetQuickFilterPendingTransactionsCreator
} from '@revtech/rev-shared/apis/creators';
import { createErrorSelector, currentPartnerSelector } from './UserState';
import { getMyWallets } from './WalletState';
import {
  gql,
  saveToken,
  saveTimezone,
  saveLanguage,
  getLanguage
} from '@revtech/rev-shared/libs';
import { respondToSuccess } from '../middlewares/api-reaction';
import { i18n } from '@revtech/rev-shared/i18n';
import { CHANGE_LANGUAGE } from '@revtech/rev-shared/apis/names';

const { U_APPROVE, U_BAN, U_REJECT, U_UNBAN } = APP_ACTIONS;

export const LOGIN_PARTNER_USER_API = 'LoginParterUserAPI';

export const SEND_INVITE_MEMBER_API = 'SendInviteMemberAPI';
export const UPDATE_MEMBER_STATUS = 'UpdateMemberStatusAPI';

const GET_TRANSACTIONS_LIST = 'GetTransactionsListAPI';
export const UPDATE_PARTNER_SETTING = 'UpdatePartnerSettingAPI';
const GET_PARTNER_SETTING = 'GetPartnerSettingAPI';
const GET_QUICK_FILTER_MEMBER_LIST = 'GetQuickFilterMemberListAPI';
const GET_GENERAL_LIMIT_TRANSFER = 'GetGeneralLimitTransferAPI';

const CURRENT_USER_FIELDS = `
    id
    username
    email
    fullName
    createdAt
    updatedAt
`;

const GetCurrentPartnerUserAPI = GetCurrentUserCreator(`
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
  }
  partnerUserRole: role
}
`);

export const getCurrentPartnerUser = () =>
  respondToSuccess(GetCurrentPartnerUserAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const currentPartnerUserSelector = flow(
  GetCurrentPartnerUserAPI.dataSelector,
  get('data.me')
);

const GetGeneralLimitTransferAPI = makeFetchAction(
  GET_GENERAL_LIMIT_TRANSFER,
  gql`
    query {
      get_general_transfer_limit {
        timezone
        callbackUrl
        language
        transferLimit
      }
    }
  `
);

export const getGeneralLimitTransferSetting = () =>
  respondToSuccess(GetGeneralLimitTransferAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const getGeneralLimitTransferSettingDataSelector = flow(
  GetGeneralLimitTransferAPI.dataSelector,
  get('data.get_general_transfer_limit.transferLimit')
);

const GetPartnerGeneralSettingAPI = makeFetchAction(
  GET_PARTNER_SETTING,
  gql`
    query {
      get_partner_setting {
        timezone
        language
        callbackUrl
        partnerName
        partnerDescription
        transferLimit
        serviceStatus
      }
    }
  `
);

export const getPartnerGeneralSetting = () =>
  respondToSuccess(GetPartnerGeneralSettingAPI.actionCreator({}), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }
    return;
  });
export const getPartnerGeneralSettingDataSelector = flow(
  GetPartnerGeneralSettingAPI.dataSelector,
  get('data.get_partner_setting')
);

const UpdatePartnerGeneralSettingAPI = makeFetchAction(
  UPDATE_PARTNER_SETTING,
  gql`
    mutation(
      $callbackUrl: String
      $timezone: String
      $partnerName: String
      $partnerDescription: String
      $transferLimit: Float
      $serviceStatus: Boolean
    ) {
      set_partner_setting(
        timezone: $timezone
        callbackUrl: $callbackUrl
        partnerName: $partnerName
        partnerDescription: $partnerDescription
        transferLimit: $transferLimit
        serviceStatus: $serviceStatus
      ) {
        timezone
        callbackUrl
        partnerName
        partnerDescription
        transferLimit
        serviceStatus
      }
    }
  `
);

export const updatePartnerGeneralSetting = ({
  callbackUrl,
  timezone,
  partnerName,
  partnerDescription,
  transferLimit,
  serviceStatus
}) =>
  respondToSuccess(
    UpdatePartnerGeneralSettingAPI.actionCreator({
      callbackUrl,
      timezone,
      partnerName,
      partnerDescription,
      transferLimit,
      serviceStatus
    }),
    (resp, _, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      const partnerId = currentPartnerSelector(store.getState()).id;
      store.dispatch(getPartnerGeneralSetting(partnerId));
      return;
    }
  );

export const updatePartnerGeneralSettingErrorMessageSelector = createErrorSelector(
  UpdatePartnerGeneralSettingAPI
);

export const updatePartnerGeneralSettingSuccessSelector = flow(
  UpdatePartnerGeneralSettingAPI.dataSelector,
  path('data.set_partner_setting')
);

export const resetPartnerSettings = dispatch => {
  dispatch(GetPartnerGeneralSettingAPI.resetter(['data', 'error']));
  dispatch(UpdatePartnerGeneralSettingAPI.resetter(['data', 'error']));
};

const SendInviteMemberAPI = makeFetchAction(
  SEND_INVITE_MEMBER_API,
  gql`
    mutation($email: String!) {
      invite_member(email: $email) {
        id
        email
        fullName
        status
        role
        partner {
          id
          partnerId
          name
          createdAt
        }
      }
    }
  `
);

export const sendInviteToMember = email =>
  respondToSuccess(
    SendInviteMemberAPI.actionCreator({
      email
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getMemberList());
      store.dispatch(getQuickFilterMemberList({}));
      return;
    }
  );

export const sendInviteToMemberErrorSelector = createErrorSelector(
  SendInviteMemberAPI
);

const LoginPartnerUserAPI = makeFetchAction(
  LOGIN_PARTNER_USER_API,
  gql`
    query($username: String!, $password: String!) {
      login_partner_user(username: $username, password: $password) {
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

const UpdateMemberStatusAPI = makeFetchAction(
  UPDATE_MEMBER_STATUS,
  gql`
    mutation($id: ID!, $action: UpdateStatusAction!) {
      update_member_status(id: $id, action: $action) {
        fullName
        status
      }
    }
  `
);

export const approveMember = id =>
  respondToSuccess(
    UpdateMemberStatusAPI.actionCreator({
      id: id,
      action: U_APPROVE
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getMemberList());
      store.dispatch(getQuickFilterMemberList({}));
      store.dispatch(getPartnerMemberDetails(id));
      return;
    }
  );

export const rejectMember = id =>
  respondToSuccess(
    UpdateMemberStatusAPI.actionCreator({
      id: id,
      action: U_REJECT
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getMemberList());
      store.dispatch(getPartnerMemberDetails(id));
      store.dispatch(getQuickFilterMemberList({}));
      return;
    }
  );

export const banMember = id =>
  respondToSuccess(
    UpdateMemberStatusAPI.actionCreator({
      id: id,
      action: U_BAN
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getMemberList());
      store.dispatch(getQuickFilterMemberList({}));
      store.dispatch(getPartnerMemberDetails(id));
      return;
    }
  );

export const unbanMember = id =>
  respondToSuccess(
    UpdateMemberStatusAPI.actionCreator({
      id: id,
      action: U_UNBAN
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      store.dispatch(getMemberList());
      store.dispatch(getQuickFilterMemberList({}));
      store.dispatch(getPartnerMemberDetails(id));
      return;
    }
  );

const CancelMemberInvitationAPI = CancelMemberInvitationCreator(`email`);

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
      store.dispatch(getMemberList());
      store.dispatch(getQuickFilterMemberList({}));
      store.dispatch(getPartnerMemberDetails(id));
      return;
    }
  );

export const loginPartnerUser = (username, password) => {
  return respondToSuccess(
    LoginPartnerUserAPI.actionCreator({
      username,
      password
    }),
    (resp, _, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      const { token, setting } = resp.data.login_partner_user;
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

export const partnerLoginErrorMessageSelector = flow(
  LoginPartnerUserAPI.dataSelector,
  path('errors'),
  map('message'),
  join(' | ')
);

const SWITCH_TRANSACTION_FROM_TO_DATA = `
... on Partner {
  id
  name
}
... on User {
  id
  fullName
}
... on OutsiderWallet {
  address
}
`;
const GetTransactionsListAPI = makeFetchAction(
  GET_TRANSACTIONS_LIST,
  gql`
    query {
      get_all_transactions {
        id
        order {
          id
        }
        from {
          ${SWITCH_TRANSACTION_FROM_TO_DATA}
        }
        to {
        ${SWITCH_TRANSACTION_FROM_TO_DATA}
        }
        amount
        status
        coin {
          symbol
        }
        description
        isDelivered
        createdAt
      }
    }
  `
);

export const getTransactionsList = () =>
  respondToSuccess(GetTransactionsListAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const getTransactionsListSelector = flow(
  GetTransactionsListAPI.dataSelector,
  get('data.get_all_transactions')
);

export const sendToUserByPartner = args =>
  sendToUser(args, dispatcher => dispatcher(getMyWallets));

export const createPartnerWalletsByPartner = args =>
  createPartnerWallets(args, dispatcher => dispatcher(getMyWallets));

const GetQuickFilterTransactionsAPI = GetQuickFilterTransactionsCreator();

const GetQuickFilterPendingTransactionsAPI = GetQuickFilterPendingTransactionsCreator();

const GetQuickFilterMemberListAPI = makeFetchAction(
  GET_QUICK_FILTER_MEMBER_LIST,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_partner_members(filter: $filter) {
        partnerUsers {
          id
          username
          partner {
            id
            partnerId
          }
          fullName
          email
          role
          status
          createdAt
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

export const getQuickFilterMemberList = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) => {
  return respondToSuccess(
    GetQuickFilterMemberListAPI.actionCreator({
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
};
export const getQuickFilterTransactionsList = ({
  page = 0,
  pageSize = 10,
  searchMessage = '',
  dateRange
}) => {
  return respondToSuccess(
    GetQuickFilterTransactionsAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: searchMessage.trim(),
        dateRange
      }
    }),
    resp => {
      if (resp.errors) console.log(resp.errors);

      return;
    }
  );
};

export const getQuickFilterPendingTransactions = ({
  page = 0,
  pageSize = 10,
  searchMessage = '',
  dateRange
}) => {
  return respondToSuccess(
    GetQuickFilterPendingTransactionsAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: searchMessage.trim(),
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
};

export const getQuickFilterTransactionsListSelector = flow(
  GetQuickFilterTransactionsAPI.dataSelector,
  get('data.get_quick_filter_transactions')
);

export const getQuickFilterPendingTransactionsSelector = flow(
  GetQuickFilterPendingTransactionsAPI.dataSelector,
  get('data.get_quick_filter_pending_transactions')
);

export const getQuickFilterPartnerMembersSelector = flow(
  GetQuickFilterMemberListAPI.dataSelector,
  get('data.get_quick_filter_partner_members')
);

export const getQuickFilterTransactionsErrorSelector = createErrorSelector(
  GetQuickFilterTransactionsAPI
);

export const getQuickFilterPendingTransactionsErrorSelector = createErrorSelector(
  GetQuickFilterPendingTransactionsAPI
);

export const resetGetPartnerGeneralSetting = dispatch => {
  dispatch(GetPartnerGeneralSettingAPI.resetter(['data', 'error']));
};

export const resetUpdatePartnerGeneralSetting = dispatch => {
  dispatch(UpdatePartnerGeneralSettingAPI.resetter(['data', 'error']));
};
export default {
  paymentCoinInfo: (state = PaymentCoinInfo) => {
    return state;
  },
  availableWithdrawal: (state = 10) => {
    return state;
  },
  transactionFee: (state = 0.01) => {
    return state;
  }
};
