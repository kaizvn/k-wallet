import { Diro } from '../services';
import { createListenerCallback } from './utils';

const CREATE_USER = 'Create Diro user';

export const createDiroUser = createListenerCallback(
  CREATE_USER,
  async user => {
    await Diro.createUserToDiro(user);
  }
);
