export interface IAuthDto {
  login: string;
  password: string;
}

export interface ILoginUserResult {
  accessToken: string;
  refreshToken: string;
}
