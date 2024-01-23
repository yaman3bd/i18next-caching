import { Inter } from "next/font/google";
import Link from "next/link";

import useScopedTranslation from "@/hooks/useScopedTranslation";
import { useFetchTenantQuery } from "@/store/slices/api/tenantSlice";
import { withCommonGetServerSideProps } from "@/utils/withCommonGetServerSideProps";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = withCommonGetServerSideProps(["auth", "tenant-2"], "yaman.msaaqdev.com");

export default function Tenant2() {
  const { data } = useFetchTenantQuery();
  const { t } = useScopedTranslation();

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <h1 className="flex flex-col text-center">
        <span className="text-5xl">You are In Tenant 2</span>
        <br />
        <span className="mt-2 text-xl">Tenant ID: {data && data.id}</span>
      </h1>
      <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
        <h2 className={`mb-3 text-2xl font-semibold`}>{t("auth:welcome_back")}</h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{t("auth:welcome_back_description")}</p>
      </div>
      <div className="flex flex-row">
        <Link
          href="/tenant-1"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h3 className={`text-lg font-semibold`}>back to tenant 1</h3>
        </Link>
        <Link
          href="/"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h3 className={`text-lg font-semibold`}>{t("common:back")}</h3>
        </Link>
      </div>
    </main>
  );
}
