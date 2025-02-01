import { respondToSuccess } from '../libs';
import {
  GetPaidPartnerDetailsAPI,
  GetMemberListAPI,
  GetPartnerMemberDetailsAPI
} from '../apiCollections/partnerAPI';

export const getPaidPartnerDetails = ({ id, partnerId }, callback) => {
  return respondToSuccess(
    GetPaidPartnerDetailsAPI.actionCreator({ id, partnerId }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
};

export const getMemberList = (partnerId, callback) =>
  respondToSuccess(
    GetMemberListAPI.actionCreator({ partnerId }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );

export const getPartnerMemberDetails = (id, callback) =>
  respondToSuccess(
    GetPartnerMemberDetailsAPI.actionCreator({ id }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
