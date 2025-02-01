import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheets } from '@material-ui/core';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement()
      ]
    };
  }

  render() {
    return (
      <html>
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="RevPayment" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="#466bde"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="QR Scanner" />
          <meta name="msapplication-TileColor" content="#466bde" />
          <meta
            name="msapplication-TileImage"
            content="/static/assets/img/icon-150.png"
          />
          <meta name="theme-color" content="#fff" />
          <link rel="shortcut icon" href="/static/assets/img/icon-150.png" />
          <link rel="manifest" href="/static/manifest.json" />

          <link
            rel="stylesheet"
            type="text/css"
            href="/static/customs/styles.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/customs/nprogress.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/customs/ReactToastify.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
