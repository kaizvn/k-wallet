import cors from 'cors';

const HOST_ORIGIN = process.env.HOST_ORIGIN || 'localhost';

const whitelistRegExp = new RegExp(`(.*${HOST_ORIGIN}.*)`, 'i');

export const corsOptions = {
  credentials: true,
  origin: whitelistRegExp
};

export default () => cors(corsOptions);
