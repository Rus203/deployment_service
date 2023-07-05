import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  host: string | null
}

const initialState: IInitialState = {
  host: null
};

const HealthCheckerSlice = createSlice({
  name: "heal-checker",
  initialState,
  reducers: {
    addInfo(state, action: PayloadAction<string>) {
      state.host = action.payload
    },

    dropInfo(state) {
      state.host = null
    }
  },
});

export const { addInfo, dropInfo } = HealthCheckerSlice.actions;

export default HealthCheckerSlice.reducer;
