import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { IProject } from "../interface/project.interface";
import { LargeNumberLike } from "crypto";
import { IStatistic } from "../interface/statictic.interface";

const baseQuery = fetchBaseQuery({
  baseUrl: '',
});

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQuery,

  tagTypes: ["Project"],

  endpoints: (build) => ({
    getProjects: build.query<IProject[], { serverUrl?: string, port?: number }>({
      query: ({ serverUrl, port }) => serverUrl && port ? `http://${serverUrl}:${port}/project` : '',
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

    createProject: build.mutation<IProject, { serverUrl?: string, port?: number, body: FormData}>({
      query: ({ body, port, serverUrl }) => serverUrl && port ? ({
        url: `http://${serverUrl}:${port}/project/`,
        method: "POST",
        body,
      }) : '',
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

    deleteProject: build.mutation<boolean, { serverUrl?: string, port?: number, id: string}>({
      query: ({ serverUrl, port, id}) => serverUrl && port ? ({ url: `http://${serverUrl}:${port}/project/${id}/delete`, method: "POST" }) : '',
      invalidatesTags: ["Project"],
    }),

    deployProject: build.mutation<boolean, string>({
      query: (id) => ({ url: `project/${id}/deploy`, method: "POST" }),
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
} = projectsApi;

export const useGetProjectLazyQuery =
  projectsApi.endpoints.getProject.useLazyQuery;

export const useGetProjectsLazyQuery =
  projectsApi.endpoints.getProjects.useLazyQuery;
