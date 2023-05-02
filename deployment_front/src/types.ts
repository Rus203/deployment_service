export interface IRegister {
  email: string;
  password: string;
  name: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginUserResult {
  accessToken: string;
  refreshToken: string;
  name: string,
  email: string
}
