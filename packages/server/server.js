import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';

import { sessionMiddlewares, expressJWT } from './middlewares';
import apis from './routes/apis';
import i18n from './i18n';
import passport from './passport.config';
import webhooks from './routes/webhook';
const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({ type: 'application/json', extended: true, limit: '5mb' })
);
app.use(bodyParser.text({ type: 'application/graphql' }));
app.use(logger('combined'));
app.use(sessionMiddlewares());
app.use(cookieParser());
app.use(expressJWT());
app.use(passport.initialize());
app.use(passport.session());
app.use(i18n);
app.use(webhooks);
app.use(apis);
app.use(function (err, req, res, next) {
  //todo: handle error below, try catch api with catch(e) { next(e) }
  if (err) {
    switch (err.name) {
      case 'GraphQLError': {
        // handle later
        return next();
      }
      case 'UnauthorizedError': {
        console.error('error:', err);
        return next(err);
      }
      default: {
        console.error('error:', err);
        return res.status(503).send('Server Error');
      }
    }
  } else {
    next();
  }
});

module.exports = app;
