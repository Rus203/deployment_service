import { combineReducers, configureStore } from "@reduxjs/toolkit";

import localStorage from "redux-persist/lib/storage";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { projectsApi } from "../services";
import { authReducer } from "./features";

const persistConfig = {
  key: "root",
  storage: localStorage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  [projectsApi.reducerPath]: projectsApi.reducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(projectsApi.middleware),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
