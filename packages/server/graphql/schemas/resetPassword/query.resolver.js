import { TOKEN_TYPES } from '../../../services/token';
import { Tokens } from '../../../services';
import i18n from 'i18n';

const { ADMIN_SERVER_URL, PARTNER_SERVER_URL, CLIENT_SERVER_URL } = process.env;

const getTypeByOrigin = (origin) => {
  switch (origin) {
    case ADMIN_SERVER_URL:
      return TOKEN_TYPES.SYS_USER;
    case PARTNER_SERVER_URL:
      return TOKEN_TYPES.PARTNER_USER;
    case CLIENT_SERVER_URL:
    default:
      return TOKEN_TYPES.NORMAL_USER;
  }
};

module.exports = {
  Query: {
    check_token_reset_password: async (_, { token }, { req }) => {
      const origin = req.get('origin');

      if (!origin) {
        return { email: '' };
      }
      const type = getTypeByOrigin(origin);

      const email = await Tokens.getTokenData({ token, type });
      if (!email) {
        throw new Error(i18n.__('resetPassword.query.error.invalid'));
      }

      return { email };
    }
  }
};
