import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMiniBack } from "../../interface/miniback.interface";

interface IInitialState {
  miniBackCollection: IMiniBack[]
}

const initialState: IInitialState = {
  miniBackCollection: []
}   

const miniBackSlice = createSlice({
    name: "mini-back",
    initialState,
    reducers: {
      setMiniBackCollection: (state, action: PayloadAction<IMiniBack[]>) => {
        state.miniBackCollection = action.payload
      },

      addMiniBackItem: (state, action: PayloadAction<IMiniBack>) => {
        state.miniBackCollection = [...state.miniBackCollection, action.payload]
      },
  
      deleteMiniBackItem: (state, action: PayloadAction<{ id: string }>) => {
        state.miniBackCollection = state.miniBackCollection.filter(item => (
          item.id !== action.payload.id
        ))
      }
    },
  });
  
  export const { setMiniBackCollection, deleteMiniBackItem, addMiniBackItem } = miniBackSlice.actions;
  
  export default miniBackSlice.reducer;
  