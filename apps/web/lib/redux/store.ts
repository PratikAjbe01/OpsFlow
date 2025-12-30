import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { rootApi } from './api/rootApi'; 

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [rootApi.reducerPath]: rootApi.reducer,
    },
    // Add the api middleware (enables caching, invalidation, polling)
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rootApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];