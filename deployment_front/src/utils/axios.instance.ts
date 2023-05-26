import axios from "axios";
import store from '../store';
import { updateCredentials, logOut } from "../store/Slices";


const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'http://209.38.193.18:3000/api'
    : 'http://localhost:3000/api'
});


instance.interceptors.request.use((config) => {
  const account = store.getState().auth.account; 
  if (account) {
    config.headers.Authorization = `Bearer ${account.accessToken}`
  }

  return config
})

instance.interceptors.response.use(response => response,
  async (error) => {
    const originalConfig = error.config
    if (error.response.status === 401 && originalConfig._retry !== true) {
      originalConfig._retry = true
      const account = store.getState().auth.account; 
      if (account !== null) {
        try {
          const response = await axios.post('/api/auth/refresh', {
            refreshToken: account.refreshToken
          })
          const { accessToken, refreshToken } = response.data.tokens
          store.dispatch((updateCredentials({ accessToken, refreshToken})))

          originalConfig.headers.Authorization = `Bearer ${accessToken}`
          return await instance(originalConfig)
        } catch (e) {
          console.error('Error while updating tokens ', e)
          store.dispatch(logOut())
        }
      }
    }
    return await Promise.reject(error)
  }
)



export default instance;
