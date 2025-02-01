import { combineResolvers } from 'graphql-resolvers';
import uuid from 'uuid';
import i18n from 'i18n';
import { findPartner, findUser } from '../../../utils';
import { APPROVE, BAN, REJECT, UNBAN } from '../../enums/updateStatusAction';
import { FEMALE, MALE } from '../../enums/userGender';
import {
  P_ACTIVE,
  P_PENDING,
  P_REJECTED,
  P_SUSPENDED
} from '../../enums/partnerStatus';
import { P_MEM, P_OWNER } from '../../enums/userRoles';
import { PartnerUsers, Partners } from '../../../services';
import { PubSub } from '../../../pubsub';
import {
  PARTNER_MEMBER_CREATED,
  PARTNER_CREATED,
  MEMBER_CREATED
} from '../../../pubsub/events';

import {
  U_ACTIVE,
  U_BANNED,
  U_REJECTED,
  U_CANCELLED
} from '../../enums/userStatus';
import {
  checkAuthorization,
  checkTruePartnerOwnerOfPartnerId
} from '../../libs';

module.exports = {
  Mutation: {
    register_partner_member: async (
      _,
      {
        id,
        username,
        password,
        title,
        firstName,
        lastName,
        partnerId,
        birthDateString,
        email,
        phone,
        mccCode,
        identity
      },
      { req }
    ) => {
      const language = req.headers['accept-language'];
      const birthday = new Date(birthDateString);

      if (isNaN(birthday.getTime())) {
        throw new Error(
          i18n.__(
            'partnerUser.mutation.error.incorrect.register_partner_member.birthdate'
          )
        );
      }

      const existedUser = await PartnerUsers.findOne({ id });

      if (existedUser && existedUser.email !== email) {
        throw new Error(
          i18n.__(
            'partnerUser.mutation.error.incorrect.register_partner_member.email'
          )
        );
      }

      const existedPartner = await Partners.findOne({
        id: existedUser.partner_id,
        status: { $nin: [P_SUSPENDED, P_REJECTED] }
      });

      PubSub.emit(PARTNER_MEMBER_CREATED, existedUser);

      if (!existedPartner) {
        throw new Error(
          i18n.__(
            'partnerUser.mutation.error.not_exist.register_partner_member.partner'
          )
        );
      }

      existedUser.updateDoc({
        status: U_ACTIVE,
        username,
        password,
        title,
        gender: title === 'Mr' ? MALE : FEMALE,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDateString,
        mcc_code: mccCode,
        email,
        phone,
        identity,
        partner_id: partnerId
      });

      await existedUser.save();
      PubSub.emit(MEMBER_CREATED, existedPartner, existedUser, language);

      return existedUser;
    },
    register_partner_user: async (
      _,
      {
        id,
        username,
        password,
        title,
        firstName,
        lastName,
        birthDateString,
        email,
        phone,
        mccCode,
        identity,
        partnerId,
        partnerName,
        partnerPhone,
        partnerEmail,
        partnerAddress
      },
      { req }
    ) => {
      const language = req.headers['accept-language'];
      const birthday = new Date(birthDateString);

      if (isNaN(birthday.getTime())) {
        throw new Error(
          i18n.__(
            'partnerUser.mutation.error.incorrect.register_partner_user.birthdate'
          )
        );
      }

      email = email.toLowerCase();
      username = username.toLowerCase();
      partnerId = partnerId ? partnerId.toLowerCase() : null;

      if (!id) {
        if (!partnerId) {
          throw new Error(
            i18n.__('partnerUser.mutation.error.missing_param.partner_id')
          );
        }

        const existedUser = await PartnerUsers.findOne({
          $or: [{ email }, { username }]
        });

        if (existedUser) {
          if (existedUser.email === email) {
            throw new Error(
              i18n.__(
                'partnerUser.mutation.error.existed.register_partner_user.email'
              )
            );
          } else {
            throw new Error(
              i18n.__(
                'partnerUser.mutation.error.existed.register_partner_user.username'
              )
            );
          }
        }

        const existedPartner = await Partners.findOne({
          partner_id: partnerId
        });

        if (existedPartner) {
          throw new Error(
            i18n.__(
              'partnerUser.mutation.error.existed.register_partner_user.partner_id'
            )
          );
        }

        const newUId = uuid();
        const newPid = uuid();

        const pUser = new PartnerUsers({
          id: newUId,
          username,
          password,
          title,
          gender: title === 'Mr' ? MALE : FEMALE,
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDateString,
          email,
          phone,
          identity,
          mcc_code: mccCode,
          partner_id: newPid,
          role: P_OWNER
        });

        const newPartner = new Partners({
          id: newPid,
          name: partnerName,
          phone: partnerPhone,
          email: partnerEmail,
          address: partnerAddress,
          partner_id: partnerId,
          owner_id: pUser.id
        });

        await newPartner.save();
        await pUser.save();
        await PubSub.emit(PARTNER_CREATED, newPartner, language);

        return pUser;
      } else {
        const existedUser = await PartnerUsers.findOne({ id });

        //todo : refactor this: register submit partner user id to validate
        if (!existedUser || existedUser.role !== P_OWNER) {
          throw new Error(
            i18n.__(
              'partnerUser.mutation.error.incorrect.register_partner_user.account'
            )
          );
        }

        if (existedUser.email !== email) {
          throw new Error(
            i18n.__(
              'partnerUser.mutation.error.not_exist.register_partner_user.email'
            )
          );
        }

        const existedPartner = await Partners.findOne({
          id: existedUser.partner_id,
          status: { $nin: [P_SUSPENDED, P_REJECTED] }
        });

        if (!existedPartner) {
          throw new Error(
            i18n.__(
              'partnerUser.mutation.error.not_exist.register_partner_user.partner'
            )
          );
        }

        // accept invitation to be OWNER
        existedUser.updateDoc({
          status: U_ACTIVE,
          username,
          password,
          title,
          gender: title === 'Mr' ? MALE : FEMALE,
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDateString,
          email,
          phone,
          identity,
          mcc_code: mccCode
        });

        existedPartner.updateDoc({
          partner_id: partnerId,
          name: partnerName,
          phone: partnerPhone,
          email: partnerEmail,
          address: partnerAddress,
          status: P_ACTIVE,
          owner_id: existedUser.id
        });

        await existedUser.save();
        await existedPartner.save();
        PubSub.emit(PARTNER_CREATED, existedPartner, language);

        return existedUser;
      }
    },

    invite_member: combineResolvers(
      checkAuthorization([P_OWNER]),
      async (_, { email }, { currentUser }) => {
        const partnerOwner = await findUser(currentUser.id, PartnerUsers);

        const partner = await findPartner(partnerOwner.partner_id);

        if (!partner) {
          throw new Error(
            i18n.__(
              'partnerUser.mutation.error.not_exist.invite_member.partner'
            )
          );
        }

        const existedUser = await PartnerUsers.findOne({
          email,
          partner_id: partnerOwner.partner_id
        });

        if (existedUser) {
          throw new Error(
            i18n.__('partnerUser.mutation.error.existed.invite_member.user')
          );
        }

        const temporaryUser = new PartnerUsers({
          id: uuid(),
          email,
          partner_id: partnerOwner.partner_id,
          type: P_MEM,
          status: P_PENDING
        });

        await temporaryUser.save();
        await partner.save();
        return temporaryUser;
      }
    ),

    update_member_status: combineResolvers(
      checkAuthorization([P_OWNER]),
      checkTruePartnerOwnerOfPartnerId,
      async (_, { id, action }) => {
        let status;
        switch (action) {
          case APPROVE:
            status = U_ACTIVE;
            break;
          case REJECT:
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

        const member = await PartnerUsers.findOne({ id });
        if (member) {
          member.status = status;
          await member.save();
          return member;
        }
        throw new Error(
          `${i18n.__('partnerUser.mutation.error.not_found.user')} ${id}`
        );
      }
    ),
    cancel_member_invitation: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { id }) => {
        const partnerMember = await PartnerUsers.findOne({ id });

        if (!partnerMember) {
          throw new Error(
            i18n.__('partnerUser.mutation.error.not_found.member')
          );
        }

        partnerMember.status = U_CANCELLED;

        await partnerMember.save();

        return partnerMember;
      }
    ),

    change_partner_password: combineResolvers(
      checkAuthorization([P_OWNER, P_MEM]),
      async (_, { currentPassword, newPassword }, { currentUser }) => {
        const user = await findUser(currentUser.id, PartnerUsers);
        if (user) {
          if (await user.comparePassword(currentPassword)) {
            user.password = newPassword;
            await user.save();
            return user;
          }
          throw new Error(
            i18n.__('partnerUser.mutation.error.incorrect.old_password')
          );
        }
      }
    )
  }
};
