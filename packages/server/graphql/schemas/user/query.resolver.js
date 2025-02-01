import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';
import { findUser } from '../../../utils';
import { P_MEM, P_OWNER, SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import { SystemUsers, Users, PartnerUsers } from '../../../services';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { sortDefaultOptions } from '../../libs/options';
import speakeasy from 'speakeasy';

module.exports = {
  Query: {
    login_normal_user: async (_, { username, password, authCode }) => {
      username = username.toLowerCase();

      const user = await Users.findOne({ username });
      const twoFactorEnabled = (user || {}).two_factor_enabled;

      const userWith2FA = {
        isLoginBy2FA: false
      };

      if (!user) throw new Error(i18n.__('user.query.error.incorrect.login'));

      if (await user.comparePassword(password)) {
        userWith2FA.user = user;
        if (twoFactorEnabled) {
          userWith2FA.isLoginBy2FA = true;

          if (!authCode) {
            userWith2FA.user = null;
          } else {
            const isVerify = speakeasy.totp.verify({
              secret: user.two_factor_secret,
              encoding: 'base32',
              token: authCode
            });
            if (!isVerify)
              throw new Error(
                i18n.__('user.mutation.error.incorrect.authen_code')
              );
          }
        }

        return userWith2FA;
      } else {
        throw new Error(i18n.__('user.query.error.incorrect.login'));
      }
    },
    get_normal_users: combineResolvers(checkAuthorization([SYS_ADMIN]), () => {
      return Users.find().sort(sortDefaultOptions);
    }),
    get_normal_user: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      (_, { id }) => Users.findOne({ id })
    ),
    me: combineResolvers(checkAuthentication, (_, __, { currentUser }) => {
      switch (currentUser.role) {
        case SYS_ADMIN:
        case SYS_MOD:
          return SystemUsers.findOne({ id: currentUser.id });

        case P_OWNER:
        case P_MEM:
          return PartnerUsers.findOne({ id: currentUser.id });

        default:
          return Users.findOne({ id: currentUser.id });
      }
    }),
    get_received_user: combineResolvers(
      checkAuthentication,
      (_, { username }) => findUser({ username })
    ),
    get_state_enable_2FA: combineResolvers(
      checkAuthentication,
      async (_, __, { currentUser }) => {
        const user = await findUser(currentUser.id);
        return user.two_factor_enabled;
      }
    ),
    verify_auth_code_2FA: combineResolvers(
      checkAuthentication,
      async (_, { authCode }, { currentUser }) => {
        let user = await findUser(currentUser.id);
        const isVerify = speakeasy.totp.verify({
          secret: user.two_factor_secret,
          encoding: 'base32',
          token: authCode
        });

        if (isVerify) return isVerify;

        throw new Error(i18n.__('user.mutation.error.incorrect.authen_code'));
      }
    )
  }
};
