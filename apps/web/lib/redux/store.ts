import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import builderReducer from './slices/builderSlice';
import { rootApi } from './api/rootApi';

// 1. Create a root reducer that combines all slices
const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  builder: builderReducer,
  [rootApi.reducerPath]: rootApi.reducer,
});

// 2. Configure Persistence
const persistConfig = {
  key: 'root',
  storage,
  // Blacklist the API cache (RTK Query manages its own cache life)
  blacklist: [rootApi.reducerPath], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    // 3. Middleware to ignore serializable checks for Redux Persist actions
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(rootApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];