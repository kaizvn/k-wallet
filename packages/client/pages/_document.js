import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheets } from '@material-ui/core';

//theme by user info or server config
const THEME = 'royal-blue';

const getThemeUrl = (themeUI = 'bermuda-gray') =>
  `/static/kosmo/assets/styles/themes/${themeUI}.min.css`;

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
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(ctx);

    initialProps.themeName = THEME || 'bermuda-gray';

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
    const rootProps = this.props;

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
            content="/static/kosmo/assets/img/icon-150.png"
          />
          <meta name="theme-color" content="#fff" />
          <link
            rel="apple-touch-icon"
            href="/static/kosmo/assets/img/icon-192.png"
          />
          <link
            rel="icon"
            type="image/png"
            href="/static/kosmo/assets/img/icon-32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="/static/kosmo/assets/img/icon-16.png"
            sizes="16x16"
          />
          <link
            rel="shortcut icon"
            href="/static/kosmo/assets/img/icon-16.png"
          />
          <link rel="manifest" href="/static/manifest.json" />
          <link
            rel="stylesheet"
            type="text/css"
            href={getThemeUrl(rootProps.themeName)}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/libs/bootstrap/css/bootstrap.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/fonts/line-awesome/css/line-awesome.min.css"
          />

          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/fonts/montserrat/styles.css"
          />

          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/libs/tether/css/tether.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/libs/jscrollpane/jquery.jscrollpane.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/libs/flag-icon-css/css/flag-icon.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/styles/common.css"
          />

          <link
            className="ks-sidebar-dark-style"
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/styles/themes/sidebar-black.min.css"
          />

          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/fonts/kosmo/styles.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/fonts/weather/css/weather-icons.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/libs/c3js/c3.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/styles/widgets/payment.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/styles/widgets/panels.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/kosmo/assets/styles/dashboard/tabbed-sidebar.min.css"
          />

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
        <body className="">
          <div id="mobile-overlay" className="ks-mobile-overlay" />
          <Main {...rootProps} />
          <NextScript />
          <script src="/static/kosmo/libs/jquery/jquery.min.js" />
          <script src="/static/kosmo/libs/popper/popper.min.js" />
          <script src="/static/kosmo/libs/bootstrap/js/bootstrap.min.js" />
          <script src="/static/kosmo/libs/jscrollpane/jquery.jscrollpane.min.js" />
          <script src="/static/kosmo/libs/jscrollpane/jquery.mousewheel.js" />
          <script src="/static/kosmo/libs/flexibility/flexibility.js" />
          <script src="/static/kosmo/libs/velocity/velocity.min.js" />
          <script src="/static/kosmo/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.js" />
          <script src="/static/customs/sc-common.js" />
        </body>
      </html>
    );
  }
}
