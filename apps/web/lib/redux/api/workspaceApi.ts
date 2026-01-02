import { rootApi } from './rootApi';

interface Workspace {
  _id: string;
  name: string;
  slug: string;
  role: string;
}

// Helper type for the raw backend response
interface GetWorkspacesResponse {
  success: boolean;
  workspaces: Workspace[];
}

interface CreateWorkspaceResponse {
  success: boolean;
  workspace: Workspace;
}

export const workspaceApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Fetch all workspaces
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => '/workspaces',
      // 👇 THIS FIXES THE ERROR: Extract the array from the response object
      transformResponse: (response: GetWorkspacesResponse) => response.workspaces,
      providesTags: ['Workspaces'],
    }),
    
    // 2. Create a new workspace
    createWorkspace: builder.mutation<Workspace, { name: string }>({
      query: (data) => ({
        url: '/workspaces',
        method: 'POST',
        body: data,
      }),
      // 👇 Fix creation too: Extract the single workspace object
      transformResponse: (response: CreateWorkspaceResponse) => response.workspace,
      invalidatesTags: ['Workspaces'],
    }),
  }),
});

export const { useGetWorkspacesQuery, useCreateWorkspaceMutation } = workspaceApi;