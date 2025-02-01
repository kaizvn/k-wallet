import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import { getServerInfo, getServerInfoSelector } from '../../stores/initState';
import { isServer } from '@revtech/rev-shared/utils';
import { MaintainComponent } from '@revtech/rev-shared/components';

const connectWithRedux = connect(
  createStructuredSelector({
    serverInfo: getServerInfoSelector
  })
);

export default function withAuth(WrappedComponent) {
  class ServerInfoHOC extends React.Component {
    static getInitialProps = async (ctx) => {
      return WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx)
        : {};
    };

    componentDidMount() {
      if (!isServer) {
        this.props.dispatch(getServerInfo());
      }
    }

    render() {
      const { serverInfo } = this.props;

      if (serverInfo && serverInfo.serverStatus === false) {
        return <MaintainComponent message={serverInfo.maintenanceMessage} />;
      }

      return <WrappedComponent {...this.props} serverInfo={serverInfo} />;
    }
  }

  return connectWithRedux(ServerInfoHOC);
}
