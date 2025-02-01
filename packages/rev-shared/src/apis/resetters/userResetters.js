import {
  VerifyPasswordAPI,
  GetStateEnable2FAAPI,
  InitSecretKey2FAAPI
} from '../apiCollections/userAPI';
import { getResetter } from '../libs';

export const verifyPasswordAPIResetter = getResetter(VerifyPasswordAPI);
export const getStateEnable2FAAPIResetter = getResetter(GetStateEnable2FAAPI);
export const initSecretKey2FAAPIResetter = getResetter(InitSecretKey2FAAPI);
