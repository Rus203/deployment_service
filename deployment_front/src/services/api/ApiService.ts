import axios from "axios";

abstract class ApiService {
  private instance = axios.create({
    baseURL: `${process.env.REACT_APP_DOMAIN}`,
    withCredentials: false,
  });

  constructor() {
    this.instance.interceptors.request.use((config) => {
      console.log(config)
      const accessToken: null | string = localStorage.getItem("access");
      console.log('access token', accessToken)
      if (accessToken !== null) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      }

      // throw new Error("Not provide an access token in the localstorage");
      return config

    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log('ere', error);
        const originalConfig = error.config;
        
        if (error.response.status === 401 && originalConfig._retry !== true) {
          originalConfig._retry = true;
          const oldRefreshToken: null | string =
            localStorage.getItem("refresh");
          if (oldRefreshToken !== null) {
            try {
              const response = await axios.post("/auth/update-tokens", {
                refreshToken: oldRefreshToken,
              });
              const { accessToken, refreshToken } = response.data.tokens;
              localStorage.setItem("access", accessToken);
              localStorage.setItem("refresh", refreshToken);

              originalConfig.headers.Authorization = `Bearer ${accessToken}`;
              return await this.instance(originalConfig);
            } catch (e) {
              console.error("Error refreshing token", e);
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
            }
          }
        }
        return await Promise.reject(error);
      }
    );
  }

  protected _get = async <ReturnType = unknown>(
    url: string,
    params?: object
  ): Promise<ReturnType> => {
    try {
      const res = await this.instance.get(url, { params });
      return res.data;
    } catch (error) {
      return Promise.reject(this._handleError(error));
    }
  };

  protected _post = async <
    ReturnType = unknown,
    BodyType = unknown,
    ParamsType = unknown
  >(
    url: string,
    body: BodyType,
    params?: ParamsType
  ): Promise<ReturnType> => {
    try {
      const res = await this.instance.post(url, body, { params });
      return res.data;
    } catch (error) {
      return Promise.reject(this._handleError(error));
    }
  };

  protected _delete = async <ReturnType>(url: string): Promise<ReturnType> => {
    try {
      const res = await this.instance.delete(url);
      return res.data;
    } catch (error) {
      return Promise.reject(this._handleError(error));
    }
  };

  protected _put = async <ReturnType, BodyType>(
    url: string,
    body: BodyType
  ): Promise<ReturnType> => {
    try {
      const res = await this.instance.put(url, body);
      return res.data;
    } catch (error) {
      return Promise.reject(this._handleError(error));
    }
  };

  private _handleError = (error: any) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      throw error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      // 'error.request' is an instance of XMLHttpRequest in the
      // browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      throw error.request;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      throw error;
    }
  };
}

export default ApiService;
