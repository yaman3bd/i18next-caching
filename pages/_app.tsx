import type { AppProps } from "next/app";

import { appWithTranslation } from "next-i18next";
import { Provider as ReduxProvider } from "react-redux";

import i18nextConfig from "@/next-i18next.config.js";
import { storeWrapper } from "@/store";
import "@/styles/globals.css";

function App({ Component, pageProps: { session, ...rest } }: AppProps) {
  const { store, props } = storeWrapper.useWrappedStore(rest);
  const { _apiError, ...pageProps } = props;

  return (
    <ReduxProvider store={store}>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}

export default appWithTranslation(App, i18nextConfig);
