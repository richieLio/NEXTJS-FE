// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <Script src="https://cdn.stringee.com/sdk/web/latest/stringee-web-sdk.min.js" strategy="beforeInteractive" />
          <Script src="/js/jquery-3.2.1.min.js" strategy="beforeInteractive" />
          <Script src="/js/latest.sdk.bundle.min.js" strategy="beforeInteractive" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
