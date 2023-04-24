import { ILoginData, IRegisterData } from "../interface/IregisterData";
import ApiService from "./ApiService";

class AuthApiService extends ApiService {
  registerUser = (data: IRegisterData): Promise<void> => {
    return this._post<void, IRegisterData>("/auth/sign-up", data);
  };

  loginUser = (data: ILoginData): Promise<void> => {
    return this._post<void, IRegisterData>("/auth/sign-in", data);
  };
}


export default new AuthApiService();
