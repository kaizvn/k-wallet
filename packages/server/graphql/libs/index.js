import { ForbiddenError } from 'apollo-server-express';
import { filter } from 'lodash/fp';
import { skip } from 'graphql-resolvers';

import { P_MEM, P_OWNER, SYS_ADMIN, SYS_MOD, USER } from '../enums/userRoles';
import { PartnerUsers } from '../../services';

const validItems = rejectRoles => filter(role => !rejectRoles.includes(role));

export const checkAuthentication = (parent, args, { currentUser }) =>
  currentUser ? skip : new ForbiddenError('Not authenticated as user.');

export const checkAuthorization = (allowRoles = USER, rejectRoles = []) => (
  parent,
  args,
  { currentUser }
) => {
  if (!currentUser) {
    new Error('not authorized to do action.');
  }
  let allows = [];

  if (allowRoles === undefined || typeof allowRoles === 'number') {
    switch (allowRoles) {
      case USER:
        allows.push(USER);
      // falls through
      case P_MEM:
        allows.push(P_MEM);
      // falls through
      case P_OWNER:
        allows.push(P_OWNER);
      // falls through
      case SYS_MOD:
        allows.push(SYS_MOD);
      // falls through
      case SYS_ADMIN:
        allows.push(SYS_ADMIN);
        break;
      default:
        throw new Error('not authorized to do action.');
    }
  } else {
    allows = allowRoles;
  }

  if (rejectRoles && rejectRoles.length) {
    allows = validItems(rejectRoles)(allows);
  }

  return !allows.length || allows.includes(currentUser.role)
    ? skip
    : new Error('not authorized to do action.');
};

export const checkTruePartnerOwnerOfMemberId = async (
  _,
  { id },
  { currentUser }
) => {
  if (currentUser.role === P_OWNER) {
    const member = await PartnerUsers.findOne({
      id,
      partner_id: currentUser.partner_id
    });

    if (!member) {
      throw new Error('not authorized to do action.');
    }
  }

  return skip;
};

export const checkTruePartnerOwnerOfPartnerId = async (
  _,
  { partnerId },
  { currentUser }
) => {
  if (
    partnerId &&
    currentUser.role === P_OWNER &&
    currentUser.partner_id !== partnerId
  ) {
    throw new Error('not authorized to do action.');
  }

  return skip;
};
