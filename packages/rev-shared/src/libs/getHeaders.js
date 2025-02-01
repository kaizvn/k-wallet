import { identity, pickBy } from 'lodash/fp';
import { i18n } from '../i18n';
import { getToken } from './token-libs';

export const formatObj = pickBy(identity);

export default (options = {}) =>
  Object.assign(
    {},
    {
      Authorization: getToken(),
      'Content-Type': 'application/json',
      'accept-language': i18n.language
    },
    formatObj(options)
  );
