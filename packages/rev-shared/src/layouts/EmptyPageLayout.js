import React, { useEffect } from 'react';

import { isServer } from '../libs';
import Head from 'next/head';

const EmptyPageLayout = ({ background, children, title }) => {
  useEffect(() => {
    if (!isServer) {
      const body = document.querySelector('body');
      if (background) {
        body.style['background'] = `url(/static/bg/${background}.jpg)`;
        body.style['background-position'] = 'center';
        body.style['background-repeat'] = 'no-repeat';
        body.style['background-size'] = 'cover';
        body.style['height'] = '100%';
      }
    }
    return () => {
      const body = document.querySelector('body');

      if (background) {
        body.removeAttribute('style');
      }
    };
  }, [background]);
  return (
    <div>
      <Head>
        <title>{!!title ? title + ' | RevPayment' : 'RevPayment'}</title>
      </Head>
      {children}
    </div>
  );
};

export default EmptyPageLayout;
