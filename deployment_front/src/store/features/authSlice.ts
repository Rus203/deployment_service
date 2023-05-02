import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IInitialState {
  accessToken: string | null;
  refreshToken: string | null;
  name: string | null;
  email: string | null;
}

interface IUpdateTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: IInitialState = {
  accessToken: null,
  refreshToken: null,
  name: null,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<IUpdateTokens>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    logOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.name = null;
      state.email = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
