import { SYS_ADMIN } from '../graphql/enums/userRoles';
import SystemUsers from '../models/systemUser';

const DEFAULT_TRANSFER_LIMIT_PER_DAY =
  process.env.DEFAULT_TRANSFER_LIMIT_PER_DAY || 10;

export const getGeneralTransferLimit = async () =>
  SystemUsers.findOne({ role: SYS_ADMIN }, { setting: 1 }).then(data =>
    data.setting
      ? data.setting.limit_transfer || DEFAULT_TRANSFER_LIMIT_PER_DAY
      : DEFAULT_TRANSFER_LIMIT_PER_DAY
  );

export default SystemUsers;
