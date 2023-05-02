import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { IProject } from "../interface/project.interface";
import { ILogin, IRegister, ILoginUserResult } from "../types";
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

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Project", "User"],

  endpoints: (build) => ({
    getProjects: build.query<IProject[], undefined>({
      query: () => "project",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Project" as const, id })),
              "Project",
            ]
          : ["Project"],
    }),

    getProject: build.query<IProject, string>({
      query: (id) => `project/${id}`,
      providesTags: (result) =>
        result ? [{ type: "Project" as const, id: result.id }] : ["Project"],
    }),

    createProject: build.mutation<IProject, FormData>({
      query: (body) => ({
        url: "project",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),

    updateProject: build.mutation<IProject, { body: FormData; id: string }>({
      query: ({ id, body }) => ({
        url: `project/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: "Project", id: args.id },
      ],
    }),

    deleteProject: build.mutation<boolean, string>({
      query: (id) => ({ url: `project/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project"],
    }),

    deployProject: build.mutation<boolean, string>({
      query: (id) => ({ url: `project/${id}/deploy`, method: "POST" }),
    }),

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
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useDeployProjectMutation,
  useGetProjectQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
} = projectsApi;

export const useGetProjectLazyQuery =
  projectsApi.endpoints.getProject.useLazyQuery;

export const useGetProjectsLazyQuery =
  projectsApi.endpoints.getProjects.useLazyQuery;
