import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMiniBack } from "../../interface/miniback.interface";
import { MiniBackState } from "../../utils/mini-back-state.enum";

interface IInitialState {
  miniBackCollection: IMiniBack[];
}

const initialState: IInitialState = {
  miniBackCollection: [],
};

const miniBackSlice = createSlice({
  name: "mini-back",
  initialState,
  reducers: {
    setMiniBackCollection: (state, action: PayloadAction<IMiniBack[]>) => {
      state.miniBackCollection = action.payload;
    },

    addMiniBackCollection: (state, action: PayloadAction<IMiniBack[]>) => {
      state.miniBackCollection = action.payload;
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
      const item = state.miniBackCollection.find(
        (el) => el.id === action.payload.id
      );

      if (item) {
        item.deployState = action.payload.status;
      }

      return state;
    },
  },
});

export const {
  setMiniBackCollection,
  deleteMiniBackItem,
  addMiniBackCollection,
  setMiniBackStatus,
} = miniBackSlice.actions;

export default miniBackSlice.reducer;
