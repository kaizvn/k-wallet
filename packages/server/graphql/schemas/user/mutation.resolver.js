import { combineResolvers } from 'graphql-resolvers';
import { pickBy, identity } from 'lodash';
import { USER_CREATED } from '../../../pubsub/events';
import { findUser, findUsersOfPartner } from '../../../utils';
import { PubSub } from '../../../pubsub';
import { FEMALE, MALE } from '../../enums/userGender';
import {
  P_MEM,
  P_OWNER,
  SYS_ADMIN,
  SYS_MOD,
  USER
} from '../../enums/userRoles';
import { SystemUsers, Users, PartnerUsers } from '../../../services';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { formatMccCode, formatPhone } from '../../libs/formatter';
import i18n from 'i18n';
import speakeasy from 'speakeasy';

module.exports = {
  Mutation: {
    register_normal_user: async (_, { username, email, ...args }, { req }) => {
      const language = req.headers['accept-language'];
      const mccCode = formatMccCode(args.mccCode);
      const mobile = formatPhone(args.phone);

      const existedUser = await Users.findOne({
        $or: [
          { username },
          { email },
          {
            mcc_code: mccCode,
            phone: mobile
          }
        ]
      });

      if (existedUser) {
        if (existedUser.email === email) {
          throw new Error(i18n.__('user.mutation.error.existed.email'));
        } else if (existedUser.username === username) {
          throw new Error(i18n.__('user.mutation.error.existed.username'));
        } else {
          throw new Error(i18n.__('user.mutation.error.existed.phone_number'));
        }
      }

      const user = new Users({
        ...args,
        username,
        email,
        gender: args.title === 'Mr' ? MALE : FEMALE,
        first_name: args.firstName,
        last_name: args.lastName,
        birth_date: args.birthDateString,
        mcc_code: mccCode,
        phone: mobile
      });

      await user.save();

      PubSub.emit(USER_CREATED, user, language);
      return user;
    },

    edit_my_info: combineResolvers(
      checkAuthentication,
      async (_, args, { currentUser }) => {
        if (currentUser.role !== SYS_ADMIN && currentUser.role !== SYS_MOD) {
          const birthDate = new Date(args.birthDateString);
          if (isNaN(birthDate.getDate())) {
            throw new Error(i18n.__('user.mutation.error.incorrect.birthdate'));
          }
        }
        const fields = {
          ...args,
          first_name: args.firstName,
          last_name: args.lastName,
          birth_date: args.birthDateString,
          mcc_code: args.mccCode
        };

        const verifiedArgs = pickBy(fields, identity);
        let me;

        switch (currentUser.role) {
          case SYS_ADMIN:
          case SYS_MOD:
            me = await findUser(currentUser.id, SystemUsers);
            break;

          case P_OWNER:
          case P_MEM:
            me = await findUser(currentUser.id, PartnerUsers);
            break;

          default:
            me = await findUser(currentUser.id);
        }

        await me.updateDoc(verifiedArgs).save();
        return me;
      }
    ),

    change_user_password: combineResolvers(
      checkAuthorization([USER]),
      async (_, { currentPassword, newPassword }, { currentUser }) => {
        const user = await findUser(currentUser.id);
        if (user) {
          if (await user.comparePassword(currentPassword)) {
            user.password = newPassword;
            await user.save();
            return user;
          }
          throw new Error(
            i18n.__('user.mutation.error.incorrect.old_password')
          );
        }
      }
    ),
    verify_password: combineResolvers(
      checkAuthentication,
      async (_, { password }, { currentUser }) => {
        let me;
        switch (currentUser.role) {
          case SYS_ADMIN:
          case SYS_MOD: {
            me = await findUser(currentUser.id, SystemUsers);
            break;
          }
          case P_OWNER:
          case P_MEM: {
            me = await findUsersOfPartner(currentUser.id);
            break;
          }
          default: {
            me = await findUser(currentUser.id);
            break;
          }
        }

        if (await me.comparePassword(password)) return true;

        throw new Error(i18n.__('user.mutation.error.incorrect.password'));
      }
    ),
    update_password_user: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { id, newPassword }) => {
        let user = await findUser(id);
        if (user) {
          user.password = newPassword;
          await user.save();
          return user;
        }

        throw new Error(i18n.__('user.mutation.error.not_found.user'));
      }
    ),
    generate_secret_key_2FA: combineResolvers(
      checkAuthentication,
      async (_, __, { currentUser }) => {
        const secret = speakeasy.generateSecret({
          name: `RevPayment (${currentUser.email})`
        });

        let user = await findUser(currentUser.id);
        user.two_factor_secret = secret.base32;

        await user.save();

        return secret.otpauth_url;
      }
    ),
    set_state_enable_2FA: combineResolvers(
      checkAuthentication,
      async (_, { isEnable }, { currentUser }) => {
        let user = await findUser(currentUser.id);

        user.two_factor_enabled = isEnable;
        await user.save();

        return user;
      }
    )
  }
};
