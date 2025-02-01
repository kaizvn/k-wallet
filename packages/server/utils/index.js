import { join, map, flow } from 'lodash/fp';
import { sortDefaultOptions } from '../graphql/libs/options';
import { Partners, PartnerUsers, Users, Settings } from '../services';
import { U_ACTIVE } from '../graphql/enums/userStatus';
import { P_ACTIVE } from '../graphql/enums/partnerStatus';
import mongoose from 'mongoose';
import moment from 'moment';
import i18n from 'i18n';

const DEFAULT_NUMBER_OF_DAYS_FILTER = 30;
export const DATE_FORMAT = 'MM/DD/YYYY';
export const TIME_FORMAT = 'HH:mm:ss';
export const DEFAULT_OPTIONS = {
  page: 0,
  pageSize: 10,
  filterContents: '',
  dateRange: {
    fromDate: '',
    toDate: ''
  }
};

export const MIN_FILTER_OPTIONS = {
  page: 0,
  pageSize: 5
};

export const getFilteredData = ({ collection, condition = {}, options }) => {
  const opts = Object.assign({}, DEFAULT_OPTIONS, options);
  let { page, pageSize } = opts;

  page = Math.max(page, MIN_FILTER_OPTIONS.page);
  pageSize = Math.max(pageSize, MIN_FILTER_OPTIONS.pageSize);
  return collection
    .find(condition)
    .sort(sortDefaultOptions)
    .skip(page * pageSize)
    .limit(pageSize);
};

export const getPageInfos = async ({ collection, condition = {}, options }) => {
  const opts = Object.assign({}, DEFAULT_OPTIONS, options);
  const totalCount = await collection.find(condition).countDocuments();
  const filter = opts;
  return { totalCount, filter };
};

export const limitDateRange = ({
  fromDate,
  toDate,
  limitDays = DEFAULT_NUMBER_OF_DAYS_FILTER,
  timezone
}) => {
  const formatDateTime = `${DATE_FORMAT} ${TIME_FORMAT}`;
  if (!timezone) throw new Error(i18n.__('utils.not_found.timezone'));

  if (!moment(fromDate, DATE_FORMAT).isValid()) fromDate = '';
  if (!moment(toDate, DATE_FORMAT).isValid()) toDate = '';

  if (!fromDate && !toDate)
    throw new Error(i18n.__('utils.invalid.from_date_and_to_date'));
  else if (fromDate && toDate) {
    let days = moment(toDate, DATE_FORMAT).diff(
      moment(fromDate, DATE_FORMAT),
      'days'
    );
    if (days > limitDays) {
      throw new Error(
        i18n.__('utils.error.out_of_limit_date_range', { limitDays })
      );
    }

    if (moment(fromDate, DATE_FORMAT).isAfter(moment(toDate, DATE_FORMAT))) {
      let swap = toDate;
      toDate = fromDate;
      fromDate = swap;
    }
  } else if (fromDate) {
    toDate = moment(fromDate, DATE_FORMAT)
      .add(limitDays, 'days')
      .format(DATE_FORMAT);
  } else if (toDate) {
    fromDate = moment(toDate, DATE_FORMAT)
      .subtract(limitDays, 'days')
      .format(DATE_FORMAT);
  }

  fromDate = moment
    .tz(`${fromDate} 00:00:00`, formatDateTime, timezone)
    .utc()
    .toISOString();
  toDate = moment
    .tz(`${toDate} 23:59:59`, formatDateTime, timezone)
    .utc()
    .toISOString();
  return { fromDate, toDate };
};

export const getDataWithFilter = async ({
  collection,
  condition = {},
  options,
  limitDays
}) => {
  const formatDateTime = `${DATE_FORMAT} ${TIME_FORMAT}`;
  let opts = Object.assign({}, DEFAULT_OPTIONS, options);
  let { page, pageSize, dateRange, timezone = 'UTC' } = opts;

  if (dateRange.fromDate || dateRange.toDate) {
    let { fromDate, toDate } = limitDateRange({
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
      limitDays,
      timezone
    });

    opts.dateRange = {
      fromDate: moment(fromDate).tz(timezone).format(formatDateTime),
      toDate: moment(toDate).tz(timezone).format(formatDateTime)
    };
    condition.created_at = {
      $gte: fromDate,
      $lt: toDate
    };
  }

  opts.page = Math.max(page, MIN_FILTER_OPTIONS.page);
  opts.pageSize = Math.max(pageSize, MIN_FILTER_OPTIONS.pageSize);

  return {
    data: await collection
      .find(condition)
      .sort(sortDefaultOptions)
      .skip(opts.page * opts.pageSize)
      .limit(opts.pageSize),
    pageInfos: {
      totalCount: await collection.countDocuments(condition),
      filter: opts
    }
  };
};

const isObjectModel = (obj) => obj.prototype instanceof mongoose.Model;

export const findUser = async (query, collection = Users) => {
  if (typeof query === 'string') {
    query = { id: query };
  }
  const user = isObjectModel(collection) && (await collection.findOne(query));
  if (user && user.status === U_ACTIVE) {
    return user;
  } else {
    return null;
  }
};

export const findPartner = async (query) => {
  if (typeof query === 'string') {
    query = { id: query };
  }
  const partner = await Partners.findOne(query);
  if (partner && partner.status === P_ACTIVE) {
    return partner;
  } else {
    return null;
  }
};

export const findUsersOfPartner = async (query) => {
  if (typeof query === 'string') {
    query = { id: query };
  }
  const usersOfPartner = await PartnerUsers.find(query);
  const usersOfPartnerAvaliable =
    usersOfPartner && usersOfPartner.filter((user) => user.status === U_ACTIVE);

  if (usersOfPartnerAvaliable.length) {
    return usersOfPartnerAvaliable;
  } else {
    return null;
  }
};

export const getTimezoneByOwnerId = async (owner_id) => {
  const setting = (await Settings.findOne({ owner_id })) || {};
  return setting.timezone;
};

const formatKeywordsToExactPhrase = (str) => {
  const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/g;
  let keyWords = (str || '').trim();

  if (keyWords.match(regexSpecialChar) || keyWords.split(' ').length > 1) {
    return flow(
      map((elWord) => `"${elWord}"`),
      join(' ')
    )(keyWords.split(' '));
  }
  return keyWords;
};

export const formatFilter = async (filter, owner_id) => {
  const formatedFilter = Object.assign({}, DEFAULT_OPTIONS, filter);
  const { dateRange } = formatedFilter;

  formatedFilter.filterContents = formatKeywordsToExactPhrase(
    filter.filterContents
  );

  if ((dateRange.fromDate || dateRange.toDate) && owner_id) {
    formatedFilter['timezone'] = await getTimezoneByOwnerId(owner_id);
  }

  return formatedFilter;
};

export const findAllUserIdAndPartnerId = async (condition) => {
  const userIds = (
    await Users.find(condition, {
      id: 1,
      _id: 0
    })
  ).map((user) => user.id);
  const partnerIds = (
    await Partners.find(condition, {
      id: 1,
      _id: 0
    })
  ).map((partner) => partner.id);
  return [...userIds, ...partnerIds];
};

export const parseBoolean = (val) => (!val || val === 'false' ? false : true);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
