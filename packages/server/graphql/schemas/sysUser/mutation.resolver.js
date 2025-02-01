import { combineResolvers } from 'graphql-resolvers';
import uuid from 'uuid';
import i18n from 'i18n';
import { findUser } from '../../../utils';
import { APPROVE, BAN, REJECT, UNBAN } from '../../enums/updateStatusAction';
import { P_OWNER, SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import { P_PENDING } from '../../enums/partnerStatus';
import { PartnerUsers, Partners, SystemUsers, Users } from '../../../services';
import { U_ACTIVE, U_BANNED, U_REJECTED } from '../../enums/userStatus';
import { P_ACTIVE, P_BANNED, P_REJECTED } from '../../enums/partnerStatus';
import { FEMALE, MALE } from '../../enums/userGender';
import { PubSub } from '../../../pubsub';
import {
  PARTNER_APPROVED,
  PARTNER_USER_APPROVED
} from '../../../pubsub/events';

import { checkAuthorization } from '../../libs';

const MASTER_KEY = process.env.MASTER_KEY || 'this is required field!';

module.exports = {
  Mutation: {
    add_moderator: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, args) => {
        const existedModerator = await SystemUsers.findOne({
          $or: [{ email: args.email }, { username: args.username }]
        });

        if (existedModerator) {
          if (existedModerator.status === U_ACTIVE) {
            throw new Error(
              i18n.__('sysUser.mutation.error.action.user.existed')
            );
          }
          if (existedModerator.status === U_BANNED) {
            throw new Error(
              i18n.__('sysUser.mutation.error.action.user.banned')
            );
          }
        }

        const fields = {
          ...args,
          gender: args.title === 'Mr' ? MALE : FEMALE,
          id: uuid(),
          first_name: args.firstName,
          last_name: args.lastName,
          birth_date: args.birthDateString,
          status: U_ACTIVE
        };

        const newModerator = new SystemUsers(fields);
        await newModerator.save();

        return newModerator;
      }
    ),
    add_user: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, args) => {
        const existedUser = await Users.findOne({
          email: args.email
        });

        if (existedUser) {
          if (existedUser.status === U_ACTIVE) {
            throw new Error(
              i18n.__('sysUser.mutation.error.action.user.existed')
            );
          }
          if (existedUser.status === U_BANNED) {
            throw new Error(
              i18n.__('sysUser.mutation.error.action.user.banned')
            );
          }
          if (existedUser.status === U_REJECTED) {
            throw new Error(
              i18n.__('sysUser.mutation.error.action.user.rejected')
            );
          }
        }

        const fields = {
          ...args,
          id: uuid(),
          first_name: args.firstName,
          last_name: args.lastName,
          birth_date: args.birthDateString,
          zip_code: args.zipCode,
          mcc_code: args.mccCode,
          status: U_ACTIVE
        };

        const newUser = new Users(fields);
        await newUser.save();

        //TODO: save code for integration with Diro
        // const date = new moment(args.birthDateString, 'MM/DD/YYYY');
        // const res = await createUserToDiro({
        //   firstname: args.firstName,
        //   lastname: args.lastName,
        //   dob: date.format('YYYY-MM-DD'),
        //   mobile: '098765231',
        //   mcc: '+84'
        // });

        return newUser;
      }
    ),

    register_system_user: async (_, args) => {
      const systemUser = new SystemUsers({
        ...args,
        gender: args.title === 'Mr' ? MALE : FEMALE,
        first_name: args.firstName,
        last_name: args.lastName,
        birth_date: args.birthDateString
      });

      await systemUser.save();

      return systemUser;
    },

    invite_partner: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { email }) => {
        const userId = uuid();
        const pId = uuid();

        const existedUser = await PartnerUsers.findOne({ email });
        if (existedUser) {
          throw new Error(i18n.__('sysUser.mutation.error.existed.email'));
        }

        const temporaryPartnerUser = new PartnerUsers({
          id: userId,
          email,
          partner_id: pId,
          role: P_OWNER,
          status: P_PENDING
        });

        const temporaryPartner = new Partners({
          id: pId,
          email,
          owner_id: userId
        });

        await temporaryPartnerUser.save();
        await temporaryPartner.save();

        return temporaryPartner;
      }
    ),

    update_partner_status: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { id, action }) => {
        let pStatus;
        let uStatus;
        switch (action) {
          case APPROVE:
            pStatus = P_ACTIVE;
            uStatus = U_ACTIVE;
            break;
          case REJECT:
            pStatus = P_REJECTED;
            uStatus = U_REJECTED;
            break;
          case BAN:
            pStatus = P_BANNED;
            uStatus = U_BANNED;
            break;
          case UNBAN:
            pStatus = P_ACTIVE;
            uStatus = U_ACTIVE;
            break;
          default:
            break;
        }

        const partner = await Partners.findOne({ id });
        if (partner) {
          partner.status = pStatus;
          await partner.save();

          if (action === APPROVE) {
            await PartnerUsers.updateOne(
              { id: partner.owner_id },
              { $set: { status: U_ACTIVE } }
            );

            const partnerUser = await PartnerUsers.findOne({
              id: partner.owner_id
            });

            PubSub.emit(PARTNER_APPROVED, partnerUser);
            PubSub.emit(PARTNER_USER_APPROVED, partner);
          }

          if (action === BAN || action === UNBAN) {
            const filterStatus = action === BAN ? U_ACTIVE : U_BANNED;
            const partnerUsers = await PartnerUsers.find({
              partner_id: id,
              status: filterStatus
            });

            await Promise.all(
              partnerUsers.map((user) => {
                user.status = uStatus;
                return user.save();
              })
            );
          }

          return partner;
        }
        throw new Error(
          `${i18n.__('sysUser.mutation.error.not_found.partner_by_id')} ${id}`
        );
      }
    ),

    update_user_status: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { id, action }) => {
        const user =
          (await Users.findOne({ id })) || (await SystemUsers.findOne({ id }));
        if (user) {
          let status;
          switch (action) {
            case APPROVE:
              status = U_ACTIVE;
              break;
            case REJECT:
              if ([SYS_MOD].includes[user.role]) {
                throw new Error(
                  i18n.__('sysUser.mutation.error.can_not_reject')
                );
              }
              status = U_REJECTED;
              break;
            case BAN:
              status = U_BANNED;
              break;
            case UNBAN:
              status = U_ACTIVE;
              break;
            default:
              break;
          }
          user.status = status;
          await user.save();
          return user;
        }
        throw new Error(
          `${i18n.__('sysUser.mutation.error.not_found.user_by_id')} ${id}`
        );
      }
    ),

    change_system_user_password: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      async (_, { currentPassword, newPassword }, { currentUser }) => {
        const sysUser = await findUser(currentUser.id, SystemUsers);
        if (sysUser) {
          if (await sysUser.comparePassword(currentPassword)) {
            sysUser.password = newPassword;
            await sysUser.save();
            return sysUser;
          }
          throw new Error(
            i18n.__('sysUser.mutation.error.incorrect.old_password')
          );
        }
      }
    ),
    change_admin_password: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (
        _,
        { currentPassword, newPassword, secretKey },
        { currentUser }
      ) => {
        if (
          secretKey === MASTER_KEY &&
          (await currentUser.comparePassword(currentPassword))
        ) {
          currentUser.password = newPassword;
          await currentUser.save();
          return true;
        }
        return false;
      }
    )
  }
};
