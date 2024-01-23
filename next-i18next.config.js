const HttpBackend = require("i18next-http-backend/cjs");
const MultiLoadBackendAdapter = require("i18next-multiload-backend-adapter/cjs");
const { axios, getTenantHost } = require("./lib/axios");
const IS_CLIENT = typeof window !== "undefined";

module.exports = {
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "ar"
  },
  maxParallelReads: 30,
  serializeConfig: false,
  reloadOnPrerender: true,
  use: [MultiLoadBackendAdapter],
  backend: {
    backend: HttpBackend,
    backendOption: {
      loadPath: "{{lng}}|{{ns}}",
      customHeaders: {},
      request: async (options, url, payload, callback) => {
        try {
          const [lng, ns] = url.split("|");

          const headers = options.customHeaders || {};

          if (IS_CLIENT && !headers["X-Academy-Domain"]) {
            headers["X-Academy-Domain"] = getTenantHost(window.location.host);
          }

          const group = ns.split("+").filter((n) => !n.includes("cacheKey$"));

          const cacheKey = ns
            .split("+")
            .filter((n) => n.includes("cacheKey$"))
            .find((n) => n)
            ?.split("$")[1];

          await axios
            .get("http://localhost:3000/api/translations", {
              params: { group },
              headers
            })
            .then((response) => {
              callback(null, {
                data: {
                  ar: {
                    [`cacheKey$${cacheKey}`]: {
                      ...response.data.data["ar"]
                    }
                  }
                },
                status: 200
              });
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log("response error: ", error.response.data);
              callback(null, {
                status: 500
              });
            });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("catch error: ", e);
          callback(null, {
            status: 500
          });
        }
      }
    }
  }
};
