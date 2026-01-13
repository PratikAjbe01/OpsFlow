'use client';

import { useGetFormsQuery, useDeleteFormMutation } from '@/lib/redux/api/formApi';
import { useAppSelector } from '@/lib/redux/hooks';
import Link from 'next/link';
import { Calendar, BarChart, Trash2, Plus } from 'lucide-react';

export default function MyFormsList() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth); // Get current user
  
  // Fetch ALL workspace forms (we filter client-side for now)
  const { data: forms, isLoading } = useGetFormsQuery(
    currentWorkspace?._id || '', 
    { skip: !currentWorkspace }
  );
  
  const [deleteForm] = useDeleteFormMutation();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this form?')) {
        await deleteForm(id);
    }
  };

  if (!currentWorkspace) return null;
  if (isLoading) return <div className="mt-8 text-gray-500">Loading your forms...</div>;

  // 👇 THE FILTER LOGIC: Only show forms where I am the creator
  const myForms = forms?.filter((f: any) => f.creatorId === user?.id) || [];

  return (
    <div className="mt-8">
      {myForms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <h3 className="text-sm font-medium text-gray-900">You haven't created any forms yet</h3>
            <p className="mt-1 text-sm text-gray-500">Go to the dashboard to create one.</p>
            <div className="mt-6">
                <Link href="/dashboard" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                    <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Go to Dashboard
                </Link>
            </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myForms.map((form: any) => (
            <Link 
              key={form._id} 
              href={`/builder/${form._id}`}
              className="group relative block rounded-lg bg-white shadow transition hover:shadow-md border border-gray-100"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(e, form._id)}
                className="absolute top-4 right-4 z-10 p-2 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 rounded-full transition-all"
                title="Delete Form"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 truncate pr-8">
                  {form.name}
                </h3>
                
                <p className="mt-1 text-sm text-gray-500">
                  {form.isPublished ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Published</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Draft</span>
                  )}
                </p>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <BarChart className="mr-1.5 h-4 w-4 text-gray-400" />
                    {form.submissionsCount}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                    {new Date(form.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}