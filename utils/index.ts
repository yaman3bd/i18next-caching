export const randomUUID = (): string => {
  let dt = new Date().getTime();

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (dt + Math.random() * 16) % 16 | 0;

    dt = Math.floor(dt / 16);

    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const IS_CLIENT: boolean = typeof window !== "undefined";

export type GetQueryErrorsResult =
  | null
  | {
      props: any | Promise<any>;
    }
  | {
      notFound: true;
    }
  | {
      redirect: any;
    };

export const getQueryErrors = (
  fetchers: Array<any> | any,
  store: any,
  args?: Array<any> | any,
  callbackURI?: string,
  redirectURI?: string
): GetQueryErrorsResult => {
  if (Array.isArray(fetchers)) {
    const errors = fetchers
      .map((fetcher, index) => {
        if (Array.isArray(args)) {
          return fetcher.select(args[index])(store.getState()).error;
        }

        return fetcher.select(args)(store.getState()).error;
      })
      .filter((error) => error);

    if (!errors.length) {
      return null;
    }

    if (errors.some((error) => error.status == 404)) {
      return {
        notFound: true
      };
    }

    if (errors.some((error) => error.status == 500)) {
      return {
        props: {
          _apiError: errors.find((error) => error.status == 500)
        }
      };
    }

    if (errors.some((error) => error.status == 403) && redirectURI) {
      return {
        redirect: {
          permanent: false,
          destination: encodeURI(redirectURI)
        }
      };
    }

    if (errors.some((error) => error.status == 401)) {
      return {
        redirect: {
          permanent: false,
          destination: callbackURI ? `/login?callbackUrl=${encodeURI(callbackURI)}` : "/login"
        }
      };
    }
  } else {
    const error = fetchers.select(args)(store.getState()).error;

    if (!error) {
      return null;
    }

    if (error?.status == 404) {
      return {
        notFound: true
      };
    }

    if (error?.status == 500) {
      return {
        props: {
          _apiError: error
        }
      };
    }

    if (error?.status == 403 && redirectURI) {
      return {
        redirect: {
          permanent: false,
          destination: encodeURI(redirectURI)
        }
      };
    }

    if (error?.status == 401) {
      return {
        redirect: {
          permanent: false,
          destination: callbackURI ? `/login?callbackUrl=${encodeURI(callbackURI)}` : "/login"
        }
      };
    }
  }

  return {
    props: {}
  };
};
