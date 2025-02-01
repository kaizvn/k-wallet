import { isServer } from './index';
const TIMEZONE_NAME = '_timezone';

export const saveTimezone = timezone =>
  !isServer ? localStorage.setItem(TIMEZONE_NAME, timezone) : null;
export const getTimezone = () =>
  !isServer ? localStorage.getItem(TIMEZONE_NAME) : null;
export const removeTimezone = () =>
  !isServer ? localStorage.removeItem(TIMEZONE_NAME) : null;
