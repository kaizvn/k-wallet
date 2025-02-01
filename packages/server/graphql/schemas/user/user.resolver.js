import { path } from 'lodash/fp';

import { FEMALE, MALE } from '../../enums/userGender';
import { P_MEM, P_OWNER, SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import {
  U_ACTIVE,
  U_BANNED,
  U_CANCELLED,
  U_PENDING,
  U_REJECTED
} from '../../enums/userStatus';
import { saveSession } from '../../../middlewares/session';
import auth from '../../../authentications';
import { Settings } from '../../../services';

module.exports = {
  UserStatus: {
    REJECTED: U_REJECTED,
    PENDING: U_PENDING,
    ACTIVE: U_ACTIVE,
    BANNED: U_BANNED,
    CANCELLED: U_CANCELLED
  },

  Gender: {
    FEMALE,
    MALE
  },

  User: {
    fullName: user =>
      user.first_name && user.last_name
        ? user.first_name + ' ' + user.last_name
        : user.email,
    firstName: path('first_name'),
    lastName: path('last_name'),
    birthDate: path('birth_date'),
    birthDay: user => new Date(user.birth_date).getDate(),
    birthMonth: user => new Date(user.birth_date).getMonth() + 1,
    birthYear: user => new Date(user.birth_date).getFullYear(),
    age: user =>
      new Date().getFullYear() - new Date(user.birth_date).getFullYear(),
    token: (user, _, { req }) => {
      const jwt = auth.sign(user);
      saveSession(req.session, jwt);

      return 'bearer ' + jwt;
    },
    mccCode: path('mcc_code'),
    setting: async user => {
      const setting = await Settings.findOne({ owner_id: user.id });
      return setting || {};
    },
    createdAt: path('created_at'),
    updatedAt: path('updated_at'),
    twoFactorEnabled: path('two_factor_enabled')
  },
  MeResult: {
    __resolveType: user => {
      switch (user.role) {
        case SYS_ADMIN:
        case SYS_MOD:
          return 'SystemUser';

        case P_OWNER:
        case P_MEM:
          return 'PartnerUser';

        default:
          return 'User';
      }
    }
  },

  ReceivedUser: {
    fullName: user =>
      user.first_name &&
      user.last_name &&
      user.first_name + ' ' + user.last_name
  }
};
