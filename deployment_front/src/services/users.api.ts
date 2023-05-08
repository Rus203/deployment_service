import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { ILogin, IRegister, ILoginUserResult } from "../types";
import { RootState } from "../store";
import { updateCredentials } from "../store/features";

const BASE_BACK_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACK_DEPLOYMENT_URL
    : process.env.REACT_APP_BACK_DEV_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_BACK_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const { getState } = api;
    const refreshToken = (getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const { data } = await baseQuery(
        {
          url: "/auth/refresh",
          body: { refreshToken },
          method: "POST",
        },
        api,
        extraOptions
      );

      if (!data) {
        api.dispatch(updateCredentials({ accessToken: null, refreshToken: null }));
      }

      if (
        data &&
        typeof data === "object" &&
        "accessToken" in data &&
        "refreshToken" in data &&
        typeof data.accessToken === "string" &&
        typeof data.refreshToken === "string"
      ) {
        const { accessToken, refreshToken } = data;

        api.dispatch(updateCredentials({ accessToken, refreshToken }));
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }
  return result;
};

export const usersApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Project", "User"],

  endpoints: (build) => ({
    registerUser: build.mutation<undefined, IRegister>({
      query: (body) => ({
        url: "auth/sign-up",
        method: "POST",
        body,
      }),
    }),

    loginUser: build.mutation<ILoginUserResult, ILogin>({
      query: (body) => ({
        url: "auth/sign-in",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
} = usersApi;
