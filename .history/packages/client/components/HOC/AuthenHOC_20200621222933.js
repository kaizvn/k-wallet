import { LoadingComponent } from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isServer } from '@revtech/rev-shared/libs';
import React from 'react';

import {
  currentUserSelector,
  getUser,
  verifyScopeAndRole
} from '../../stores/UserState';
import ServerInfoHOC from './ServerInfoHOC';
import { compose } from 'recompose';

const connectWithRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector
  })
);
const enhance = compose(ServerInfoHOC, connectWithRedux);

export default function withAuth(AuthComponent) {
  class AuthenHOC extends React.Component {
    static getInitialProps = async ctx => {
      return AuthComponent.getInitialProps
        ? AuthComponent.getInitialProps(ctx)
        : {};
    };

    componentDidMount() {
      if (!isServer) {
        this.props.dispatch(getUser());
      }
    }

    render() {
      const { currentUser } = this.props;

      return (
        <div>
          {!verifyScopeAndRole(currentUser) ? (
            <LoadingComponent />
          ) : (
            <AuthComponent {...this.props} isLoggedIn={true} />
          )}
        </div>
      );
    }
  }

  return enhance(AuthenHOC);
}
