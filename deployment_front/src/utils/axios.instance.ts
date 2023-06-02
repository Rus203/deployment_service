import axios from "axios";
import store from '../store';
import { updateCredentials, logOut } from "../store/Slices";

const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://209.38.193.18:3000/api'
  : 'http://localhost:3000/api'

const instance = axios.create({ baseURL });
let isRefreshing = false;


instance.interceptors.request.use((config) => {
  const account = store.getState().auth.account;
  if (account) {
    config.headers.Authorization = `Bearer ${account.accessToken}`;
  }

  return config;
});

instance.interceptors.response.use(response => response, async (error) => {
  const originalConfig = error.config;
  if (error.response.status === 401 && !isRefreshing) {
    isRefreshing = true;

    const account = store.getState().auth.account;
    if (account !== null) {
      try {
        console.log('Before updating');

        const response = await axios.post(baseURL + '/auth/refresh', {
          refreshToken: account.refreshToken
        });

        const { accessToken, refreshToken } = response.data;

        store.dispatch(updateCredentials({ accessToken, refreshToken }));
        originalConfig.headers.Authorization = `Bearer ${accessToken}`;
  
        return instance(originalConfig);
      } catch (e) {
        store.dispatch(logOut());
      } finally {
        isRefreshing = false;
      }
    }
  }

  return Promise.reject(error);
});

export default instance;
