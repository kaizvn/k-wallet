import { combineResolvers } from 'graphql-resolvers';

import { Transporter } from '../../../services';
import { SYS_MOD, SYS_ADMIN } from '../../enums/userRoles';
import { checkAuthorization } from '../../libs';
const FROM_EMAIL = 'info@revpayment.io';

export default {
  Mutation: {
    send_mail: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      async (_, { to, from = FROM_EMAIL, subject, html }) => {
        const mail = {
          to: to,
          from: from,
          subject: subject,
          html: html
        };
        await Transporter.sendMail(mail);
        return mail;
      }
    )
  }
};
