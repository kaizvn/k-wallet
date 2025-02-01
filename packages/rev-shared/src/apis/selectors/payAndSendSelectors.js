import { flow, path, get } from 'lodash/fp';
import {
  SendToUserAPI,
  PayToPartnerAPI,
  PayHeiauAPI
} from '../apiCollections/payAndSendAPI';
import { createErrorSelector } from '../libs';

export const sendToUserErrorSelector = createErrorSelector(SendToUserAPI);

export const sendToUserSuccessSelector = flow(
  SendToUserAPI.dataSelector,
  path('data.send')
);

export const payToPartnerErrorSelector = createErrorSelector(PayToPartnerAPI);

export const payToPartnerSuccessSelector = flow(
  PayToPartnerAPI.dataSelector,
  path('data.pay')
);

export const payHeiauResultSelector = flow(
  PayHeiauAPI.dataSelector,
  get('data.pay_heiau.id')
);

export const payHeiauErrorSelector = createErrorSelector(PayHeiauAPI);
