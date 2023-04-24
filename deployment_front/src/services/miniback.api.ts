import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { IMiniback } from "../interface/miniback.interface";
import { RootState } from "../store";
import { setCredentials } from "../store/features";

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
        api.dispatch(setCredentials({ accessToken: null, refreshToken: null }));
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

        api.dispatch(setCredentials({ accessToken, refreshToken }));
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }
  return result;
};

export const minibacksApi = createApi({
  reducerPath: "minibacksApi",
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Miniback"],

  endpoints: (build) => ({
    getMinibacks: build.query<IMiniback[], undefined>({
      query: () => "mini-back",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Miniback" as const, id })),
              "Miniback",
            ]
          : ["Miniback"],
    }),

    getMiniback: build.query<IMiniback, string>({
      query: (id) => `mini-back/${id}`,
      providesTags: (result) =>
        result ? [{ type: "Miniback" as const, id: result.id }] : ["Miniback"],
    }),

    createMiniback: build.mutation<IMiniback, FormData>({
      query: (body) => ({
        url: "mini-back",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Miniback"],
    }),

    updateMiniback: build.mutation<IMiniback, { body: FormData; id: string }>({
      query: ({ id, body }) => ({
        url: `miniback/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: "Miniback", id: args.id },
      ],
    }),

    deleteMiniback: build.mutation<boolean, string>({
      query: (id) => ({ url: `mini-back/${id}`, method: "DELETE" }),
      invalidatesTags: ["Miniback"],
    }),

    deployMiniback: build.mutation<boolean, string>({
      query: (id) => ({ url: `mini-back/${id}/deploy`, method: "POST" }),
    }),
  }),
});

export const {
  useCreateMinibackMutation,
  useDeleteMinibackMutation,
  useGetMinibackQuery,
  useDeployMinibackMutation,
  useGetMinibacksQuery,
} = minibacksApi;

export const useGetProjectLazyQuery =
  minibacksApi.endpoints.getMinibacks.useLazyQuery;

export const useGetProjectsLazyQuery =
  minibacksApi.endpoints.getMinibacks.useLazyQuery;
