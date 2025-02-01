import React from 'react';

import HeaderComponent from '../components/HeaderComponent';
import Head from 'next/head';

class HomePageLayout extends React.Component {
  render() {
    const {
      children,
      isLoggedIn,
      title,
      subTitle,
      fetchData,
      ...restProps
    } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>RevPayment</title>
        </Head>
        <HeaderComponent isLoggedIn={false} {...restProps} />
        {children}
      </React.Fragment>
    );
  }
}

export default HomePageLayout;
