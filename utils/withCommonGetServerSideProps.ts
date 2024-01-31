import { GetServerSidePropsContext } from "next";
import { GetServerSidePropsResult } from "next/types";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import i18nextConfig from "@/next-i18next.config.js";
import { AppStore, storeWrapper } from "@/store";
import { fetchTenant, getRunningTenantQueries } from "@/store/slices/api/tenantSlice";
import { setTenantHost } from "@/store/slices/app-slice";
import { getQueryErrors } from "@/utils";

interface ExtendedGetServerSidePropsContext extends GetServerSidePropsContext {
  store: AppStore;
  host: string;
}

export function withCommonGetServerSideProps(
  namespaces: string[],
  host: string,
  getServerSidePropsFunc?: (
    context: ExtendedGetServerSidePropsContext
  ) => GetServerSidePropsResult<any> | Promise<GetServerSidePropsResult<any>>
) {
  return storeWrapper.getServerSideProps((store) => async (context) => {
    const { res, locale } = context;

    store.dispatch(setTenantHost(host));
    store.dispatch(fetchTenant.initiate());
    await Promise.all(store.dispatch(getRunningTenantQueries()));

    const errors = getQueryErrors(fetchTenant, store);

    if (errors) {
      return errors;
    }

    const tenant = fetchTenant.select()(store.getState())?.data;

    if (!tenant) {
      return {
        notFound: true
      };
    }

    const tenant_locale = tenant?.locale;
    const appLocale = tenant_locale ?? locale ?? i18nextConfig.i18n.defaultLocale;

    res.setHeader("Set-Cookie", [`NEXT_LOCALE=${appLocale}`]);
    i18nextConfig.backend.backendOption.customHeaders = {
      "X-Academy-Domain": host
    };

    const locales = {
      ...(await serverSideTranslations(
        appLocale,
        namespaces.map((ns) => `${ns}=${tenant.id}`),
        i18nextConfig
      ))
    };

    if (getServerSidePropsFunc) {
      const additionalProps = await getServerSidePropsFunc({
        ...context,
        store,
        host
      });

      if (typeof additionalProps === "object" && "props" in additionalProps && additionalProps) {
        return {
          props: {
            ...locales,
            ...additionalProps.props
          }
        };
      }

      return additionalProps;
    }

    return {
      props: {
        ...locales
      }
    };
  });
}
