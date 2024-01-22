import React from "react";

import Document, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from "next/document";

type Props = DocumentProps & {
  // add custom document props
};

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    let locale = ctx.locale;

    if (ctx.req && ctx.req.headers.cookie) {
      locale = ctx.req.headers.cookie
        .split(";")
        .find((c) => c.trim().startsWith("NEXT_LOCALE="))
        ?.split("=")[1];
    }

    return { ...initialProps, locale };
  }

  render() {
    const currentLocale = this.props.locale;
    const dir = currentLocale === "ar" ? "rtl" : "ltr";

    return (
      <Html
        lang={currentLocale}
        dir={dir}
      >
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
