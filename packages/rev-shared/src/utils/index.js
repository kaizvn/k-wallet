import { isArray } from 'lodash/fp';
import { toast } from 'react-toastify';
import React from 'react';
import { getToken } from '../libs';
import axios from 'axios';
import moment from 'moment';

import {
  P_APPROVE,
  P_BAN,
  P_CANCELLED,
  P_CANCEL_INVITATION,
  P_COPY_INVITATION_LINK,
  P_REJECT,
  P_RESEND,
  P_UNBAN,
  TOAST_DEFAULT,
  TOAST_ERROR,
  TOAST_INFO,
  TOAST_SUCCESS,
  TOAST_WARN,
  U_APPROVE,
  U_BAN,
  U_CANCEL_INVITATION,
  U_COPY_INVITATION_LINK,
  U_REJECT,
  U_RESEND,
  U_UNBAN,
  TRANSACTION_APPROVE_BY_ADMIN,
  TRANSACTION_REJECT_BY_ADMIN,
  TRANSACTION_APPROVE_BY_PARTNER,
  TRANSACTION_REJECT_BY_PARTNER,
  TX_APPROVE,
  TX_REJECT,
  TX_MANUAL
} from '../enums/actions';
import * as _COINTYPES from './coinType';
import * as _OPTIONS from './options';
import * as _VALIDATIONS from './validations';
import * as _EXCHANGES from './exchanges';
import { COIN_ACTIVE, COIN_INACTIVE } from '../enums/status';

export const OPTIONS = _OPTIONS;
export const VALIDATIONS = _VALIDATIONS;
export const COINTYPES = _COINTYPES;
export const EXCHANGES = _EXCHANGES;

export const filterPartnerRole = [
  {
    label: 'Owner',
    value: 'partner_admin'
  },
  {
    label: 'Member',
    value: 'partner_member'
  }
];

export const IMAGE_MB_LIMITED = 5;

export const DATE_FORMAT = 'MM/DD/YYYY';

export const TIME_FORMAT = 'hh:mm:ss A';

export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const formatDate = time =>
  time ? moment(time).format(DATE_FORMAT) : null;

export const isValidDateFormat = value =>
  value ? moment(value, DATE_FORMAT, true).isValid() : false;

export const Days = (selectedMonth, selectedYear) => {
  const month = parseInt(selectedMonth);
  const year = parseInt(selectedYear);

  let maxDay = 31;
  if ([4, 6, 9, 11].includes(month)) {
    maxDay = 30;
  }
  if (month === 2) {
    maxDay = 28;
    if (!(year % 4)) {
      maxDay = 29;
    }
  }
  let days = [];

  for (let i = 1; i <= maxDay; i++) {
    days.push({ name: i, value: i });
  }

  return days;
};

export const Months = () => {
  let months = [];
  for (let i = 1; i <= 12; i++) {
    months.push({ name: i, value: i });
  }
  return months;
};

export const Years = () => {
  let years = [];
  let currentYear = new Date().getFullYear();
  const endYear = currentYear - 18;
  const startYear = endYear - 80;

  for (let i = endYear; i >= startYear; i--) {
    years.push({ name: i, value: i });
  }

  return years;
};

export const InformationComponent = ({ children }) => (
  <React.Fragment>
    {children ? children : <em>Not define yet.</em>}
  </React.Fragment>
);

export const PaymentCoinInfo = { id: 'ETH', name: 'Ethereum', min: '0.05' };

export const doDispatchAction = dispatch => fetchData => {
  let actionCreators = fetchData;
  if (typeof fetchData === 'function') {
    actionCreators = [fetchData];
  }

  if (isArray(actionCreators)) {
    actionCreators.forEach(actionCreator => dispatch(actionCreator()));
  }
};

export const DEFAULT_PAGING_INFO = {
  page: 0,
  pageSize: 10,
  filterContents: ''
};

export const DEFAULT_DATE_RANGE = {
  fromDate: null,
  toDate: null
};

export const mappedStringWithT = t => label => t(label);

export const getLabelByActionWithT = ({ action, t }) => {
  switch (action) {
    case P_BAN:
      return t('common:rev_shared.enums.actions.p_ban');
    case P_UNBAN:
      return t('common:rev_shared.enums.actions.p_unban');
    case P_APPROVE:
      return t('common:rev_shared.enums.actions.p_approve');
    case P_REJECT:
      return t('common:rev_shared.enums.actions.p_reject');
    case P_CANCELLED:
      return t('common:rev_shared.enums.actions.p_cancelled');
    case P_COPY_INVITATION_LINK:
      return t('common:rev_shared.enums.actions.p_copy_invitation_link');
    case P_CANCEL_INVITATION:
      return t('common:rev_shared.enums.actions.p_cancel_invitation');
    case P_RESEND:
      return t('common:rev_shared.enums.actions.p_resend');
    case U_APPROVE:
      return t('common:rev_shared.enums.actions.u_approve');
    case U_BAN:
      return t('common:rev_shared.enums.actions.p_ban');
    case U_CANCEL_INVITATION:
      return t('common:rev_shared.enums.actions.u_cancel_invitation');
    case U_COPY_INVITATION_LINK:
      return t('common:rev_shared.enums.actions.u_copy_invitation_link');
    case U_REJECT:
      return t('common:rev_shared.enums.actions.u_reject');
    case U_RESEND:
      return t('common:rev_shared.enums.actions.u_resend');
    case U_UNBAN:
      return t('common:rev_shared.enums.actions.u_unban');
    case TRANSACTION_APPROVE_BY_ADMIN:
      return t('common:rev_shared.enums.actions.transaction_approve_by_admin');
    case TRANSACTION_REJECT_BY_ADMIN:
      return t('common:rev_shared.enums.actions.transaction_reject_by_admin');
    case TRANSACTION_APPROVE_BY_PARTNER:
      return t(
        'common:rev_shared.enums.actions.transaction_approve_by_partner'
      );
    case TRANSACTION_REJECT_BY_PARTNER:
      return t('common:rev_shared.enums.actions.transaction_reject_by_partner');
    case COIN_ACTIVE:
      return t('common:rev_shared.enums.actions.active');
    case COIN_INACTIVE:
      return t('common:rev_shared.enums.actions.inactive');
    case TX_APPROVE:
      return t('common:rev_shared.enums.actions.tx_approve');
    case TX_REJECT:
      return t('common:rev_shared.enums.actions.tx_reject');
    case TX_MANUAL:
      return t('common:rev_shared.enums.actions.tx_manual');
    default:
      return '';
  }
};

export const getToastFunction = (type, options = {}) => {
  const optsMerge = Object.assign({}, _OPTIONS.TOAST_DEFAULT_OPTIONS, options);
  let doToast = null;
  switch (type) {
    case TOAST_SUCCESS:
      doToast = toast.success;
      break;
    case TOAST_ERROR:
      doToast = toast.error;
      break;
    case TOAST_WARN:
      doToast = toast.warn;
      break;
    case TOAST_INFO:
      doToast = toast.info;
      break;
    case TOAST_DEFAULT:
      doToast = toast;
      break;
    default:
      return doToast;
  }
  return message => doToast(message, optsMerge);
};

export const doSuccessNotify = ({ message, options = {} }) =>
  message &&
  toast.success(
    message,
    Object.assign({}, _OPTIONS.TOAST_DEFAULT_OPTIONS, options)
  );

export const doErrorNotify = ({ message, options = {} }) =>
  message &&
  toast.error(
    message,
    Object.assign({}, _OPTIONS.TOAST_DEFAULT_OPTIONS, options)
  );

export const doFunctionWithEnter = (event, func) =>
  typeof event === 'object' &&
  event.key === 'Enter' &&
  typeof func === 'function' &&
  func();

export const parseBoolean = val =>
  !val || val === 'false' || val === 'null' || val === 'undefined'
    ? false
    : true;

export const doGet = args =>
  axios({
    ...args,
    method: 'GET',
    headers: Object.assign({}, args.headers, { Authorization: getToken() })
  });
export const getImageMBFromBase64 = image => {
  if (image && typeof image === 'string') {
    const buffer = Buffer.from(image.substring(image.indexOf(',') + 1));
    return buffer.length / 1e6;
  }
};

export const imageTypeSupported = ['image/png', 'image/jpeg'];

export function isValidEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const GETTING_RATE_INTERVAL = 15000;

export const parseExactlyWithNumberField = ({ object, specialField = [] }) => {
  for (var key in object) {
    if (!isNaN(object[key]) && !!object[key] && !specialField.includes(key)) {
      object[key] = parseFloat(object[key]);
    }
  }
  return object;
};
