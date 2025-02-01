import { compact, concat, flow, join, split } from 'lodash/fp';
import { toast } from 'react-toastify';

import _fetchAndWait from './fetchAndWait';
import _getHeaders, { formatObj as _formatObj } from './getHeaders';
import _nfetch, { objectToQuery } from './nfetch';
import _redirect from './redirect';
import * as graphql from './graphql';
import _QrcodeGenerator from './qrCodeGenerator';
import * as tokenLibs from './token-libs';
import * as languageLibs from './language-libs';
import * as timezoneLibs from './timezone-libs';

export const isServer = !process.browser;

export const fetchAndWait = _fetchAndWait;
export const nfetch = _nfetch;
export const redirect = _redirect;
export const getHeaders = _getHeaders;
export const formatObj = _formatObj;
export const QrcodeGenerator = _QrcodeGenerator;

export const gql = graphql.gql;
export const intercepter = graphql.intercepter;

export const saveToken = tokenLibs.saveToken;
export const getToken = tokenLibs.getToken;
export const removeToken = tokenLibs.removeToken;

export const saveLanguage = languageLibs.saveLanguage;
export const getLanguage = languageLibs.getLanguage;
export const removeLanguage = languageLibs.removeLanguage;

export const saveTimezone = timezoneLibs.saveTimezone;
export const getTimezone = timezoneLibs.getTimezone;
export const removeTimezone = timezoneLibs.removeTimezone;

export const generateIDFromLabel = (label = '') => label.replace(/\s/g, '-');

export const objToQueryString = objectToQuery;

export const createLink = flow(compact, concat(['']), join('/'));

export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  toast.success('Copied');
};

export const getbackUrl = (path, postPath) =>
  getParentPath(path) + `${postPath ? '/' + postPath : ''}`;

export const getParentPath = flow(
  split('/'),
  arr => arr.slice(0, -1),
  join('/')
);
