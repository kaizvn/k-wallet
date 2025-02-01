import uuid from 'uuid';
import i18n from 'i18n';
import { PartnerUsers, SystemUsers, Users, Tokens } from '../../../services';
import { PubSub } from '../../../pubsub';
import { TOKEN_TYPES } from '../../../services/token';
import {
  USER_FORGOT_PASSWORD,
  PARTNER_FORGOT_PASSWORD,
  ADMIN_FORGOT_PASSWORD
} from '../../../pubsub/events';

const getCollectionByType = type => {
  switch (type) {
    case TOKEN_TYPES.PARTNER_USER:
      return PartnerUsers;
    case TOKEN_TYPES.SYS_USER:
      return SystemUsers;
    case TOKEN_TYPES.NORMAL_USER:
    default:
      return Users;
  }
};

const resetPasswordByType = async ({ type, token, newPassword }) => {
  const email = await Tokens.getTokenData({
    token,
    type
  });

  const DataColletions = getCollectionByType(type);

  const existedAccount = await DataColletions.findOne({
    email
  });

  existedAccount.password = newPassword;
  await existedAccount.save();
  await Tokens.deleteToken({ token, type });

  return { email };
};

const createReSetTokenByType = async ({ email, type, language }) => {
  const DataColletions = getCollectionByType(type);
  const existedAccount = await DataColletions.findOne({ email });

  if (!existedAccount) {
    throw new Error(i18n.__('resetPassword.mutation.error.not_exist'));
  }

  const tokenData = {
    token: uuid(),
    email,
    language
  };

  Tokens.createTokenData({ type, ...tokenData });
  return tokenData;
};

module.exports = {
  Mutation: {
    user_forgot_password: async (_, { email }, { req }) => {
      const language = req.headers['accept-language'];
      const type = TOKEN_TYPES.NORMAL_USER;
      const tokenData = await createReSetTokenByType({ email, type, language });
      PubSub.emit(USER_FORGOT_PASSWORD, tokenData);
      return { email };
    },

    user_reset_password: async (_, { token, newPassword }) => {
      const type = TOKEN_TYPES.NORMAL_USER;
      return resetPasswordByType({ type, token, newPassword });
    },

    partner_user_forgot_password: async (_, { email }, { req }) => {
      const language = req.headers['accept-language'];
      const type = TOKEN_TYPES.PARTNER_USER;
      const tokenData = await createReSetTokenByType({ email, type, language });

      PubSub.emit(PARTNER_FORGOT_PASSWORD, tokenData);
      return { email };
    },

    partner_user_reset_password: async (_, { token, newPassword }) => {
      const type = TOKEN_TYPES.PARTNER_USER;
      return resetPasswordByType({ type, token, newPassword });
    },

    system_user_forgot_password: async (_, { email }, { req }) => {
      const language = req.headers['accept-language'];
      const type = TOKEN_TYPES.SYS_USER;
      const tokenData = await createReSetTokenByType({ email, type, language });

      PubSub.emit(ADMIN_FORGOT_PASSWORD, tokenData);
      return { email };
    },

    system_user_reset_password: async (_, { token, newPassword }) => {
      const type = TOKEN_TYPES.SYS_USER;
      return resetPasswordByType({ type, token, newPassword });
    }
  }
};
