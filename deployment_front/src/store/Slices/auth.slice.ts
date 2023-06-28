import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IAccount {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
}

interface IInitialState {
  account: IAccount | null
}

interface IUpdateTokens {
  accessToken: string;
  refreshToken: string;
}

let initialState: IInitialState = {
  account: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IAccount>
) => { state.account = action.payload },

    updateCredentials: (state, action: PayloadAction<IUpdateTokens>) => {
      if (state.account !== null) {
        state.account.accessToken = action.payload.accessToken
        state.account.refreshToken = action.payload.refreshToken
      }
    },

    logOut: (state) => {
      state.account = null
    },
  },
});

export const { setCredentials, logOut, updateCredentials } = authSlice.actions;

export default authSlice.reducer;

