import { useTranslation } from "next-i18next";

import { useFetchTenantQuery } from "@/store/slices/api/tenantSlice";

function transformUrl(url: string) {
  // Replace dots and hyphens with underscores
  return url.replace(/\./g, "_").replace(/-/g, "_");
}

export default function useScopedTranslation() {
  const { data } = useFetchTenantQuery();
  const { t, ...rest } = useTranslation();
  const scopedT = (key: string) => {
    if (!data) {
      return t(key);
    }

    const [ns, value] = key.split(":");

    return t(`cacheKey$${transformUrl(data?.domain)}:${ns}.${value}`);
  };
  return {
    t: scopedT,
    ...rest
  };
}
