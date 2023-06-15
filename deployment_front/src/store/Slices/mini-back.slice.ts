import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMiniBack } from "../../interface/miniback.interface";
import { MiniBackState } from "../../utils/mini-back-state.enum";

interface IMinibackLoader extends IMiniBack {
  error: boolean;
  success: boolean;
  isLoading: boolean;
}

interface IInitialState {
  miniBackCollection: IMinibackLoader[];
}

const initialState: IInitialState = {
  miniBackCollection: [],
};

const miniBackSlice = createSlice({
  name: "mini-back",
  initialState,
  reducers: {
    setMiniBackCollection: (state, action: PayloadAction<IMiniBack[]>) => {
      state.miniBackCollection = action.payload.map((el) => {
        return {
          ...el,
          error: false,
          success: false,
          isLoading: false,
        }
      });
    },

    deleteMiniBackItem: (state, action: PayloadAction<{ id: string }>) => {
      console.log(action.payload.id);
      state.miniBackCollection = state.miniBackCollection.filter(
        (item) => item.id !== action.payload.id
      );
    },

    setMiniBackStatus: (
      state,
      action: PayloadAction<{ id: string; status: MiniBackState }>
    ) => {
      state.miniBackCollection = state.miniBackCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
            deployState: action.payload.status,
          };
        }
        return value;
      });
    },

    setMiniBackLoading: (state, action: PayloadAction<{ id: string }>) => {
      console.log(action.payload.id);
      state.miniBackCollection = state.miniBackCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
            isLoading: true,
          };
        }
        return value;
      });
    },

    successMiniBackLoading: (state, action: PayloadAction<{ id: string }>) => {
      console.log(action.payload.id);
      state.miniBackCollection = state.miniBackCollection.map((value) => {
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

    rejectMiniBackLoading: (state, action: PayloadAction<{ id: string }>) => {
      state.miniBackCollection = state.miniBackCollection.map((value) => {
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
  setMiniBackCollection,
  deleteMiniBackItem,
  setMiniBackStatus,
  rejectMiniBackLoading,
  setMiniBackLoading,
  successMiniBackLoading,
} = miniBackSlice.actions;

export default miniBackSlice.reducer;
