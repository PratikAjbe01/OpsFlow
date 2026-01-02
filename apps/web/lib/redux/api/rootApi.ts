import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const rootApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Workspaces', 'Forms', 'Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8761/api', // Backend URL
    prepareHeaders: (headers, { getState }) => {
      // 1. Get token from Redux Store
      const token = (getState() as RootState).auth.accessToken;

      // 2. If token exists, add to headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}), 
});