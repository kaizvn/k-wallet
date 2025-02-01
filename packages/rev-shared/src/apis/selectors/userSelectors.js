import { flow, get } from 'lodash/fp';
import { createErrorSelector } from '../libs';
import {
  CheckTokenResetPasswordAPI,
  GetReceivedUserDetailsAPI,
  VerifyPasswordAPI,
  InitSecretKey2FAAPI,
  VerifyAuthCode2FAAPI,
  GetStateEnable2FAAPI
} from '../apiCollections/userAPI';

export const checkTokenResetPasswordErrorMessageSelector = createErrorSelector(
  CheckTokenResetPasswordAPI
);

export const getReceivedUserDetailsSelector = flow(
  GetReceivedUserDetailsAPI.dataSelector,
  get('data.get_received_user')
);

export const verifyPasswordSelector = flow(
  VerifyPasswordAPI.dataSelector,
  get('data.verify_password')
);

export const verifyPasswordErrorMessageSelector = createErrorSelector(
  VerifyPasswordAPI
);

export const initSecretKey2FASelector = flow(
  InitSecretKey2FAAPI.dataSelector,
  get('data.generate_secret_key_2FA')
);

export const verifyAuthCode2FAErrorMessageSelector = createErrorSelector(
  VerifyAuthCode2FAAPI
);

export const getStateEnable2FASelector = flow(
  GetStateEnable2FAAPI.dataSelector,
  get('data.get_state_enable_2FA')
);
