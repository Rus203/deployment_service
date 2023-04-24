import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IInitialState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: IInitialState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { accessToken, refreshToken } }: PayloadAction<IInitialState>
    ) => {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },

    logOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
