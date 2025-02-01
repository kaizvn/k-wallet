import { path } from 'lodash/fp';

import { P_MEM, P_OWNER } from '../../enums/userRoles';
import { saveSession } from '../../../middlewares/session';
import auth from '../../../authentications';
import { Partners, Settings } from '../../../services';

module.exports = {
  PartnerUserRole: {
    OWNER: P_OWNER,
    MEMBER: P_MEM
  },
  PartnerUser: {
    fullName: user =>
      user.first_name && user.last_name
        ? user.first_name + ' ' + user.last_name
        : user.email,
    username: user => user.username || user.email,
    firstName: path('first_name'),
    lastName: path('last_name'),
    birthDate: path('birth_date'),
    mccCode: path('mcc_code'),
    birthDay: user => new Date(user.birth_date).getDate(),
    birthMonth: user => new Date(user.birth_date).getMonth() + 1,
    birthYear: user => new Date(user.birth_date).getFullYear(),
    age: user =>
      new Date().getFullYear() - new Date(user.birth_date).getFullYear(),
    partner: user => Partners.findOne({ id: user.partner_id }),
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
