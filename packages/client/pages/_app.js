import { Provider } from 'react-redux';
import { appWithTranslation } from '@revtech/rev-shared/i18n';
import { isServer } from '@revtech/rev-shared/libs';
import { compose } from 'recompose';
import { toast } from 'react-toastify';
import App from 'next/app';
import React, { Fragment } from 'react';
import withRedux from 'next-redux-wrapper';

import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import { WINDOW_RESIZE } from '../stores/NavigationState';
import initializeStore from '../stores/store';

library.add(fab, fas);
toast.configure();

const enhance = compose(withRedux(initializeStore), appWithTranslation);
class ReduxApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  componentDidMount() {
    const props = this.props;
    const action = {
      type: WINDOW_RESIZE
    };

    if (!isServer && typeof window !== 'undefined') {
      window &&
        window.addEventListener('resize', () => {
          props.store.dispatch({ ...action, payload: window.innerWidth });
        });

      props.store.dispatch({ ...action, payload: window.innerWidth });
    }
  }

  componentWillUnmount() {
    if (!isServer && typeof window !== 'undefined') {
      window.removeEventListener('resize', () => {});
    }
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Fragment>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Fragment>
    );
  }
}

export default enhance(ReduxApp);
