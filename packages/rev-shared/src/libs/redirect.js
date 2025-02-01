import { isServer } from '@revtech/rev-shared/libs';
import Router from 'next/router';

export default (res, path) => {
  if (isServer) {
    return;
  }

  if (res) {
    res.writeHead(302, {
      Location: path
    });
    res.end();
    return {};
  }

  Router.replace(path);
};
