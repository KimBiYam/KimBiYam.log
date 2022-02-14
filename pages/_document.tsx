import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import GoogleAnalytics from '../components/scripts/GoogleAnalytics';
import GTag from '../components/scripts/GTag';
import { IS_PRODUCTION } from '../constants';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ko">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
            rel="stylesheet"
          />
          {IS_PRODUCTION && (
            <>
              <GoogleAnalytics />
              <GTag />
            </>
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
