import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { IS_PRODUCTION, Theme } from '../constants';
import nookies from 'nookies';
import { DARK_MODE_CLASS, THEME_COOKIE_KEY } from '../constants/theme';

class MyDocument extends Document<{ theme?: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    const cookies = nookies.get(ctx);
    const theme = cookies[THEME_COOKIE_KEY];

    return { theme, ...initialProps };
  }

  render() {
    return (
      <Html
        lang="ko"
        {...(this.props.theme === Theme.dark && { className: DARK_MODE_CLASS })}
      >
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}`}
          />
          {IS_PRODUCTION && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
              }}
            />
          )}
        </Head>
        <body className="main-container main-font-color">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
