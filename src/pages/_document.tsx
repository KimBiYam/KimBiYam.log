import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import GoogleAnalytics from '../components/scripts/GoogleAnalytics';
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
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <script src="/theme.js" />
          <script src="/setViewportProperty.js" />
          {IS_PRODUCTION && <GoogleAnalytics />}
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
