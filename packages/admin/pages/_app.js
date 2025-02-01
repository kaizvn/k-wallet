import { Provider } from 'react-redux';
import { appWithTranslation } from '@revtech/rev-shared/i18n';
import { toast } from 'react-toastify';
import App from 'next/app';
import React from 'react';
import withRedux from 'next-redux-wrapper';

import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import initializeStore from '../stores/store';

import { LocalizationProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

library.add(fab, fas);
toast.configure();

class ReduxApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <LocalizationProvider dateAdapter={MomentUtils}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </LocalizationProvider>
    );
  }
}

export default withRedux(initializeStore)(appWithTranslation(ReduxApp));
