const HttpBackend = require("i18next-http-backend/cjs");
const MultiLoadBackendAdapter = require("i18next-multiload-backend-adapter/cjs");
const { axios, getTenantHost } = require("./lib/axios");
const IS_CLIENT = typeof window !== "undefined";

function addPrefixToObject(originalObj, scope) {
  //whatever the logic is
  // Deep copy the original object
  const newObj = JSON.parse(JSON.stringify(originalObj));

  // Loop over each language
  for (const lang in newObj) {
    if (newObj.hasOwnProperty(lang)) {
      const langObj = newObj[lang];

      // Loop over each namespace within the language
      for (const namespace in langObj) {
        if (langObj.hasOwnProperty(namespace)) {
          // Add the scope to the namespace
          const scopedNamespace = namespace + scope;

          // Update the object with the new property
          langObj[scopedNamespace] = langObj[namespace];

          // Optional: You can delete the old property if needed
          delete langObj[namespace];
        }
      }
    }
  }

  return newObj;
}

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

          const groupArr = ns.split("+");
          const group = groupArr.map((n) => n.split("=")[0]);

          const cacheKey = groupArr[0]?.split("=")[1];

          await axios
            .get("http://localhost:3000/api/translations", {
              params: { group },
              headers
            })
            .then((response) => {
              callback(null, {
                data: addPrefixToObject(response.data.data, `=${cacheKey}`),
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
