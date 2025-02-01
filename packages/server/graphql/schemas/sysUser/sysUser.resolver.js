import { path } from 'lodash/fp';

import { APPROVE, BAN, REJECT, UNBAN } from '../../enums/updateStatusAction';
import { SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import { saveSession } from '../../../middlewares/session';
import auth from '../../../authentications';
import { Settings } from '../../../services';

module.exports = {
  SystemUserRole: {
    ADMIN: SYS_ADMIN,
    MOD: SYS_MOD
  },
  UpdateStatusAction: {
    APPROVE: APPROVE,
    REJECT: REJECT,
    BAN: BAN,
    UNBAN: UNBAN
  },
  SystemUser: {
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
    setting: async user => {
      const setting = await Settings.findOne({ owner_id: user.id });
      return setting || {};
    },
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  }
};
