import type { NextApiRequest, NextApiResponse } from "next";

import tenant1 from "../../public/locales/ar/tenant1.json";
import tenant2 from "../../public/locales/ar/tenant2.json";

const TENANT_1_HOST = "academy.msaaqdev.com";
const TENANT_2_HOST = "yaman.msaaqdev.com";
const TENANTS_MAP = {
  "tenant-1": TENANT_1_HOST,
  "tenant-2": TENANT_2_HOST
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const group = req.query["group[]"] as string[];
  try {
    if (group.length === 0) {
      return res.status(200).json({
        data: {
          ar: {}
        }
      });
    }

    const nss = group.filter((g) => !g.includes("tenant"));
    // @ts-ignore
    const host = TENANTS_MAP[group.filter((g) => g.includes("tenant"))[0]];

    if (nss.length === 0) {
      res.status(200).json({
        data: {
          ar: {}
        }
      });
    } else {
      res.status(200).json({
        data: {
          ar: nss.reduce((acc, curr) => {
            return {
              ...acc,
              // @ts-ignore
              [curr]: host === TENANT_1_HOST ? tenant1[curr] : tenant2[curr]
            };
          }, {})
        }
      });
    }
  } catch (e) {
    res.status(200).json({
      data: {
        ar: {}
      }
    });
  }
}
