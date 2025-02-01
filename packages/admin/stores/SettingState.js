import { always } from 'lodash/fp';
import { CHANGE_LANGUAGE } from '@revtech/rev-shared/apis/names';

const languages = [
  {
    id: 1,
    symbol: 'en',
    label: 'English'
  },
  {
    id: 2,
    symbol: 'jp',
    label: 'Japanese'
  }
];
export default {
  availableLanguages: always(languages),
  currentLanguage: (state = languages[0], { type, payload = {} }) => {
    const { id, symbol } = payload;
    if (type === CHANGE_LANGUAGE) {
      const result = id
        ? languages.find(lang => lang.id === id)
        : languages.find(lang => lang.symbol === symbol);
      state = result || languages[0];
      return state;
    }
    return state;
  }
};
