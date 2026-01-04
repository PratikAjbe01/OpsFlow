import { rootApi } from './rootApi';

export interface Form {
  _id: string;
  name: string;
  workspaceId: string;
  isPublished: boolean;
  submissionsCount: number;
  createdAt: string;
  updatedAt: string;
  content: any[]; 
}

export const formApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get all forms for a specific workspace
    getForms: builder.query<Form[], string>({
      query: (workspaceId) => `/forms?workspaceId=${workspaceId}`,
      transformResponse: (response: { forms: Form[] }) => response.forms,
      providesTags: ['Forms'],
    }),

    // 2. Create a new form
    createForm: builder.mutation<Form, { name: string; workspaceId: string }>({
      query: (data) => ({
        url: '/forms',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { form: Form }) => response.form,
      invalidatesTags: ['Forms'],
    }),

    // 3. Get single form (for the editor later)
    getFormById: builder.query<Form, string>({
      query: (id) => `/forms/${id}`,
      transformResponse: (response: { form: Form }) => response.form,
    }),
    deleteForm: builder.mutation<void, string>({
      query: (id) => ({
        url: `/forms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Forms'], // This auto-refreshes the list!
    }),
  }),
});

export const { useGetFormsQuery, useCreateFormMutation, useGetFormByIdQuery, useDeleteFormMutation } = formApi;