import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IProject } from "../../interface/project.interface";
import { ProjectState } from "../../utils/project-state.enum";

interface IProjectLoader extends IProject {
  error: boolean;
  success: boolean;
  isLoading: boolean;
  miniBackId: string;
  loadingAmount: number;
}

interface IInitialState {
  projectCollection: IProjectLoader[];
}

const initialState: IInitialState = {
  projectCollection: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectCollection: (state, action: PayloadAction<{ projects: IProject[], miniBackId: string}>) => {
      state.projectCollection = action.payload.projects.map((el) => {
        const project = state.projectCollection.find(item => item.id === el.id)
        if (project) {
          if (el.state !== ProjectState.UNDEPLOYED) {
            return {
              ...el,
              miniBackId: action.payload.miniBackId,
              error: false,
              success: false,
              isLoading: false,
              loadingAmount: 0,
            }
          }

          return project
        }

        return {
          ...el,
          miniBackId: action.payload.miniBackId,
          error: false,
          success: false,
          isLoading: false,
          loadingAmount: 0,
        }
      });
    },

    deleteProjectItem: (state, action: PayloadAction<{ id: string }>) => {
      state.projectCollection = state.projectCollection.filter(
        (item) => item.id !== action.payload.id
      );
    },

    deleteMiniBackProjects: (state, action: PayloadAction<{ id: string }>) => {
      state.projectCollection = state.projectCollection.filter(item => item.miniBackId !== action.payload.id)
    },

    setProjectStatus: (
      state,
      action: PayloadAction<{ id: string; status: ProjectState }>
    ) => {
      state.projectCollection = state.projectCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
            deployState: action.payload.status,
          };
        }
        return value;
      });
    },

    setLoadingAmount: (state, action: PayloadAction<{ loadingAmount: number, projectId: string }>) => {
      state.projectCollection = state.projectCollection.map(project => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            isLoading: true,
            loadingAmount: action.payload.loadingAmount
          }
        }

        return project
      })
    },

    successProjectLoading: (state, action: PayloadAction<{ id: string }>) => {
      state.projectCollection= state.projectCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
            state: ProjectState.DEPLOYED,
            success: true,
            isLoading: false,
          };
        }
        return value;
      });
    },

    rejectProjectLoading: (state, action: PayloadAction<{ id: string }>) => {
      state.projectCollection= state.projectCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
            error: true,
            isLoading: false,
          };
        }
        return value;
      });
    },
  },
});

export const {
  setProjectCollection,
  deleteProjectItem,
  setProjectStatus,
  rejectProjectLoading,
  successProjectLoading,
  deleteMiniBackProjects,
  setLoadingAmount
} = projectSlice.actions;

export default projectSlice.reducer;
