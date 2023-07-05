import { configureStore, combineReducers } from '@reduxjs/toolkit'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { authReducer, miniBackReducer, projectReducer, healthReducer } from './Slices'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [healthReducer.name]
}

const rootReducer = combineReducers({
  auth: authReducer,
  miniBack: miniBackReducer,
  project: projectReducer,
  health: healthReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export default store

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch