import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IProject } from "../../interface/project.interface";
import { ProjectState } from "../../utils/project-state.enum";

interface IProjectLoader extends IProject {
  error: boolean;
  success: boolean;
  isLoading: boolean;
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
    setProjectCollection: (state, action: PayloadAction<IProject[]>) => {
      state.projectCollection = action.payload.map((el) => {
        return {
          ...el,
          error: false,
          success: false,
          isLoading: false,
        }
      });
    },

    deleteProjectItem: (state, action: PayloadAction<{ id: string }>) => {
      console.log(action.payload.id);
      state.projectCollection = state.projectCollection.filter(
        (item) => item.id !== action.payload.id
      );
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

    setProjectLoading: (state, action: PayloadAction<{ id: string }>) => {
      console.log(action.payload.id);
      state.projectCollection= state.projectCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
            isLoading: true,
          };
        }
        return value;
      });
    },

    successProjectLoading: (state, action: PayloadAction<{ id: string }>) => {
      console.log(action.payload.id);
      state.projectCollection= state.projectCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
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
  setProjectLoading,
  successProjectLoading,
} = projectSlice.actions;

export default projectSlice.reducer;
