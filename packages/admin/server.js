const express = require('express');
const next = require('next');

const { nextI18NextMiddleware } = require('@revtech/rev-shared/i18n');
const nextI18next = require('@revtech/rev-shared/i18n').default;

const environment = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: 'env/.env'
});

const port = parseInt(process.env.NODE_PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log('environment: ', environment);
    console.log(`> Ready on http://localhost:${port}`);
  });
});
