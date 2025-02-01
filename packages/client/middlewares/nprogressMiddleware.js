import { ACTIONS } from 'redux-api-call';
import { isServer } from '@revtech/rev-shared/libs';
import NProgress from 'nprogress';
import Router from 'next/router';

const nprogressMiddleware = () => {
  //set variable to count number of calling API;
  let callingAPIs = 0;

  const startProgress = path => {
    if (path && path === Router.route) {
      return;
    }
    NProgress.start();
    callingAPIs++;
  };

  const stopProgress = () => {
    callingAPIs--;
    if (callingAPIs <= 0) {
      NProgress.done();
      callingAPIs = 0;
    }
  };

  if (!isServer) {
    Router.events.on('routeChangeStart', startProgress);
    Router.events.on('routeChangeComplete', stopProgress);
    Router.events.on('routeChangeError', stopProgress);
  }

  return next => action => {
    if (!isServer) {
      if (action.type === ACTIONS.START) {
        startProgress();
      }

      if (action.type === ACTIONS.COMPLETE || action.type === ACTIONS.FAILURE) {
        stopProgress();
      }
    }

    return next(action);
  };
};

export default nprogressMiddleware;
