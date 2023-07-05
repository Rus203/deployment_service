import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMiniBack } from "../../interface/miniback.interface";
import { MiniBackState } from "../../utils/mini-back-state.enum";

interface IMinibackLoader extends IMiniBack {
  error: boolean;
  success: boolean;
  isLoading: boolean;
  loadingAmount: number;
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
        const miniback = state.miniBackCollection.find(item => item.id === el.id)
        if (miniback)  {
          if (el.deployState !== MiniBackState.UNDEPLOYED) {
            return {
              ...el,
              error: false,
              success: false,
              isLoading: false,
              loadingAmount: 0,
            }
          }

          return miniback
        }

        return {
          ...el,
          error: false,
          success: false,
          isLoading: false,
          loadingAmount: 0,
        }
      });
    },

    deleteMiniBackItem: (state, action: PayloadAction<{ id: string }>) => {
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

    setLoadingMiniBack: (state, action: PayloadAction<{ loadingAmount: number, miniBackId: string}>) => {
      state.miniBackCollection = state.miniBackCollection.map((value) => {
        if (value.id === action.payload.miniBackId) {
          return {
            ...value,
            loadingAmount: action.payload.loadingAmount,
            isLoading: true,
          };
        }
        return value;
      });
    },

    successMiniBackLoading: (state, action: PayloadAction<{ id: string }>) => {
      state.miniBackCollection = state.miniBackCollection.map((value) => {
        if (value.id === action.payload.id) {
          return {
            ...value,
            state: MiniBackState.DEPLOYED,
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
  setLoadingMiniBack,
  successMiniBackLoading,
} = miniBackSlice.actions;

export default miniBackSlice.reducer;
