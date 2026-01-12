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
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import builderReducer from './slices/builderSlice';
import { rootApi } from './api/rootApi';

// 1. Combine all reducers
const appReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  builder: builderReducer,
  [rootApi.reducerPath]: rootApi.reducer,
});

// 2. Root Reducer with "Reset on Logout"
const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    // This clears the Redux state completely
    storage.removeItem('persist:root'); // Optional: Clear LocalStorage explicitly
    state = undefined; 
  }
  return appReducer(state, action);
};

// 3. Configure Persistence
const persistConfig = {
  key: 'root',
  storage,
  blacklist: [rootApi.reducerPath], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
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