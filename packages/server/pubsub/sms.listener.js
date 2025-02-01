import { SMS } from '../services';
import { createListenerCallback } from './utils';

const SEND_REGISTERED_SMS = 'Send SMS to registered User';

export const sendRegisteredSMS = createListenerCallback(
  SEND_REGISTERED_SMS,
  async (user, language) => {
    await SMS.sendSMS(user, language);
  }
);
