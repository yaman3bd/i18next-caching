import { useCallback, useMemo } from "react";

import { TOptions } from "i18next";
import { useTranslation } from "next-i18next";

import { useAppSelector } from "@/hooks/redux";
import { getTenantHost } from "@/lib/axios";
import { AppSliceStateType } from "@/store/slices/app-slice";
import { IS_CLIENT } from "@/utils";

export default function useScopedTranslation(ns: string[]) {
  const { tenantHost } = useAppSelector<AppSliceStateType>((state) => state.app);

  const host = useMemo<string>(() => {
    if (!tenantHost && IS_CLIENT) {
      return getTenantHost(window.location.host);
    } else {
      return tenantHost;
    }
  }, [tenantHost]);

  const scopedNS = useMemo<Array<string>>(() => {
    if (!host) {
      return ns;
    } else {
      return ns.map((n) => `${n}=${host.replace(/[^a-zA-Z0-9]/g, "_")}`);
    }
  }, [ns, host]);

  const { t, ...rest } = useTranslation(scopedNS);

  const scopedT = useCallback(
    (key: string, tOptions?: TOptions) => {
      if (!host) {
        return t(key);
      }

      const [ns, value] = key.split(":");
      const tKey = `${ns}=${host.replace(/[^a-zA-Z0-9]/g, "_")}:${value}`;

      if (tOptions) {
        return t(tKey, tOptions);
      }

      return t(tKey);
    },
    [host, t]
  );

  return {
    t: scopedT,
    ...rest
  };
}
