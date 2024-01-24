import { useTranslation } from "next-i18next";

import { useFetchTenantQuery } from "@/store/slices/api/tenantSlice";

export default function useScopedTranslation() {
  const { data } = useFetchTenantQuery();
  const { t, ...rest } = useTranslation();
  const scopedT = (key: string) => {
    if (!data) {
      return t(key);
    }

    const [ns, value] = key.split(":");

    return t(`${ns}=${data.id}:${value}`);
  };
  return {
    t: scopedT,
    ...rest
  };
}
