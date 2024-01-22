const Axios = require("axios").default;

const axios = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/tenant`,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest"
  }
});

function getTenantHost(req) {
  if (process.env.NEXT_PUBLIC_OVERWRITE_TENANT_DOMAIN) {
    return process.env.NEXT_PUBLIC_OVERWRITE_TENANT_DOMAIN;
  }

  if (typeof req === "string") {
    return req;
  }

  if (typeof req === "object" && req.headers && req.headers.host) {
    return req.headers.host;
  }

  throw new Error("Invalid request parameter");
}

module.exports = {
  getTenantHost,

  axios
};
