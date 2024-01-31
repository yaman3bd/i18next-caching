import { useCallback, useMemo } from "react";

import { TOptions } from "i18next";
import { useTranslation } from "next-i18next";

import { useFetchTenantQuery } from "@/store/slices/api/tenantSlice";

export default function useScopedTranslation(ns: string[]) {
  const { data, isFetching, isError, refetch } = useFetchTenantQuery();

  // If data is not available, and it's still fetching, throw a promise to wait for the data.
  if (!data && isFetching) {
    throw new Promise((resolve) => {
      const checkData = setInterval(() => {
        if (data) {
          clearInterval(checkData);
          resolve(null);
        }
      }, 1000);

      // Clear interval on component unmount
      return () => {
        clearInterval(checkData);
      };
    });
  }
  // If there is an error, throw refetch to try again.
  if (isError) {
    throw refetch();
  }

  const scopedNS = useMemo<Array<string>>(() => ns.map((n) => `${n}=${data?.id}`), [ns, data?.id]);

  const { t, ...rest } = useTranslation(scopedNS);

  const scopedT = useCallback(
    (key: string, tOptions?: TOptions) => {
      if (!data) {
        return t(key);
      }

      const [ns, value] = key.split(":");
      const tKey = `${ns}=${data.id}:${value}`;

      if (tOptions) {
        return t(tKey, tOptions);
      }

      return t(tKey);
    },
    [data, t]
  );

  return {
    t: scopedT,
    ...rest
  };
}
